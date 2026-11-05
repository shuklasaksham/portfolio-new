import { useEffect, useRef, useState } from 'react';
import { useUI } from '../lib/ui';
import { useGo } from '../lib/transition';
import { useSound } from '../lib/sound';
import { gsap } from '../lib/motion';
import { lockScroll } from '../lib/scroll';
import { profile } from '../data/profile';
import { DotGrid, Glow, Plane, LH } from './Plane';
import { useLayout } from '../lib/layout';

const ITEMS = [
  { n: '01', label: 'Work', to: '/work', sub: '4 case studies · 2024 – 2026' },
  { n: '02', label: 'About', to: '/about', sub: 'Principles & approach' },
  { n: '03', label: 'Résumé', to: '/resume', sub: 'Experience · skills · tools' },
  { n: '04', label: 'Contact', to: '/contact', sub: 'Say hello' },
];

/** Figma "04 — Menu / Layers" (desktop) and "M03 — Menu / Layers" (mobile). */
export function Menu() {
  const { menuOpen, setMenuOpen } = useUI();
  const go = useGo();
  const { tick } = useSound();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const layout = useLayout();
  const m = layout === 'mobile';

  useEffect(() => {
    const el = root.current!;
    if (first.current) {
      first.current = false;
      gsap.set(el, { autoAlpha: 0 });
      return;
    }
    lockScroll(menuOpen);
    const items = el.querySelectorAll('.menu-item');
    const planes = el.querySelectorAll('.menu-plane');
    if (menuOpen) {
      setActive(0);
      gsap.timeline()
        .set(el, { autoAlpha: 1 })
        .fromTo(el.querySelector('.menu__bg'), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'expoOut' })
        .fromTo(items, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expoOut', stagger: 0.06 }, '<0.05')
        .fromTo(planes, { x: 220, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'expoOut', stagger: 0.08 }, '<')
        .fromTo(el.querySelectorAll('.menu-socials > *'), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.04 }, '<0.3');
    } else {
      gsap.timeline()
        .to(items, { y: -30, opacity: 0, duration: 0.35, ease: 'power3.in', stagger: 0.03 })
        .to(planes, { x: -140, opacity: 0, duration: 0.4, stagger: 0.03 }, '<')
        .to(el, { autoAlpha: 0, duration: 0.35 }, '-=0.15');
    }
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!menuOpen) return;
      if (e.key === 'Escape') setMenuOpen(false);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => {
          const nx = (a + (e.key === 'ArrowDown' ? 1 : 3)) % 4;
          root.current?.querySelectorAll<HTMLAnchorElement>('.menu-item a')[nx]?.focus();
          return nx;
        });
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  const nav = (to: string, label: string) => {
    setMenuOpen(false);
    setTimeout(() => go(to, { label }), 260);
  };

  const s = m ? 0.3 : 0.46;
  const cx = m ? 195 : 930;
  const cy = m ? 300 : 470;
  const g = m ? 62 : 112;
  const lift = m ? 30 : 56;

  return (
    <div className="menu" id="site-menu" ref={root} aria-hidden={!menuOpen}>
      <div className="menu__bg" />
      <div className="frame">
        <DotGrid step={m ? 20 : 28} opacity={m ? 0.08 : 0.05} size={m ? 1 : 1.4} />
        <div className={`artboard ${m ? 'artboard--m' : ''}`}>
          <Glow x={cx - (m ? 260 : 500)} y={cy + (m ? 100 : 190) - (m ? 160 : 190)} w={m ? 520 : 1000} h={m ? 320 : 380} a={0.3} />
          {[...ITEMS].reverse().map((it) => {
            const i = ITEMS.indexOf(it);
            const idx = 3 - i;
            const lifted = active === i;
            return (
              <Plane
                key={it.to}
                cx={cx}
                cy={cy + (1.5 - idx) * g - (lifted ? lift : 0)}
                s={s}
                className="menu-plane shadow-lg"
                style={{ zIndex: idx, transition: 'top .8s var(--ease)' }}
              >
                <div className="face" style={{ background: lifted ? 'var(--accent)' : 'var(--bg-2)', border: '1.5px solid var(--line-2)' }}>
                  <span className="t-data" style={{ position: 'absolute', left: 60, top: 48, fontSize: 28, color: lifted ? 'var(--bg)' : 'var(--muted)' }}>{it.n}</span>
                  <span className="t-xl" style={{ position: 'absolute', left: 56, top: LH - 24 - 210 * 0.92, fontSize: 210, color: lifted ? 'var(--bg)' : 'var(--ink)' }}>{it.label}</span>
                </div>
              </Plane>
            );
          })}
          <nav className="abs col" style={m ? { left: 20, top: 560, gap: 12 } : { left: 40, top: 170, gap: 22 }} aria-label="Main">
            {ITEMS.map((it, i) => {
              const on = active === i;
              return (
                <div className="menu-item col" key={it.to} style={{ gap: 4 }}>
                  <a
                    href={it.to}
                    data-cursor="hover"
                    tabIndex={menuOpen ? 0 : -1}
                    onMouseEnter={() => { setActive(i); tick(); }}
                    onFocus={() => setActive(i)}
                    onClick={(e) => { e.preventDefault(); nav(it.to, it.label); }}
                    style={{ gap: m ? 14 : 16 }}
                  >
                    <span className={`t-data ${on ? 'c-accent' : 'c-faint'}`}>{it.n}</span>
                    <span
                      className={`menu-word ${on ? 't-serif c-accent' : 't-l'}`}
                      style={{ fontSize: m ? (on ? 46 : 40) : on ? 76 : 64, opacity: on ? 1 : 0.45 }}
                    >
                      {it.label}
                    </span>
                  </a>
                  {!m && <span className="t-label c-muted" style={{ opacity: on ? 1 : 0.6 }}>{it.sub}</span>}
                </div>
              );
            })}
          </nav>
          <div className="abs row menu-socials" style={m ? { left: 20, top: 808, gap: 18 } : { left: 40, top: 836, gap: 28 }}>
            <a className="t-label c-muted" href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="hover">LinkedIn ↗</a>
            <a className="t-label c-muted" href={`mailto:${profile.email}`} data-cursor="hover">Email ↗</a>
            <a className="t-label c-muted" href="/resume" onClick={(e) => { e.preventDefault(); nav('/resume', 'Résumé'); }} data-cursor="hover">{m ? 'PDF ↓' : 'Résumé PDF ↓'}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
