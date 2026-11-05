import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { allImages } from '../data/projects';
import { lockScroll } from '../lib/scroll';
import { DotGrid, Glow, Plane } from './Plane';
import { LabelMono } from './Hud';
import { useLayout } from '../lib/layout';

const STEPS = ['research', 'tokens', 'components', 'screens', 'prototype'];
const NAMES = ['Research', 'Tokens', 'Components', 'Screens', 'Prototype'];

/** Figma "01 — Loader / Assembling" (desktop) / "M00 Loader" (mobile). Progress is real asset loading. */
export function Loader({ onEnter }: { onEnter: (sound: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const layout = useLayout();
  const m = layout === 'mobile';

  useEffect(() => {
    lockScroll(true);
    let done = 0;
    const urls = [...allImages, '/img/attention.webp', '/img/review.webp'];
    const total = urls.length + 1;
    const bump = () => setProgress(++done / total);
    urls.forEach((u) => {
      const img = new Image();
      img.onload = img.onerror = bump;
      img.src = u;
    });
    document.fonts.ready.then(bump);
  }, []);

  useEffect(() => {
    gsap.to(shown.current, {
      v: progress,
      duration: 0.7,
      ease: 'expoOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(shown.current.v * 100));
      },
      onComplete: () => progress >= 1 && setReady(true),
    });
  }, [progress]);

  useLayoutEffect(() => {
    if (ready && root.current && !prefersReducedMotion())
      gsap.fromTo(root.current.querySelectorAll('.loader-cta > *'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'expoOut' });
  }, [ready]);

  const enter = (sound: boolean) => {
    const el = root.current!;
    const q = prefersReducedMotion();
    gsap
      .timeline({ onComplete: () => { lockScroll(false); onEnter(sound); } })
      .to(el.querySelectorAll('.loader-ui'), { opacity: 0, y: -16, duration: q ? 0.01 : 0.35 })
      .to(el, { yPercent: -100, duration: q ? 0.01 : 1, ease: 'expoInOut' }, '-=0.1');
  };

  // "Scene ready — press enter": the Enter key works as well as the buttons.
  const entering = useRef(false);
  useEffect(() => {
    if (!ready) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || entering.current) return;
      entering.current = true;
      enter(false);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [ready]);

  const step = Math.min(4, Math.floor(progress * 5));
  const s = m ? 0.24 : 0.44;
  const cx = m ? 195 : 720;
  const cy = m ? 360 : 380;
  const g = m ? 10 : 18;

  return (
    <div className="loader" ref={root}>
      <div className="frame">
        <DotGrid step={m ? 20 : 28} opacity={m ? 0.07 : 0.09} size={m ? 1 : 1.4} />
        <div className={`artboard ${m ? 'artboard--m' : ''}`}>
          <Glow x={m ? -55 : 270} y={m ? 300 : 280} w={m ? 500 : 900} h={m ? 300 : 360} a={0.3} />
          {STEPS.map((k, i) => {
            const done = progress >= (i + 1) / 5;
            const active = !done && progress >= i / 5;
            return (
              <Plane key={k} cx={cx} cy={cy + (2 - i) * g} s={s} className={`loader-shell ${done ? 'shadow-lg' : ''}`} style={{ zIndex: i }}>
                <div
                  className="face"
                  style={{
                    background: done ? 'var(--bg-2)' : 'transparent',
                    border: `${(active ? 2 : 1.6) / s}px ${done ? 'solid' : 'dashed'} ${done ? 'var(--line-2)' : active ? 'rgba(255,80,95,.95)' : 'rgba(255,80,95,.35)'}`,
                  }}
                />
              </Plane>
            );
          })}
          {!m && (
            <div className="abs loader-ui row" style={{ left: 40, top: 40, width: 1360, justifyContent: 'space-between' }}>
              <span className="t-label c-muted">Saksham Shukla — Product Designer</span>
              <span className="t-label c-muted">Best with sound · headphones on</span>
            </div>
          )}
          {m && <span className="abs loader-ui t-label c-muted" style={{ left: 20, top: 32 }}>Saksham Shukla — Portfolio</span>}
          <div className="abs loader-counter loader-ui" style={m ? { left: 195, top: 520 } : undefined}>
            <div className="row" style={{ alignItems: 'flex-end', gap: 4 }}>
              <span className="t-xl loader-num" ref={num} style={m ? { fontSize: 88 } : undefined}>0</span>
              <span className="t-hm c-muted">%</span>
            </div>
            <LabelMono text={ready ? 'Scene ready — press enter' : `Assembling layer 0${step + 1} / 05 — ${NAMES[step]}`} />
          </div>
          <div className="abs loader-cta" style={m ? { left: 195, top: 680 } : undefined}>
            {ready && (
              <>
                <button className="btn btn--primary" data-cursor="hover" onClick={() => enter(true)}>
                  <span className="btn__roll"><span>Enter with sound</span><span aria-hidden>Enter with sound</span></span>
                  <span className="btn__arrow">→</span>
                </button>
                <button className="btn btn--ghost" data-cursor="hover" onClick={() => enter(false)}>
                  <span className="btn__roll"><span>Enter muted</span><span aria-hidden>Enter muted</span></span>
                  <span className="btn__arrow">→</span>
                </button>
              </>
            )}
          </div>
          {!m && (
            <div className="abs loader-ui row" style={{ left: 40, top: 844, gap: 28 }}>
              {STEPS.map((k, i) => {
                const done = progress >= (i + 1) / 5;
                const cur = !done && step === i;
                return (
                  <span key={k} className={`t-label ${done ? 'c-muted' : 'c-faint'}`}>
                    {k} {done ? '✓' : cur ? '…' : '—'}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
