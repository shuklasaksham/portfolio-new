import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useSound } from '../lib/sound';
import { Counter } from './Counter';

/** Fade/rise children marked [data-reveal] when the block scrolls into view. */
export function Reveal({ children, className = '', style, as: Tag = 'div' }: { children: ReactNode; className?: string; style?: CSSProperties; as?: any }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expoOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Accordion from the Figma "Accordion" component set (Closed ↔ Open). */
export function Accordion({ items, titleSize, bodyClass = 't-bl c-muted' }: { items: [string, string][]; titleSize?: number; bodyClass?: string }) {
  const [open, setOpen] = useState(-1);
  const bodies = useRef<(HTMLDivElement | null)[]>([]);
  const { tick } = useSound();
  const toggle = (i: number) => {
    tick();
    const next = open === i ? -1 : i;
    if (open >= 0 && bodies.current[open]) gsap.to(bodies.current[open], { height: 0, duration: 0.5, ease: 'expoOut' });
    if (next >= 0 && bodies.current[next])
      gsap.fromTo(bodies.current[next], { height: 0 }, { height: 'auto', duration: 0.7, ease: 'expoOut', onComplete: () => ScrollTrigger.refresh() });
    setOpen(next);
  };
  return (
    <div className="col" style={{ width: '100%' }}>
      {items.map(([t, b], i) => (
        <div className={`acc ${open === i ? 'is-open' : ''}`} key={t} style={{ width: '100%' }}>
          <button className="acc__head" aria-expanded={open === i} onClick={() => toggle(i)} data-cursor="hover">
            <span className="t-hs" style={titleSize ? { fontSize: titleSize } : undefined}>{t}</span>
            <span className="acc__toggle t-hs">{open === i ? '–' : '+'}</span>
          </button>
          <div className="acc__body" ref={(el) => { bodies.current[i] = el; }}>
            <p className={bodyClass}>{b}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

type Pin = { x: number; y: number; label: string };
/** Product screenshot with numbered pins + tags (pins pop in sequence on scroll). */
export function Shot({ src, w, h, pins = [], start = 1, radius, tags = true, size = 30 }: { src: string; w: number; h: number; pins?: Pin[]; start?: number; radius: number; tags?: boolean; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expoOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      gsap.fromTo(el.querySelectorAll('.pin__dot'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', stagger: 0.14, delay: 0.5, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
      gsap.fromTo(el.querySelectorAll('.pin__tag'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.7, ease: 'expoOut', stagger: 0.14, delay: 0.7, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div className="shot" ref={ref} style={{ width: w, height: h }}>
      <img src={src} alt="" loading="lazy" style={{ borderRadius: radius }} draggable={false} />
      {pins.map((p, k) => (
        <span className="pin" key={k} style={{ left: p.x * w, top: p.y * h }} data-cursor="hover">
          <span className="pin__dot t-data" style={size !== 30 ? { width: size, height: size, left: -size / 2, top: -size / 2, fontSize: 11 } : undefined}>{start + k}</span>
          {tags && <span className={`pin__tag t-label c-ink ${p.x > 0.62 ? 'is-left' : ''}`}>{p.label}</span>}
        </span>
      ))}
    </div>
  );
}

/** Bars card used in Impact (Before vs After). */
export function Bars({ label, before, after, beforeText, afterText, pad = 36, radius = 24, width }: { label: string; before: number; after: number; beforeText: string; afterText: string; pad?: number; radius?: number; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll('.bar-fill').forEach((b, i) =>
        gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: prefersReducedMotion() ? 0.01 : 1.6, ease: 'expoOut', delay: i * 0.35, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }),
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="col" style={{ gap: pad === 36 ? 20 : 14, padding: pad, borderRadius: radius, background: 'var(--bg)', border: '1px solid var(--line)', flex: width ? undefined : 1, width, alignItems: 'stretch' }}>
      <span className="t-label c-muted">{label}</span>
      {([['Before', 1, beforeText, false], ['After', after / before, afterText, true]] as const).map(([k, v, t, on]) => (
        <div className="col" key={k} style={{ gap: 8, alignItems: 'stretch' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className={`t-label ${on ? 'c-accent' : 'c-muted'}`}>{k}</span>
            <span className={`t-hs ${on ? 'c-accent' : ''}`}>{t}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${v * 100}%`, background: on ? 'var(--accent)' : 'var(--faint)', boxShadow: on ? '0 0 20px rgba(255,80,95,.5)' : undefined }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Metric({ n, l, size = 64, pad = 32, radius = 24, width }: { n: string; l: string; size?: number; pad?: number; radius?: number; width?: number }) {
  return (
    <div className="col" style={{ gap: size > 40 ? 10 : 4, padding: pad, borderRadius: radius, background: 'var(--bg)', border: '1px solid var(--line)', flex: width ? undefined : 1, width }}>
      <Counter value={n} className={size > 40 ? 't-l c-accent' : 't-hm c-accent'} style={{ fontSize: size }} />
      <span className="t-label c-muted">{l}</span>
    </div>
  );
}
