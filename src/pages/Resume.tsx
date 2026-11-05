import { useEffect, useRef, type CSSProperties } from 'react';
import { profile } from '../data/profile';
import { DotGrid, Glow, Plane, proj, LW, LH } from '../components/Plane';
import { LabelMono } from '../components/Hud';
import { Button } from '../components/Button';
import { TLink } from '../components/Link';
import { Reveal } from '../components/Blocks';
import { MobileRail } from './CaseStudy';
import { useLayout } from '../lib/layout';
import { useUI } from '../lib/ui';
import { gsap, prefersReducedMotion } from '../lib/motion';

const ROLES: [string, string, string][] = [
  ['HARMAN', 'Associate Experience Designer', '2022 – 2024'],
  ['HARMAN', 'Experience Designer', '2024 – 2025'],
  ['Verizon', 'Experience Designer II', '2025 – Present'],
  ['Bracket', 'Founder & Product Designer', '2026 – Present'],
];
const CASE_NO: Record<string, string> = { bracket: '01', 'one-audio': '02', 'hyundai-bo': '03', tello: '04' };

function useIntro(ref: React.RefObject<HTMLElement | null>, to: number) {
  const { entered } = useUI();
  useEffect(() => {
    const el = ref.current;
    if (!el || !entered || prefersReducedMotion()) return;
    const q = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo('.career-stack', { '--gap': '0px', opacity: 0 }, { '--gap': `${to}px`, opacity: 1, duration: q ? 0.01 : 1.8, ease: 'expoOut', delay: 0.15 });
      gsap.fromTo('[data-intro]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: q ? 0.01 : 1.1, ease: 'expoOut', stagger: 0.07, delay: 0.3 });
    }, el);
    return () => ctx.revert();
  }, [entered, ref, to]);
}

function CareerPlane({ co, ro, yr, top, mobile }: { co: string; ro: string; yr: string; top: boolean; mobile?: boolean }) {
  const ink = top ? 'var(--bg)' : 'var(--ink)';
  const mut = top ? 'rgba(7,8,10,.6)' : 'var(--muted)';
  return (
    <div className="face" style={{ background: top ? 'var(--accent)' : 'var(--bg-2)', border: '1.5px solid var(--line-2)' }}>
      <span className="t-data" style={{ position: 'absolute', left: 56, top: 52, fontSize: mobile ? 40 : 30, color: mut }}>{yr}</span>
      <span className="t-xl" style={{ position: 'absolute', left: 50, bottom: mobile ? 40 : 110, fontSize: mobile ? 200 : 190, color: ink }}>{co}</span>
      {!mobile && <span className="t-hm" style={{ position: 'absolute', left: 58, top: LH - 104, fontSize: 42, color: mut }}>{ro}</span>}
    </div>
  );
}

export default function Resume() {
  return useLayout() === 'mobile' ? <ResumeMobile /> : <ResumeDesktop />;
}

function ResumeDesktop() {
  const hero = useRef<HTMLDivElement>(null);
  useIntro(hero, 112);
  const s = 0.4;
  const cx = 870;
  const cy = 520;
  return (
    <div className="page page--resume">
      <div className="hero-frame" ref={hero} style={{ height: 1000 }}>
        <DotGrid opacity={0.07} />
        <Glow x={430} y={520} w={1000} h={520} a={0.32} />
        <div className="mini-stack career-stack" style={{ '--gap': '112px' } as CSSProperties}>
          {ROLES.map(([co, ro, yr], i) => (
            <Plane key={yr} cx={cx} cy={cy} s={s} k={1.5 - i} className="shadow-lg">
              <CareerPlane co={co} ro={ro} yr={yr} top={i === 3} />
            </Plane>
          ))}
        </div>
        {ROLES.map(([co, , yr], i) => {
          const [rx, ry] = proj(s, cx, cy + (1.5 - i) * 112, LW, 0);
          const top = i === 3;
          return (
            <div key={yr} data-intro>
              <svg className="abs" style={{ left: 0, top: 0, overflow: 'visible' }} width="1" height="1" aria-hidden>
                <path d={`M${rx + 8} ${ry} L1106 ${ry}`} stroke={top ? '#FF505F' : 'rgba(238,238,232,.3)'} fill="none" />
                <circle cx={rx + 8} cy={ry} r="3" fill={top ? '#FF505F' : '#EEEEE8'} />
              </svg>
              <div className="abs col" style={{ left: 1130, top: ry - 22, gap: 4 }}>
                <span className={`t-hs ${top ? 'c-accent' : ''}`}>{yr.split(' ')[0]}</span>
                <span className="t-label c-muted">{co}</span>
              </div>
            </div>
          );
        })}
        <div className="abs col" style={{ left: 120, top: 170, gap: 24 }}>
          <span data-intro><LabelMono text="Résumé · 4.5+ years" /></span>
          <h1 className="col" data-intro>
            <span className="t-xl">A career,</span>
            <span className="t-serif c-accent">stacked.</span>
          </h1>
          <p className="t-bl c-muted" style={{ width: 470 }} data-intro>
            Product designer leading end-to-end design for AI-powered, conversational and in-vehicle products at Verizon and HARMAN, and founder of Bracket, an AI-native decision OS.
          </p>
          <div className="row no-print" style={{ gap: 10 }} data-intro>
            <Button onClick={() => window.print()} arrow="↓">Download PDF</Button>
            <Button href={profile.linkedin} variant="ghost" arrow="↗">LinkedIn</Button>
          </div>
        </div>
        <div className="abs row" style={{ left: 120, top: 850, gap: 48 }} data-intro>
          {[['+7%', 'conversion lift · tello.ai'], ['5×', 'faster plan selection'], ['40%', 'faster in-car interactions'], ['65%', 'faster device setup']].map(([n, l]) => (
            <div key={l} className="col" style={{ gap: 4 }}>
              <span className="t-hm c-accent">{n}</span>
              <span className="t-label c-muted">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="sec" style={{ padding: '110px 120px', gap: 0 }}>
        <div className="col" style={{ gap: 14 }}>
          <span className="t-label c-muted">Experience</span>
          <h2 className="t-l">Four layers, newest on top.</h2>
        </div>
        <div style={{ height: 40 }} />
        {profile.experience.map((r) => (
          <Reveal key={r.role + r.years} className="row" style={{ gap: 48, padding: '36px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start', width: '100%' }}>
            <div className="col" style={{ width: 300, flex: 'none', gap: 10 }}>
              <span className="t-data c-accent">{r.years}</span>
              <span className="t-hs">{r.role}</span>
              <span className="t-label c-muted">{r.company} · {r.place}</span>
            </div>
            <div className="col" style={{ flex: 1, gap: 14 }}>
              {r.bullets.map((b) => (
                <div key={b} className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
                  <span className="t-bm c-faint">—</span>
                  <span className="t-bm">{b}</span>
                </div>
              ))}
            </div>
            <TLink to={`/work/${r.slug}`} label="Case study" className="chip t-label c-muted no-print" style={{ padding: '6px 12px' }}>Case study {CASE_NO[r.slug]} ↗</TLink>
          </Reveal>
        ))}
      </section>

      <section className="sec sec--alt" style={{ padding: '110px 120px', gap: 40 }}>
        <div className="col" style={{ gap: 14 }}>
          <span className="t-label c-muted">Skills</span>
          <h2 className="t-l">What each layer is made of.</h2>
        </div>
        <Reveal className="row wrap" style={{ gap: '40px 48px' }}>
          {profile.skills.map(([k, items]) => (
            <div key={k} className="col" style={{ width: 576, gap: 16, paddingTop: 20, borderTop: '1px solid var(--line-2)' }}>
              <span className="t-label c-accent">{k}</span>
              <div className="row wrap" style={{ gap: 8 }}>
                {items.map((s) => <span key={s} className="chip t-bm" style={{ padding: '8px 14px', letterSpacing: 0 }}>{s}</span>)}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="sec" style={{ padding: '110px 120px' }}>
        <Reveal className="row" style={{ gap: 48, alignItems: 'stretch', width: '100%' }}>
          <div className="col" style={{ flex: 1, gap: 12, padding: 32, borderRadius: 18, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
            <span className="t-label c-accent">Education · {profile.education.years}</span>
            <span className="t-hs">{profile.education.degree}</span>
            <span className="t-bm c-muted">{profile.education.school}</span>
          </div>
          <a href={`mailto:${profile.email}`} className="col" data-cursor="hover" style={{ flex: 1, gap: 12, padding: 32, borderRadius: 18, background: 'var(--accent)' }}>
            <span className="t-label c-ink-dark">Contact · India</span>
            <span className="t-hs c-ink-dark">{profile.email}</span>
            <span className="t-data" style={{ color: 'rgba(7,8,10,.7)' }}>linkedin.com/in/saksham-shuklaa  ·  sakshamshukla.com</span>
          </a>
        </Reveal>
      </section>
    </div>
  );
}

function ResumeMobile() {
  const hero = useRef<HTMLDivElement>(null);
  useIntro(hero, 44);
  const sec = (fill?: boolean): CSSProperties => ({ padding: '44px 20px', gap: 18, background: fill ? 'var(--bg-2)' : undefined });
  const short: Record<string, string> = {
    bracket: 'AI decision OS: 148 users, 115 projects, 53-component system.',
    tello: 'tello.ai: 5× faster plan selection, +7% conversion in a 2,400-user A/B test.',
    'hyundai-bo': 'Hyundai × B&O: 3 → 1 navigation layers, 40% faster, 76% satisfaction.',
    'one-audio': 'One Audio for Harman Kardon: 65% faster setup, shown at CES 2025.',
  };
  return (
    <div className="page page--resume-m">
      <div className="hero-frame" ref={hero} style={{ height: 720 }}>
        <DotGrid step={20} opacity={0.07} size={1} />
        <Glow x={-65} y={180} w={520} h={320} a={0.32} />
        <div className="mini-stack career-stack" style={{ '--gap': '44px' } as CSSProperties}>
          {ROLES.map(([co, ro, yr], i) => (
            <Plane key={yr} cx={195} cy={250} s={0.27} k={1.5 - i} className="shadow-lg">
              <CareerPlane co={co} ro={ro} yr={yr.split(' ')[0]} top={i === 3} mobile />
            </Plane>
          ))}
        </div>
        <div className="abs col" style={{ left: 20, top: 420, gap: 14 }}>
          <span data-intro><LabelMono text="Résumé · 4.5+ years" /></span>
          <h1 className="t-hm" style={{ fontSize: 30, width: 350 }} data-intro>A career, stacked.</h1>
          <p className="t-bm c-muted" style={{ width: 350 }} data-intro>
            Product designer leading end-to-end design for AI-powered, conversational and in-vehicle products at Verizon and HARMAN; founder of Bracket.
          </p>
        </div>
      </div>
      <section className="sec" style={sec()}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>Experience</h2>
        {profile.experience.map((r) => (
          <Reveal key={r.years + r.role} className="col" style={{ gap: 6, paddingTop: 16, borderTop: '1px solid var(--line)', width: '100%' }}>
            <span className="t-data c-accent">{r.years}</span>
            <span className="t-hs">{r.role} · {r.company.replace(' International', '').replace(' · side venture', '')}</span>
            <span className="t-bm c-muted">{short[r.slug]}</span>
          </Reveal>
        ))}
      </section>
      <section className="sec" style={sec(true)}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>Skills</h2>
        <div className="row wrap" style={{ gap: 8 }}>
          {['Conversational UX', 'Agentic AI', 'Human-AI interaction', 'Automotive HMI', 'Interaction design', 'Design systems', 'Design tokens', 'Prototyping', 'Usability testing', 'Product strategy', '0 → 1', 'Figma', 'ProtoPie', 'Framer'].map((s) => (
            <span key={s} className="chip t-bm" style={{ padding: '7px 12px', letterSpacing: 0 }}>{s}</span>
          ))}
        </div>
      </section>
      <section className="sec" style={{ ...sec(), paddingBottom: 120 }}>
        <div className="col" style={{ gap: 8, padding: 22, borderRadius: 16, background: 'var(--bg-2)', border: '1px solid var(--line)', width: '100%' }}>
          <span className="t-label c-accent">Education · 2018 – 2022</span>
          <span className="t-hs">{profile.education.degree}</span>
        </div>
        <a href={`mailto:${profile.email}`} className="col" style={{ gap: 8, padding: 22, borderRadius: 16, background: 'var(--accent)', width: '100%' }}>
          <span className="t-label c-ink-dark">Contact</span>
          <span className="t-hs c-ink-dark">{profile.email}</span>
          <span className="t-data" style={{ color: 'rgba(7,8,10,.7)' }}>linkedin.com/in/saksham-shuklaa</span>
        </a>
      </section>
      <MobileRail text="Résumé · 4 layers" />
    </div>
  );
}
