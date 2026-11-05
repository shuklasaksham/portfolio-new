import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, type Project } from '../data/projects';
import { mobileCase } from '../data/mobileCase';
import { DotGrid, Glow, ImageFace, PhaseFace, Plane, ShellFace } from '../components/Plane';
import { LabelMono } from '../components/Hud';
import { Button } from '../components/Button';
import { Counter } from '../components/Counter';
import { TLink } from '../components/Link';
import { Accordion, Bars, Metric, Reveal, Shot } from '../components/Blocks';
import { useLayout } from '../lib/layout';
import { useUI } from '../lib/ui';
import { gsap, prefersReducedMotion } from '../lib/motion';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = getProject(slug);
  const layout = useLayout();
  if (!p) return <NotFound />;
  return layout === 'mobile' ? <CaseMobile p={p} key={p.slug} /> : <CaseDesktop p={p} key={p.slug} />;
}

/** Phase stack: three phase layers + project cover on top (Figma: s .42 @ 1070, 420, Δ64). */
function PhaseStack({ p, cx, cy, s, gap, phases, phaseSize = 150 }: { p: Project; cx: number; cy: number; s: number; gap: number; phases: string[]; phaseSize?: number }) {
  return (
    <div className="mini-stack phase-stack" style={{ '--gap': `${gap}px` } as CSSProperties}>
      {phases.map((name, i) => (
        <Plane key={name} cx={cx} cy={cy} s={s} k={1.5 - i} className="shadow-lg">
          <PhaseFace n={`0${i + 1}`} name={name} size={phaseSize} />
        </Plane>
      ))}
      <Plane cx={cx} cy={cy} s={s} k={-1.5} className="shadow-lg">
        <ImageFace src={p.cover} />
      </Plane>
    </div>
  );
}

function useHeroIntro(scope: React.RefObject<HTMLElement | null>, gapFrom: number, gapTo: number) {
  const { entered } = useUI();
  useEffect(() => {
    const el = scope.current;
    if (!el || !entered || prefersReducedMotion()) return;
    const q = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo('.phase-stack', { '--gap': `${gapFrom}px`, opacity: 0 }, { '--gap': `${gapTo}px`, opacity: 1, duration: q ? 0.01 : 1.8, ease: 'expoOut', delay: 0.15 });
      gsap.fromTo('[data-intro]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: q ? 0.01 : 1.1, ease: 'expoOut', stagger: 0.07, delay: 0.3 });
    }, el);
    return () => ctx.revert();
  }, [entered, gapFrom, gapTo, scope]);
}

/* ───────────────────────── Desktop (Figma "Case study — …", 1440 wide) */
function CaseDesktop({ p }: { p: Project }) {
  const next = getProject(p.next)!;
  const hero = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);
  useHeroIntro(hero, 0, 64);
  const phases = p.process.slice(0, 3).map(([n]) => n);
  let pin = 1;

  return (
    <div className="page page--case">
      {/* Hero 1440 × 900 */}
      <div className="hero-frame" ref={hero}>
        <DotGrid opacity={0.07} />
        <Glow x={520} y={330} w={1100} h={620} a={0.34} />
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="abs" style={{ left: 760, top: 160, width: 620, height: 560, zIndex: 5 }} data-cursor="drag" data-cursor-label="Explode" />
        <div style={{ position: 'absolute', inset: 0, ['--hov' as string]: hov ? 1 : 0 }}>
          <PhaseStack p={p} cx={1070} cy={420} s={0.42} gap={hov ? 100 : 64} phases={phases} />
        </div>
        <div className="abs col" style={{ left: 120, top: 150, gap: 26 }}>
          <div className="row" style={{ gap: 10 }} data-intro>
            <TLink to="/work" label="Work" className="t-label c-muted">Work</TLink>
            <span className="t-label c-muted">/</span>
            <span className="t-label c-accent">Case study {p.num} / 04</span>
          </div>
          <h1 className="t-xl" style={{ fontSize: 92, width: 620 }} data-intro>{p.title}</h1>
          <div className="row wrap" style={{ gap: 8, width: 620 }} data-intro>
            {p.chips.map((c) => <span key={c} className="chip t-label">{c}</span>)}
          </div>
        </div>
        <div className="abs row" style={{ left: 120, top: 680, alignItems: 'stretch' }} data-intro>
          {p.metrics.map(([n, l], i) => (
            <div key={l} className="col" style={{ gap: 6, padding: `0 40px 0 ${i ? 32 : 0}px`, borderLeft: i ? '1px solid var(--line-2)' : undefined }}>
              <Counter value={n} className="t-l c-accent" style={{ fontSize: 72 }} />
              <span className="t-label c-muted">{l}</span>
            </div>
          ))}
        </div>
        <div className="abs" style={{ left: 120, top: 832 }} data-intro>
          <LabelMono text="60-second read · scroll" />
        </div>
      </div>

      {/* TL;DR */}
      <section className="sec sec--alt" style={{ padding: '72px 120px' }}>
        <Reveal className="row" style={{ alignItems: 'stretch' }}>
          {(['Problem', 'What I did', 'Result'] as const).map((k, i) => (
            <div key={k} className="col" style={{ flex: 1, gap: 14, padding: `8px 40px 8px ${i ? 40 : 0}px`, borderLeft: i ? '1px solid var(--line-2)' : undefined }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="t-data c-accent">0{i + 1}</span>
                <span className="t-label c-muted">{k}</span>
              </div>
              <p className={`t-hs ${i === 2 ? 'c-accent' : ''}`} style={{ fontSize: 24 }}>{p.tldr[i]}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Before → After */}
      <section className="sec" style={{ padding: '110px 120px', gap: 28 }}>
        <span className="t-label c-muted">Before → After</span>
        <BeforeAfter p={p} />
        <Reveal as="p" className="t-hm" style={{ fontSize: 28 }}>{p.beforeAfter.line}</Reveal>
      </section>

      {/* Highlights */}
      <section className="sec" style={{ padding: '110px 120px', gap: 32 }}>
        <Reveal as="h2" className="t-l">{p.highlights.length === 2 ? 'Two' : 'Three'} moves that mattered</Reveal>
        {p.highlights.map((h, i) => {
          const start = pin;
          pin += h.shots.reduce((a, s) => a + (s.pins?.length ?? 0), 0);
          const aw = 1200 - 96 - 330 - 48;
          const multi = h.shots.length > 1;
          const ww = multi ? Math.min(250, (aw - 28 * (h.shots.length - 1)) / h.shots.length) : aw;
          let k = start;
          const visual = (
            <div className="row" style={{ flex: 1, gap: 28, justifyContent: 'center' }}>
              {h.shots.map((s) => {
                const st = k;
                k += s.pins?.length ?? 0;
                return <Shot key={s.src} src={s.src} w={ww} h={Math.round((ww * s.h) / s.w)} pins={s.pins} start={st} radius={s.h > s.w ? 24 : 14} />;
              })}
            </div>
          );
          const copy = (
            <div className="col" style={{ width: 330, flex: 'none', gap: 18 }}>
              <span className="t-l c-accent" style={{ fontSize: 56 }}>0{i + 1}</span>
              <h3 className="t-hm">{h.title}</h3>
              <p className="t-bl c-muted" style={{ fontSize: 18 }}>{h.text}</p>
            </div>
          );
          return (
            <Reveal key={h.title} className="hl-card">
              {i % 2 === 1 ? (<>{visual}{copy}</>) : (<>{copy}{visual}</>)}
            </Reveal>
          );
        })}
      </section>

      {/* Impact */}
      <section className="sec sec--alt" style={{ padding: '110px 120px', gap: 40 }}>
        <div className="row" style={{ gap: 16, alignItems: 'flex-end' }}>
          <h2 className="t-l">Impact</h2>
          <span className="t-label c-muted">{p.impact.tag}</span>
        </div>
        <Reveal className="row" style={{ gap: 24, alignItems: 'stretch', width: '100%' }}>
          {p.impact.bars && <Bars {...p.impact.bars} />}
          {p.impact.tiles.map(([n, l]) => <Metric key={l} n={n} l={l} />)}
        </Reveal>
        <span className="t-data c-faint">{p.impact.method}</span>
      </section>

      {/* Process */}
      <section className="sec" style={{ padding: '110px 120px', gap: 36 }}>
        <span className="t-label c-muted">How it came together</span>
        <ProcessStrip p={p} />
      </section>

      {/* Full story */}
      <section className="sec sec--alt" style={{ padding: '110px 120px', gap: 0 }}>
        <div className="row" style={{ gap: 16, alignItems: 'flex-end' }}>
          <h2 className="t-l">Want the full story?</h2>
          <span className="t-label c-muted">For the curious — open any layer</span>
        </div>
        <div style={{ height: 32 }} />
        <Accordion items={p.full} />
      </section>

      {/* Next */}
      <NextFooter next={next} />
    </div>
  );
}

function BeforeAfter({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bn, bl] = p.beforeAfter.before;
  const [an, al] = p.beforeAfter.after;
  const N = parseInt(bn, 10);
  const cols = N > 6 ? 4 : N > 3 ? 3 : N;
  const rows = Math.ceil(N / cols);
  const ss = N > 6 ? 0.085 : 0.12;
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 20%', scrub: 0.8 } });
      tl.from('.ba-tile', { x: (i) => (i % 2 ? 40 : -40), y: (i) => (i % 3 ? 30 : -30), opacity: 0, stagger: 0.04, ease: 'power2.out' })
        .from('.ba-arrow', { strokeDashoffset: 190, ease: 'none' }, 0.2)
        .from('.ba-one', { opacity: 0, scale: 0.6, ease: 'expoOut' }, 0.4)
        .from('.ba-after', { opacity: 0, y: 20 }, 0.6);
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="card" style={{ position: 'relative', width: 1200, height: 420, overflow: 'hidden' }}>
      {Array.from({ length: N }, (_, i) => {
        const cx = 250 + ((i % cols) - (cols - 1) / 2) * (N > 6 ? 96 : 120) + (Math.floor(i / cols) % 2 ? 24 : 0);
        const cy = 200 + (Math.floor(i / cols) - (rows - 1) / 2) * (N > 6 ? 62 : 80);
        return (
          <Plane key={i} cx={cx} cy={cy} s={ss} className="ba-tile" style={{ opacity: 0.8 }}>
            <div className="face" style={{ background: 'var(--bg)', border: `${1 / ss}px dashed var(--line-2)` }} />
          </Plane>
        );
      })}
      <div className="abs row" style={{ left: 60, top: 330, gap: 12, alignItems: 'flex-end' }}>
        <Counter value={bn} className="t-l" style={{ fontSize: 56 }} />
        <span className="t-label c-muted">{bl}</span>
      </div>
      <svg className="abs" style={{ left: 0, top: 0 }} width="1200" height="420" aria-hidden>
        <path className="ba-arrow" d="M520 205 L700 205" stroke="#FF505F" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M690 196 L702 205 L690 214" stroke="#FF505F" strokeWidth="2" fill="none" />
      </svg>
      <Glow x={700} y={40} w={520} h={320} color="255,80,95" a={0.14} />
      <Plane cx={960} cy={190} s={0.26} className="ba-one is-focus" style={{ boxShadow: '0 40px 110px rgba(122,92,255,.3)', borderRadius: 20 }}>
        <ImageFace src={p.cover} />
      </Plane>
      <div className="abs row ba-after" style={{ left: 760, top: 330, gap: 12, alignItems: 'flex-end' }}>
        <Counter value={an} className="t-l c-accent" style={{ fontSize: 56 }} />
        <span className="t-label c-accent">{al}</span>
      </div>
    </div>
  );
}

function ProcessStrip({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.proc-line', { strokeDashoffset: 1080 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true } });
      gsap.fromTo('.proc-step', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'expoOut', stagger: 0.12, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', width: 1200, height: 190 }}>
      <svg className="abs" style={{ left: 0, top: 0 }} width="1200" height="190" aria-hidden>
        <path className="proc-line" d="M60 40 L1140 40" stroke="rgba(238,238,232,.2)" strokeDasharray="3 6" />
      </svg>
      {p.process.map(([n, d], i) => (
        <div key={n} className="proc-step">
          <Plane cx={i * 300 + 50} cy={40} s={0.07}>
            <div className="face" style={{ background: i === 3 ? 'var(--accent)' : 'var(--bg-2)', border: `${1 / 0.07}px solid var(--line-2)` }} />
          </Plane>
          <div className="abs col" style={{ left: i * 300, top: 84, gap: 6 }}>
            <span className={`t-hs ${i === 3 ? 'c-accent' : ''}`} style={{ whiteSpace: 'pre' }}>{`0${i + 1}  ${n}`}</span>
            <span className="t-bm c-muted" style={{ width: 260 }}>{d}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NextFooter({ next }: { next: Project }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="next-link" style={{ position: 'relative', height: 560, overflow: 'hidden' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <Glow x={620} y={200} w={900} h={420} a={0.3} />
      <div className="mini-stack" style={{ '--gap': `${hov ? 44 : 20}px` } as CSSProperties}>
        {[0, 1, 2].map((j) => (
          <Plane key={j} cx={1050} cy={290} s={0.4} k={1.5 - j} className="shadow-lg">
            <ShellFace s={0.4} />
          </Plane>
        ))}
        <Plane cx={1050} cy={290} s={0.4} k={-1.5} className={`shadow-lg ${hov ? 'is-focus' : ''}`}>
          <ImageFace src={next.cover} />
        </Plane>
      </div>
      <TLink to={`/work/${next.slug}`} label={`Entering — ${next.name}`} cursor="view" className="abs" style={{ left: 760, top: 80, width: 600, height: 420 }}>
        <span className="sr-only">{next.name}</span>
      </TLink>
      <div className="abs col" style={{ left: 120, top: 150, gap: 20 }}>
        <LabelMono text={`Next stack · ${next.num}`} />
        <h2 className="t-xl">{next.name}</h2>
        <p className="t-bl c-muted">{next.title}</p>
        <div className="row" style={{ gap: 10 }}>
          <Button to={`/work/${next.slug}`} label={`Entering — ${next.name}`}>Dive in</Button>
          <Button to="/work" variant="ghost" label="Work">All work</Button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Mobile (Figma "M — Case · …", 390 wide) */
function CaseMobile({ p }: { p: Project }) {
  const m = mobileCase[p.slug];
  const next = getProject(p.next)!;
  const hero = useRef<HTMLDivElement>(null);
  useHeroIntro(hero, 0, 34);
  const sec = (fills?: boolean): CSSProperties => ({ padding: '44px 20px', gap: 18, background: fills ? 'var(--bg-2)' : undefined });
  const [bn, bl, an, al, line] = m.ba;
  const N = parseInt(bn, 10);
  const cols = N > 6 ? 4 : N > 3 ? 3 : N;
  const rows = Math.ceil(N / cols);
  let pinN = 0;

  return (
    <div className="page page--case-m">
      <div className="hero-frame" ref={hero} style={{ height: 800 }}>
        <DotGrid step={20} opacity={0.07} size={1} />
        <Glow x={-65} y={120} w={520} h={320} a={0.32} />
        <PhaseStack p={p} cx={195} cy={250} s={0.27} gap={34} phases={m.phases} />
        <div className="abs col" style={{ left: 20, top: 410, gap: 14 }}>
          <div className="row" style={{ gap: 8 }} data-intro>
            <TLink to="/work" label="Work" className="t-label c-muted">Work</TLink>
            <span className="t-label c-muted">/</span>
            <span className="t-label c-accent">{p.num} / 04</span>
          </div>
          <h1 className="t-l" style={{ fontSize: 44, width: 350 }} data-intro>{m.title}</h1>
          <div className="row wrap" style={{ gap: 6, width: 350 }} data-intro>
            {m.chips.map((c) => <span key={c} className="chip t-label" style={{ padding: '6px 10px' }}>{c}</span>)}
          </div>
        </div>
        <div className="abs row" style={{ left: 20, top: 680, alignItems: 'stretch' }} data-intro>
          {m.metrics.map(([n, l], i) => (
            <div key={l} className="col" style={{ width: i ? 117 : 105, gap: 4, padding: `0 10px 0 ${i ? 12 : 0}px`, borderLeft: i ? '1px solid var(--line-2)' : undefined }}>
              <Counter value={n} className="t-hm c-accent" style={{ fontSize: 30 }} />
              <span className="t-label c-muted">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="sec" style={{ ...sec(true), gap: 0 }}>
        {(['Problem', 'What I did', 'Result'] as const).map((k, i) => (
          <Reveal key={k} className="col" style={{ gap: 8, padding: '16px 0', borderTop: i ? '1px solid var(--line-2)' : undefined }}>
            <span className="t-label c-accent">{`0${i + 1}  ${k}`}</span>
            <p className={`t-hs ${i === 2 ? 'c-accent' : ''}`} style={{ fontSize: 20 }}>{m.tldr[i]}</p>
          </Reveal>
        ))}
      </section>

      <section className="sec" style={sec()}>
        <span className="t-label c-muted">Before → After</span>
        <div className="card" style={{ position: 'relative', width: 350, height: 230, overflow: 'hidden', borderRadius: 20 }}>
          {Array.from({ length: N }, (_, i) => (
            <Plane key={i} cx={82 + ((i % cols) - (cols - 1) / 2) * (N > 6 ? 36 : 46)} cy={100 + (Math.floor(i / cols) - (rows - 1) / 2) * (N > 6 ? 24 : 32)} s={N > 6 ? 0.035 : 0.05}>
              <div className="face" style={{ background: 'var(--bg)', border: `${1 / (N > 6 ? 0.035 : 0.05)}px dashed var(--line-2)` }} />
            </Plane>
          ))}
          <svg className="abs" style={{ left: 0, top: 0 }} width="350" height="230" aria-hidden>
            <path d="M150 100 L200 100" stroke="#FF505F" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M194 94 L202 100 L194 106" stroke="#FF505F" strokeWidth="2" fill="none" />
          </svg>
          <Plane cx={275} cy={95} s={0.11} className="is-focus">
            <ImageFace src={p.cover} />
          </Plane>
          <div className="abs row" style={{ left: 20, top: 178, gap: 6, alignItems: 'flex-end' }}>
            <span className="t-hm" style={{ fontSize: 30 }}>{bn}</span>
            <span className="t-label c-muted">{bl}</span>
          </div>
          <div className="abs row" style={{ left: 208, top: 178, gap: 6, alignItems: 'flex-end' }}>
            <span className="t-hm c-accent" style={{ fontSize: 30 }}>{an}</span>
            <span className="t-label c-accent">{al}</span>
          </div>
        </div>
        <p className="t-hs" style={{ fontSize: 20 }}>{line}</p>
      </section>

      {m.hl.map((h, i) => {
        const startN = pinN;
        return (
          <section key={h.h} className="sec" style={sec(i % 2 === 0)}>
            <span className="t-hm c-accent" style={{ fontSize: 30 }}>0{i + 1}</span>
            <h3 className="t-hm" style={{ fontSize: 26 }}>{h.h}</h3>
            <p className="t-bm c-muted">{h.s}</p>
            <div className="row" style={{ gap: 12 }}>
              {h.imgs.map(([src, w, hh, pins]) => {
                const ww = h.imgs.length > 1 ? 169 : 350;
                const st = pinN + 1;
                pinN += pins.length;
                return <Shot key={src} src={src} w={ww} h={Math.round((ww * hh) / w)} pins={pins.map(([x, y, label]) => ({ x, y, label }))} start={st} radius={w < hh ? 18 : 10} tags={false} size={22} />;
              })}
            </div>
            <div className="col" style={{ gap: 8 }}>
              {h.imgs.flatMap(([, , , pins]) => pins).map(([, , label], k) => (
                <div className="row" key={k} style={{ gap: 10 }}>
                  <span className="t-label" style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--accent)', color: 'var(--bg)', display: 'grid', placeItems: 'center', letterSpacing: 0 }}>{startN + k + 1}</span>
                  <span className="t-label">{label}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section className="sec" style={sec(true)}>
        <span className="t-label c-muted">Impact · {m.impact.tag}</span>
        {m.impact.bars && <Bars label={m.impact.bars[0]} before={m.impact.bars[1]} after={m.impact.bars[2]} beforeText={m.impact.bars[3]} afterText={m.impact.bars[4]} pad={20} radius={16} width={350} />}
        <div className="row wrap" style={{ gap: 12 }}>
          {m.impact.tiles.map(([n, l]) => <Metric key={l} n={n} l={l} size={32} pad={16} radius={14} width={169} />)}
        </div>
      </section>

      <section className="sec" style={{ ...sec(), gap: 0 }}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>Want the full story?</h2>
        <div style={{ height: 16 }} />
        <Accordion items={m.full} titleSize={19} bodyClass="t-bm c-muted" />
      </section>

      <section className="sec" style={{ ...sec(), paddingBottom: 120 }}>
        <LabelMono text="Next stack" />
        <h2 className="t-l" style={{ fontSize: 44 }}>{m.next}</h2>
        <div className="row" style={{ gap: 8 }}>
          <Button to={`/work/${next.slug}`} label={`Entering — ${next.name}`}>Dive in</Button>
          <Button to="/work" variant="ghost" label="Work">All work</Button>
        </div>
      </section>
      <MobileRail text={`${p.name} · 60-sec read`} />
    </div>
  );
}

export function MobileRail({ text }: { text: string }) {
  return (
    <div className="m-rail">
      <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden>
        {[0, 1, 2, 3].map((i) => {
          const y = 2 + (3 - i) * 6;
          const on = i === 3;
          return <path key={i} d={`M6 ${y} L28 ${y} L24 ${y + 3} L2 ${y + 3} Z`} fill={on ? '#FF505F' : 'none'} stroke={on ? '#FF505F' : '#EEEEE8'} strokeOpacity={on ? 1 : 0.4} />;
        })}
      </svg>
      <span className="t-label">{text}</span>
    </div>
  );
}
