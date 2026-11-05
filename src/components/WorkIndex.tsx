import { useState } from 'react';
import { projects } from '../data/projects';
import { DotGrid, Glow, ImageFace, Plane, ShellFace } from './Plane';
import { BottomBar } from './Hud';
import { TLink } from './Link';
import { useLayout } from '../lib/layout';

/** Figma "05 — Work / Index" (desktop) and "M02 — Work" (mobile). */
export function WorkIndex({ embedded = false }: { embedded?: boolean }) {
  const layout = useLayout();
  const [hover, setHover] = useState(-1);
  return layout === 'mobile' ? <WorkMobile hover={hover} setHover={setHover} /> : <WorkDesktop hover={hover} setHover={setHover} embedded={embedded} />;
}

type P = { hover: number; setHover: (i: number) => void; embedded?: boolean };

function Stack({ p, cx, cy, s, gap, on }: { p: (typeof projects)[number]; cx: number; cy: number; s: number; gap: number; on: boolean }) {
  return (
    <div className="mini-stack" style={{ '--gap': `${gap}px` } as React.CSSProperties}>
      {[0, 1, 2].map((j) => (
        <Plane key={j} cx={cx} cy={cy} s={s} k={1.5 - j} className="shadow-sm">
          <ShellFace s={s} />
        </Plane>
      ))}
      <Plane cx={cx} cy={cy} s={s} k={-1.5} className={`shadow-sm ${on ? 'is-focus' : ''}`}>
        <ImageFace src={p.cover} />
      </Plane>
    </div>
  );
}

function WorkDesktop({ hover, setHover, embedded }: P) {
  const xs = [230, 570, 910, 1250];
  return (
    <section className="frame frame--work" data-frame="05 — Work / Index">
      <DotGrid />
      <div className="artboard">
        <div className="abs row-top" style={{ left: 40, top: 96, gap: 16 }}>
          <h1 className="t-xxl">Work</h1>
          <span className="t-data c-accent">(04)</span>
        </div>
        <p className="abs t-bl c-muted" style={{ left: 980, top: 150, width: 420 }}>
          Four products, each shown as the stack of layers it was built from. Hover to pull one apart.
        </p>
        {projects.map((p, i) => {
          const on = hover === i;
          const cx = xs[i];
          return (
            <TLink
              key={p.slug}
              to={`/work/${p.slug}`}
              label={`Entering — ${p.name}`}
              cursor="view"
              className="work-hit"
              style={{ left: cx - 170, top: 330, width: 340, height: 460 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
            >
              <span className="sr-only">{p.name}</span>
            </TLink>
          );
        })}
        {projects.map((p, i) => {
          const on = hover === i;
          const cx = xs[i];
          return (
            <div key={p.slug} className="work-item">
              <Glow x={cx - 230} y={480} w={460} h={220} color={on ? '255,80,95' : '122,92,255'} a={on ? 0.16 : 0.22} />
              <Stack p={p} cx={cx} cy={500} s={0.25} gap={on ? 30 : 12} on={on} />
              <div className="abs caption" style={{ left: cx - 150, top: 660, opacity: hover >= 0 && !on ? 0.7 : 1 }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className={`t-data ${on ? 'c-accent' : 'c-muted'}`}>{p.num}</span>
                  <span className={`t-hs ${on ? 'c-accent' : ''}`}>{p.name}</span>
                </div>
                <span className="t-label c-muted">{p.company}</span>
                <span className={`pill t-label ${on ? 'is-accent' : ''}`}>{p.workMetric}</span>
              </div>
            </div>
          );
        })}
      </div>
      {!embedded || true ? <div className="hud-bottom"><BottomBar hint="Hover a stack · click to enter" index={2} /></div> : null}
    </section>
  );
}

function WorkMobile({ hover, setHover }: P) {
  return (
    <section className="frame frame--m-work" data-frame="M02 — Work">
      <DotGrid step={20} opacity={0.08} size={1} />
      <div className="row-top abs" style={{ left: 20, top: 84, gap: 10 }}>
        <h1 className="t-xl" style={{ fontSize: 88 }}>Work</h1>
        <span className="t-data c-accent">(04)</span>
      </div>
      {projects.map((p, i) => {
        const y0 = 210 + i * 160;
        const on = hover === i;
        return (
          <TLink
            key={p.slug}
            to={`/work/${p.slug}`}
            label={`Entering — ${p.name}`}
            cursor="view"
            className="m-work-row"
            style={{ top: y0 }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
          >
            <div className="mini-stack" style={{ '--gap': `${on ? 16 : 7}px` } as React.CSSProperties}>
              {[0, 1].map((j) => (
                <Plane key={j} cx={110} cy={60} s={0.15} k={1 - j} className="shadow-sm">
                  <ShellFace s={0.15} />
                </Plane>
              ))}
              <Plane cx={110} cy={60} s={0.15} k={-1} className={`shadow-sm ${on ? 'is-focus' : ''}`}>
                <ImageFace src={p.cover} />
              </Plane>
            </div>
            <div className="abs caption" style={{ left: 228, top: 26, gap: 6, opacity: hover >= 0 && !on ? 0.75 : 1 }}>
              <span className={`t-data ${on ? 'c-accent' : 'c-muted'}`}>{p.num}</span>
              <span className={`t-hs ${on ? 'c-accent' : ''}`} style={{ fontSize: 19 }}>{p.name}</span>
              <span className="t-label c-muted" style={{ width: 140 }}>{p.workMetric}</span>
            </div>
          </TLink>
        );
      })}
    </section>
  );
}
