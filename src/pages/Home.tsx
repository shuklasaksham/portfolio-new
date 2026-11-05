import { useEffect, useRef, useState } from 'react';
import { projects, type Project } from '../data/projects';
import { layerDetails } from '../data/layers';
import { HeroStack } from '../components/HeroStack';
import { DotGrid, Glow } from '../components/Plane';
import { BottomBar, LabelMono } from '../components/Hud';
import { Button } from '../components/Button';
import { WorkIndex } from '../components/WorkIndex';
import { useGo } from '../lib/transition';
import { useUI } from '../lib/ui';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useLayout, useViewportH, getZoom } from '../lib/layout';

export default function Home() {
  const layout = useLayout();
  return (
    <div className="page page--home">
      {layout === 'mobile' ? <HeroMobile /> : <HeroDesktop />}
      <WorkIndex embedded />
    </div>
  );
}

/** Shared hero state: scroll-driven explode, project switcher, focus + dive. */
function useHero() {
  const progress = useRef(0);
  const [pi, setPi] = useState(0);
  const [hover, setHover] = useState(-1);
  const touched = useRef(false);
  const dive = useRef({ t: 0, i: -1 });
  const go = useGo();
  const vh = useViewportH();
  const { entered } = useUI();

  useEffect(() => {
    const on = () => {
      const range = window.innerHeight * 0.8;
      progress.current = Math.min(1, Math.max(0, window.scrollY / range));
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  // Auto-advance the project switcher every 9s, only after entering and until the visitor interacts.
  useEffect(() => {
    if (!entered) return;
    const id = setInterval(() => {
      if (!touched.current && hover < 0 && progress.current < 0.05) setPi((i) => (i + 1) % projects.length);
    }, 9000);
    return () => clearInterval(id);
  }, [hover, entered]);

  const open = (p: Project, i: number) => {
    if (dive.current.i >= 0) return;
    dive.current = { t: 0, i };
    gsap.to(dive.current, {
      t: 1,
      duration: prefersReducedMotion() ? 0.01 : 1.05,
      ease: 'expoInOut',
      onComplete: () => go(`/work/${p.slug}`, { instant: true }),
    });
  };

  return { progress, pi, setPi, hover, setHover, touched, dive, open, vh };
}

function HeroDesktop() {
  const h = useHero();
  const project = projects[h.pi];
  const { entered } = useUI();
  const copy = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const d = h.hover >= 0 ? layerDetails[project.slug]?.[h.hover] : null;

  // Intro: headline lines rise from a mask, then intro + CTAs.
  useEffect(() => {
    if (!entered || !copy.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hl-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expoOut', stagger: 0.08, delay: 0.35 });
      gsap.fromTo('[data-intro]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expoOut', stagger: 0.08, delay: 0.8 });
    }, copy.current);
    return () => ctx.revert();
  }, [entered]);

  // Focus state: headline ↔ layer detail crossfade (Figma frame 02 ↔ 03).
  useEffect(() => {
    if (!copy.current || !detail.current) return;
    const focus = h.hover >= 0;
    gsap.to(copy.current, { opacity: focus ? 0 : 1, y: focus ? -12 : 0, duration: 0.5, ease: 'expoOut' });
    gsap.fromTo(detail.current.children, { opacity: 0, y: focus ? 16 : 0 }, { opacity: focus ? 1 : 0, y: 0, duration: 0.6, ease: 'expoOut', stagger: 0.04 });
  }, [h.hover, project.slug]);

  // Live pointer readout + focus tooltip that trails the cursor.
  useEffect(() => {
    let raf = 0;
    const p = { x: 0, y: 0, tx: 0, ty: 0 };
    const move = (e: PointerEvent) => {
      const z = getZoom();
      p.tx = e.clientX / z;
      p.ty = e.clientY / z;
      if (readout.current && h.hover < 0)
        readout.current.textContent = `X ${((e.clientX / innerWidth) * 2 - 1).toFixed(3)}  Y ${(-(e.clientY / innerHeight) * 2 + 1).toFixed(3)}  ·  60 FPS`;
    };
    const loop = () => {
      p.x += (p.tx - p.x) * 0.18;
      p.y += (p.ty - p.y) * 0.18;
      if (tip.current) tip.current.style.transform = `translate(${p.x + 30}px, ${p.y + 10}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
    };
  }, [h.hover]);

  const n = project.stack.length;
  return (
    <section className="hero-wrap" style={{ height: h.vh * 1.8 }}>
      <div className="frame frame--hero" style={{ height: h.vh }} data-frame="02 — Home / Exploded (idle)">
        <DotGrid />
        <div className="artboard">
          <Glow x={280} y={520} w={1100} h={420} a={0.32} />
          <Glow x={570} y={130} w={760} h={520} color="71,229,255" a={0.09} />
          <HeroStack
            project={project}
            s={0.5}
            cx={830}
            cy={470}
            baseGap={n === 5 ? 100 : 120}
            progress={h.progress}
            hover={h.hover}
            setHover={h.setHover}
            onOpen={(i) => h.open(project, i)}
            dive={h.dive}
            diveTo={{ cx: 720, cy: 450, s: 1.6 }}
          />
          <div className="hero-copy" ref={copy}>
            <h1 className="abs t-xl hero-headline" style={{ left: 40, top: 190 }}>
              <span className="hl-line"><span>I design</span></span>
              <span className="hl-line"><span>products</span></span>
              <span className="hl-line t-serif c-accent"><span>layer by</span></span>
              <span className="hl-line t-serif c-accent"><span>layer.</span></span>
            </h1>
            <div className="abs col" style={{ left: 40, top: 630, gap: 22 }}>
              <p className="t-bl" style={{ width: 400 }} data-intro>
                Product designer, 0 → 1. Pull any project apart to see the research, systems and decisions underneath the pixels.
              </p>
              <div className="row" style={{ gap: 10 }} data-intro>
                <Button to={`/work/${project.slug}`} label={`Entering — ${project.name}`}>Pull it apart</Button>
                <Button to="/resume" variant="ghost" label="Résumé">Résumé</Button>
              </div>
            </div>
          </div>
          <div className="hero-detail abs col" ref={detail} style={{ left: 40, top: 190, gap: 18, pointerEvents: d ? 'auto' : 'none' }}>
            {d && (
              <>
                <LabelMono text={`Layer 0${h.hover + 1} / 0${n}`} />
                <h2 className="t-l">{d.title}</h2>
                <p className="t-bl c-muted" style={{ width: 380 }}>{d.text}</p>
                <div className="col" style={{ gap: 10 }}>
                  {d.facts.map(([k, v]) => (
                    <div className="row" key={k} style={{ gap: 16 }}>
                      <span className="t-label c-faint" style={{ width: 90 }}>{k}</span>
                      <span className="t-data">{v}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" onClick={() => h.open(project, h.hover)}>Open this layer</Button>
              </>
            )}
          </div>
          <div className="abs switcher" role="tablist" aria-label="Choose a project stack">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                role="tab"
                aria-selected={h.pi === i}
                className={`switch t-label ${h.pi === i ? 'is-on' : ''}`}
                data-cursor="hover"
                onClick={() => {
                  h.touched.current = true;
                  h.setPi(i);
                }}
              >
                {p.num} {p.slug === 'hyundai-bo' ? 'B&O' : p.name.replace(' 2.0', '')}
                {h.pi === i && !h.touched.current && <i className="switch__timer" />}
              </button>
            ))}
          </div>
        </div>
        <div className="focus-tip t-label" ref={tip} style={{ opacity: d ? 1 : 0 }}>
          {d ? `0${h.hover + 1} · ${d.title}` : ''}
        </div>
        <div className="hud-bottom">
          <BottomBar
            ref={readout}
            hint={d ? 'Click to open this layer' : 'Scroll or drag to explore'}
            index={d ? h.hover + 1 : 1}
            readout={d ? `Δz 125  ·  layer 0${h.hover + 1}  ·  60 FPS` : 'X 0.000  Y 0.000  ·  60 FPS'}
          />
        </div>
      </div>
    </section>
  );
}

function HeroMobile() {
  const h = useHero();
  const project = projects[0];
  const { entered } = useUI();
  const copy = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!entered || !copy.current || prefersReducedMotion()) return;
    gsap.fromTo(copy.current.querySelectorAll('[data-intro]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expoOut', stagger: 0.08, delay: 0.4 });
  }, [entered]);
  const focus = h.hover >= 0 ? h.hover : 2;
  return (
    <section className="hero-wrap" style={{ height: h.vh * 1.6 }}>
      <div className="frame frame--m-hero" style={{ height: h.vh }} data-frame="M01 — Home / Exploded">
        <DotGrid step={20} opacity={0.08} size={1} />
        <div className="artboard artboard--m">
          <Glow x={-65} y={250} w={520} h={320} />
          <HeroStack
            project={project}
            s={0.24}
            cx={195}
            cy={330}
            baseGap={52}
            scrollGap={30}
            progress={h.progress}
            hover={focus}
            setHover={(i) => i >= 0 && h.setHover(i)}
            onOpen={(i) => h.open(project, i)}
            labels={null}
            redline={false}
            connectors={false}
            focusGap={52}
            focusDx={0}
            dimOthers={false}
            dive={h.dive}
            diveTo={{ cx: 195, cy: 422, s: 0.42 }}
          />
          <span className="abs tag-lime t-label" style={{ left: 232, top: 318 }}>
            0{focus + 1} · {project.stack[focus].name}
          </span>
          <div ref={copy}>
            <h1 className="abs col" style={{ left: 20, top: 540 }} data-intro>
              <span className="t-l" style={{ fontSize: 44 }}>I design products</span>
              <span className="t-serif c-accent" style={{ fontSize: 52 }}>layer by layer.</span>
            </h1>
            <p className="abs t-bm c-muted" style={{ left: 20, top: 660, width: 330 }} data-intro>
              Product designer, 0 → 1. Pull any project apart to see the thinking underneath.
            </p>
            <div className="abs row" style={{ left: 20, top: 740, gap: 8 }} data-intro>
              <Button to={`/work/${project.slug}`} label={`Entering — ${project.name}`}>Pull it apart</Button>
              <Button to="/resume" variant="ghost" label="Résumé">Résumé</Button>
            </div>
            <span className="abs t-label c-faint m-hint" style={{ top: 808 }}>
              ↕ Swipe the stack to explode
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
