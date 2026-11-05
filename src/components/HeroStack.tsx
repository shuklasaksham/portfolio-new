import { useEffect, useRef, type MutableRefObject } from 'react';
import { CORNERS, Plane, StackFace, proj, LW, LH, matrix, A, B, C, D } from './Plane';
import type { Project } from '../data/projects';
import { gsap, prefersReducedMotion } from '../lib/motion';

type Props = {
  project: Project;
  s: number;
  cx: number;
  cy: number;
  baseGap: number;
  /** 0..1 from scroll; adds up to `scrollGap` px of explode. */
  progress: MutableRefObject<number>;
  scrollGap?: number;
  hover: number;
  setHover?: (i: number) => void;
  onOpen?: (i: number) => void;
  labels?: { x: number } | null;
  redline?: boolean;
  connectors?: boolean;
  focusGap?: number;
  focusDx?: number;
  dive?: MutableRefObject<{ t: number; i: number }>;
  diveTo?: { cx: number; cy: number; s: number };
  dimOthers?: boolean;
};

/**
 * Exploded stack exactly as drawn in Figma: layers projected with the Figma matrix,
 * gap animated via --gap, plus dashed corner connectors, leader labels and the Δz redline.
 * Geometry for the SVG overlay is recomputed every frame from the same maths (no DOM reads).
 */
const DEFAULT_LABELS = { x: 1210 };

export function HeroStack(props: Props) {
  const {
    project, s, cx, cy, baseGap, progress, scrollGap = 60, hover, setHover, onOpen,
    labels = DEFAULT_LABELS, redline = true, connectors = true, focusGap = 125, focusDx = 64, dive, diveTo, dimOthers = true,
  } = props;
  // Latest props for the animation loop, so the loop itself only restarts when the project changes.
  const live = useRef({ cx, cy, s, baseGap, scrollGap, focusGap, focusDx, diveTo, labels, dimOthers });
  live.current = { cx, cy, s, baseGap, scrollGap, focusGap, focusDx, diveTo, labels, dimOthers };
  const root = useRef<HTMLDivElement>(null);
  const planes = useRef<(HTMLDivElement | null)[]>([]);
  const conn = useRef<SVGPathElement>(null);
  const leaders = useRef<(SVGPathElement | null)[]>([]);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const red = useRef<SVGPathElement>(null);
  const redTag = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(hover);
  hoverRef.current = hover;
  const n = project.stack.length;
  const mid = (n - 1) / 2;

  useEffect(() => {
    const st = { gap: 0, dx: Array(n).fill(0) as number[], dim: Array(n).fill(0) as number[], intro: 0 };
    if (prefersReducedMotion()) st.intro = 1;
    else gsap.to(st, { intro: 1, duration: 1.6, ease: 'expoOut', delay: 0.1 });
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const { cx, cy, s, baseGap, scrollGap, focusGap, focusDx, diveTo, labels, dimOthers } = live.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const h = hoverRef.current;
      const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-6 * dt);
      const target = (h >= 0 ? focusGap : baseGap + progress.current * scrollGap) * st.intro;
      st.gap += (target - st.gap) * k;
      const el = root.current;
      if (el) el.style.setProperty('--gap', `${st.gap.toFixed(2)}px`);

      const d = dive?.current;
      const t = d && d.i >= 0 ? d.t : 0;
      const centers: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        st.dx[i] += ((h === i && t === 0 ? focusDx : 0) - st.dx[i]) * k;
        st.dim[i] += ((dimOthers && h >= 0 && h !== i ? 1 : 0) - st.dim[i]) * k;
        const p = planes.current[i];
        const c: [number, number] = [cx + st.dx[i], cy + (mid - i) * st.gap];
        centers.push(c);
        if (!p) continue;
        if (d && d.i >= 0 && diveTo) {
          // Dive: target layer un-skews toward a flat, full-screen plane; others fall away.
          if (i === d.i) {
            const s1 = diveTo.s;
            const m = [A * s * (1 - t) + s1 * t, B * s * (1 - t), C * s * (1 - t), D * s * (1 - t) + s1 * t];
            const x = c[0] + (diveTo.cx - c[0]) * t;
            const y = c[1] + (diveTo.cy - c[1]) * t;
            p.style.transform = `translate(${(x - cx).toFixed(1)}px, ${(y - cy).toFixed(1)}px) matrix(${m.join(',')},0,0)`;
            p.style.zIndex = '20';
            p.style.opacity = '1';
          } else {
            p.style.opacity = String(1 - t);
            p.style.filter = `blur(${(t * 14).toFixed(1)}px)`;
          }
          continue;
        }
        p.style.setProperty('--dx', `${st.dx[i].toFixed(2)}px`);
        p.style.opacity = String((1 - st.dim[i] * 0.7) * Math.min(1, Math.max(0, st.intro * n - i * 0.6)));
        p.classList.toggle('is-focus', h === i);
      }

      const fade = 1 - t;
      if (connectors && conn.current) {
        let dd = '';
        for (let i = 0; i < n - 1; i++)
          for (const [x0, y0] of CORNERS) {
            const [a1, b1] = proj(s, centers[i][0], centers[i][1], x0, y0);
            const [a2, b2] = proj(s, centers[i + 1][0], centers[i + 1][1], x0, y0);
            dd += `M${a1.toFixed(1)} ${b1.toFixed(1)}L${a2.toFixed(1)} ${b2.toFixed(1)}`;
          }
        conn.current.setAttribute('d', dd);
        conn.current.style.opacity = String((h >= 0 ? 0.55 : 1) * fade * st.intro);
      }
      if (labels) {
        for (let i = 0; i < n; i++) {
          const [rx, ry] = proj(s, centers[i][0], centers[i][1], LW, 0);
          leaders.current[i]?.setAttribute('d', `M${(rx + 8).toFixed(1)} ${ry.toFixed(1)}L${labels.x - 12} ${ry.toFixed(1)}`);
          dots.current[i]?.setAttribute('cx', (rx + 8).toFixed(1));
          dots.current[i]?.setAttribute('cy', ry.toFixed(1));
          const lab = labelEls.current[i];
          if (lab) {
            lab.style.transform = `translate(${labels.x}px, ${(ry - 24).toFixed(1)}px)`;
            lab.classList.toggle('is-on', h === i);
            lab.classList.toggle('is-dim', h >= 0 && h !== i);
            lab.style.opacity = String(fade * st.intro);
          }
          const lead = leaders.current[i];
          if (lead) lead.style.opacity = String(fade * st.intro);
        }
      }
      if (redline && red.current && redTag.current && n > 1) {
        const [ax, ay] = proj(s, centers[n - 1][0], centers[n - 1][1], 0, LH);
        const [bx, by] = proj(s, centers[n - 2][0], centers[n - 2][1], 0, LH);
        const x = Math.round(Math.min(ax, bx) - 14);
        red.current.setAttribute('d', `M${x} ${ay}L${x} ${by}M${x - 5} ${ay}L${x + 5} ${ay}M${x - 5} ${by}L${x + 5} ${by}`);
        redTag.current.style.transform = `translate(${x + 10}px, ${((ay + by) / 2 - 10).toFixed(1)}px)`;
        redTag.current.textContent = `Δz ${Math.round(st.gap)}`;
        const o = String(fade * st.intro);
        red.current.style.opacity = o;
        redTag.current.style.opacity = o;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [project, n, mid, connectors, redline, progress, dive]);

  void matrix;
  return (
    <div className="hero-stack" ref={root}>
      <svg className="overlay-svg" width="1440" height="900" aria-hidden>
        {connectors && <path ref={conn} className="connector" />}
      </svg>
      {project.stack.map((l, i) => (
        <Plane
          key={project.slug + i}
          cx={cx}
          cy={cy}
          s={s}
          k={mid - i}
          className={`stack-plane ${onOpen ? 'is-interactive' : ''}`}
          style={{ zIndex: i + 1 }}
          onMouseEnter={() => setHover?.(i)}
          onMouseLeave={() => setHover?.(-1)}
          onClick={() => onOpen?.(i)}
          planeRef={(el) => { planes.current[i] = el; }}
        >
          <StackFace layer={l} index={i} s={s} />
        </Plane>
      ))}
      <svg className="overlay-svg overlay-svg--top" width="1440" height="900" aria-hidden>
        {labels &&
          project.stack.map((_, i) => (
            <g key={i}>
              <path ref={(el) => { leaders.current[i] = el; }} className="leader" />
              <circle ref={(el) => { dots.current[i] = el; }} r="3" className="leader-dot" />
            </g>
          ))}
        {redline && <path ref={red} className="redline" />}
      </svg>
      {redline && <div className="redtag t-data" ref={redTag} />}
      {labels &&
        project.stack.map((l, i) => (
          <div className="layer-label" key={project.slug + 'l' + i} ref={(el) => { labelEls.current[i] = el; }}>
            <div className="layer-label__row">
              <span className="t-data c-muted">0{i + 1}</span>
              <span className="t-hs">{l.name}</span>
            </div>
            <span className="t-label c-muted">{l.stat}</span>
          </div>
        ))}
    </div>
  );
}
