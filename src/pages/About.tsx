import { useEffect, useRef, type CSSProperties } from 'react';
import { profile } from '../data/profile';
import { DotGrid, Glow, Plane, PhaseFace, LW, LH } from '../components/Plane';
import { LabelMono } from '../components/Hud';
import { Button } from '../components/Button';
import { Counter } from '../components/Counter';
import { TLink } from '../components/Link';
import { Reveal } from '../components/Blocks';
import { useLayout } from '../lib/layout';
import { useUI } from '../lib/ui';
import { gsap, prefersReducedMotion } from '../lib/motion';

const CAREER: [string, string][] = [['2022', 'HARMAN'], ['2025', 'Verizon'], ['2026', 'Bracket']];

function useIntro(ref: React.RefObject<HTMLElement | null>, to = 70) {
  const { entered } = useUI();
  useEffect(() => {
    const el = ref.current;
    if (!el || !entered || prefersReducedMotion()) return;
    const q = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo('.intro-stack', { '--gap': '0px', opacity: 0 }, { '--gap': `${to}px`, opacity: 1, duration: q ? 0.01 : 1.8, ease: 'expoOut', delay: 0.15 });
      gsap.fromTo('[data-intro]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: q ? 0.01 : 1.1, ease: 'expoOut', stagger: 0.07, delay: 0.3 });
    }, el);
    return () => ctx.revert();
  }, [entered, ref, to]);
}

/** Career planes + dashed portrait plane on top. */
function PortraitStack({ cx, cy, s, nameSize, mobile, gap = 70 }: { cx: number; cy: number; s: number; nameSize: number; mobile?: boolean; gap?: number }) {
  return (
    <div className="mini-stack intro-stack" style={{ '--gap': `${gap}px` } as CSSProperties}>
      {CAREER.map(([y, n], i) => (
        <Plane key={n} cx={cx} cy={cy} s={s} k={1 - i} className="shadow-lg">
          {mobile ? (
            <div className="face face--phase">
              <span className="t-xl" style={{ position: 'absolute', left: 50, bottom: 50, fontSize: 170 }}>{n}</span>
            </div>
          ) : (
            <PhaseFace n={y} name={n} size={nameSize} />
          )}
        </Plane>
      ))}
      <Plane cx={cx} cy={cy} s={s} k={-2} className="shadow-lg">
        <div className="face" style={{ background: 'radial-gradient(100% 100% at 50% 35%, #2B1F73 0%, #0F1115 80%)', border: `${mobile ? 4 : 3}px dashed var(--accent)` }}>
          <div className="col" style={{ position: 'absolute', left: LW / 2, top: LH / 2, transform: 'translate(-50%,-50%)', alignItems: 'center', gap: 18 }}>
            {!mobile && (
              <span style={{ width: 160, height: 160, borderRadius: 80, border: '1px solid var(--accent)', display: 'grid', placeItems: 'center' }}>
                <span className="t-l c-accent">SS</span>
              </span>
            )}
            <span className="t-hm" style={{ fontSize: mobile ? 52 : 44, whiteSpace: 'nowrap' }}>Your portrait here</span>
            {!mobile && <span className="t-data c-muted" style={{ fontSize: 26 }}>Drop a photo into this layer</span>}
          </div>
        </div>
      </Plane>
    </div>
  );
}

export default function About() {
  return useLayout() === 'mobile' ? <AboutMobile /> : <AboutDesktop />;
}

function AboutDesktop() {
  const hero = useRef<HTMLDivElement>(null);
  useIntro(hero);
  return (
    <div className="page page--about">
      <div className="hero-frame" ref={hero}>
        <DotGrid opacity={0.07} />
        <Glow x={560} y={300} w={1100} h={620} a={0.32} />
        <PortraitStack cx={1130} cy={520} s={0.42} nameSize={170} />
        <div className="abs col" style={{ left: 120, top: 170, gap: 24 }}>
          <span data-intro><LabelMono text="About · Based in India · works remote" /></span>
          <h1 className="col" data-intro>
            <span className="t-xl" style={{ fontSize: 92 }}>Hi, I’m Saksham.</span>
            <span className="t-xl" style={{ fontSize: 92 }}>I design the layers</span>
            <span className="t-serif c-accent" style={{ fontSize: 100 }}>you don’t see.</span>
          </h1>
          <p className="t-bl c-muted" style={{ width: 520 }} data-intro>
            Product designer with 4.5+ years across AI, conversational and in-vehicle products at Verizon and HARMAN — and founder of Bracket.
          </p>
          <div className="row" style={{ gap: 10 }} data-intro>
            <Button to="/resume" label="Résumé">Résumé</Button>
            <Button to="/contact" variant="ghost" label="Contact">Say hello</Button>
          </div>
        </div>
      </div>

      <section className="sec sec--alt" style={{ padding: '64px 120px' }}>
        <Reveal className="row" style={{ alignItems: 'stretch' }}>
          {profile.glance.map(([n, l], i) => (
            <div key={l} className="col" style={{ flex: 1, gap: 8, padding: `0 32px 0 ${i ? 32 : 0}px`, borderLeft: i ? '1px solid var(--line-2)' : undefined }}>
              <Counter value={n} className="t-l c-accent" />
              <span className="t-label c-muted">{l}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="sec" style={{ padding: '110px 120px', gap: 40 }}>
        <div className="col" style={{ gap: 14 }}>
          <span className="t-label c-muted">What I bring</span>
          <h2 className="t-l">Three things teams hire me for.</h2>
        </div>
        <Reveal className="row" style={{ gap: 24, alignItems: 'stretch', width: '100%' }}>
          {profile.pillars.map((p, i) => (
            <div key={p.title} className="col" style={{ flex: 1, gap: 18, padding: 36, borderRadius: 24, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
              <div style={{ position: 'relative', width: 120, height: 70 }}>
                {[0, 1, 2].map((k) => (
                  <Plane key={k} cx={60} cy={40 + (1 - k) * 10} s={0.08}>
                    <div className="face" style={{ background: k === 2 ? 'var(--accent)' : 'var(--bg)', border: `${1 / 0.08}px solid var(--line-2)` }} />
                  </Plane>
                ))}
              </div>
              <span className="t-data c-accent">0{i + 1}</span>
              <h3 className="t-hm">{p.title}</h3>
              <p className="t-bm c-muted">{p.text}</p>
              <div className="row wrap" style={{ gap: 8 }}>
                {p.proof.map(([l, slug]) => (
                  <TLink key={l} to={`/work/${slug}`} label={`Entering — ${l}`} className="chip t-label" style={{ padding: '6px 12px' }}>{l} ↗</TLink>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="sec sec--alt" style={{ padding: '110px 120px', gap: 40 }}>
        <div className="col" style={{ gap: 14 }}>
          <span className="t-label c-muted">How I work</span>
          <h2 className="t-l">Four habits, learned on real projects.</h2>
        </div>
        <Reveal className="row wrap" style={{ gap: 24 }}>
          {profile.habits.map(([t, b, src]) => (
            <div key={t} className="col" style={{ width: 588, gap: 12, padding: 32, borderRadius: 20, background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <h3 className="t-hm" style={{ fontSize: 28 }}>{t}</h3>
              <p className="t-bl c-muted" style={{ fontSize: 18 }}>{b}</p>
              <span className="t-label c-accent">Learned on · {src}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="sec" style={{ padding: '80px 120px', gap: 40 }}>
        <span className="t-label c-muted">Designed with &amp; for</span>
        <Reveal className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
          {profile.brands.map((b) => <span key={b} className="t-hm c-muted" style={{ fontSize: 30 }}>{b}</span>)}
        </Reveal>
      </section>

      <section className="sec sec--alt" style={{ padding: '110px 120px', gap: 40 }}>
        <div className="col" style={{ gap: 14 }}>
          <span className="t-label c-muted">Toolbox</span>
          <h2 className="t-l">What I build with.</h2>
        </div>
        <Reveal className="row wrap" style={{ gap: 10 }}>
          {profile.tools.map((t) => <span key={t} className="chip chip--body">{t}</span>)}
        </Reveal>
      </section>

      <section className="sec" style={{ padding: '110px 120px 130px', gap: 40 }}>
        <Reveal className="row" style={{ gap: 40, padding: 56, borderRadius: 28, background: 'var(--accent)', width: '100%' }}>
          <div className="col" style={{ gap: 10, flex: 1 }}>
            <span className="t-label c-ink-dark">Next step</span>
            <h2 className="t-l c-ink-dark">Want the full record, or a chat?</h2>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <TLink to="/resume" label="Résumé" className="t-label" style={{ padding: '15px 22px', borderRadius: 999, background: 'var(--bg)', color: 'var(--accent)' }}>Résumé →</TLink>
            <TLink to="/contact" label="Contact" className="t-label c-ink-dark" style={{ padding: '15px 22px', borderRadius: 999, border: '1px solid var(--bg)' }}>Contact →</TLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function AboutMobile() {
  const hero = useRef<HTMLDivElement>(null);
  useIntro(hero, 36);
  const sec = (fill?: boolean): CSSProperties => ({ padding: '44px 20px', gap: 18, background: fill ? 'var(--bg-2)' : undefined });
  return (
    <div className="page page--about-m">
      <div className="hero-frame" ref={hero} style={{ height: 820 }}>
        <DotGrid step={20} opacity={0.07} size={1} />
        <Glow x={-60} y={130} w={520} h={320} a={0.32} />
        <PortraitStack cx={195} cy={290} s={0.27} nameSize={170} mobile gap={36} />
        <div className="abs col" style={{ left: 20, top: 440, gap: 16 }}>
          <span data-intro><LabelMono text="About · India · remote" /></span>
          <h1 className="col" data-intro>
            <span className="t-l" style={{ fontSize: 40 }}>Hi, I’m Saksham.</span>
            <span className="t-l" style={{ fontSize: 40 }}>I design the layers</span>
            <span className="t-serif c-accent" style={{ fontSize: 48 }}>you don’t see.</span>
          </h1>
          <p className="t-bm c-muted" style={{ width: 350 }} data-intro>
            Product designer, 4.5+ years across AI, conversational and in-vehicle products at Verizon and HARMAN; founder of Bracket.
          </p>
          <div className="row" style={{ gap: 8 }} data-intro>
            <Button to="/resume" label="Résumé">Résumé</Button>
            <Button to="/contact" variant="ghost" label="Contact">Say hello</Button>
          </div>
        </div>
      </div>
      <section className="sec" style={sec(true)}>
        <div className="row wrap" style={{ gap: '24px 20px' }}>
          {[['4.5+', 'years in product design'], ['4', 'products shipped or validated'], ['3', 'companies'], ['CES', '2025 show floor']].map(([n, l]) => (
            <div key={l} className="col" style={{ width: 165, gap: 4 }}>
              <Counter value={n} className="t-l c-accent" style={{ fontSize: 44 }} />
              <span className="t-label c-muted">{l}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="sec" style={sec()}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>Three things teams hire me for.</h2>
        {[['01', 'AI & conversational UX', 'Agents and AI people can trust.', 'tello.ai · Bracket'], ['02', 'Automotive & multi-screen HMI', 'Usable at arm’s length, on five displays.', 'One Audio · Hyundai × B&O'], ['03', 'Systems & craft', 'Tokens, dev-ready specs, pixel-level QA.', '53 components · UI QA']].map(([n, t, b, pr]) => (
          <Reveal key={t} className="col" style={{ gap: 8, padding: 22, borderRadius: 18, background: 'var(--bg-2)', border: '1px solid var(--line)', width: '100%' }}>
            <span className="t-hs">{n}  {t}</span>
            <span className="t-bm c-muted">{b}</span>
            <span className="t-label c-accent">{pr}</span>
          </Reveal>
        ))}
      </section>
      <section className="sec" style={sec(true)}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>How I work</h2>
        {profile.habits.map(([t, , src]) => (
          <div key={t} className="col" style={{ gap: 4, paddingTop: 14, borderTop: '1px solid var(--line)', width: '100%' }}>
            <span className="t-hs" style={{ fontSize: 19 }}>{t}</span>
            <span className="t-label c-muted">Learned on · {src}</span>
          </div>
        ))}
      </section>
      <section className="sec" style={sec()}>
        <span className="t-label c-muted">Designed with &amp; for</span>
        <div className="row wrap" style={{ gap: '10px 16px' }}>
          {profile.brands.map((b) => <span key={b} className="t-hs c-muted">{b}</span>)}
        </div>
      </section>
      <section className="sec" style={{ ...sec(), paddingBottom: 80 }}>
        <div className="col" style={{ gap: 14, padding: 24, borderRadius: 20, background: 'var(--accent)', width: '100%' }}>
          <h2 className="t-hm c-ink-dark" style={{ fontSize: 26 }}>Want the full record, or a chat?</h2>
          <div className="row" style={{ gap: 8 }}>
            <TLink to="/resume" label="Résumé" className="t-label" style={{ padding: '12px 18px', borderRadius: 999, background: 'var(--bg)', color: 'var(--accent)' }}>Résumé →</TLink>
            <TLink to="/contact" label="Contact" className="t-label c-ink-dark" style={{ padding: '12px 18px', borderRadius: 999, border: '1px solid var(--bg)' }}>Contact →</TLink>
          </div>
        </div>
      </section>
    </div>
  );
}
