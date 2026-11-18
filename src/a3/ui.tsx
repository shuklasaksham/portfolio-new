import { useEffect, type ReactNode } from 'react';
import { TIER_TAG, type Shot, type Tier } from './content';

/* ---------- small pieces ---------- */

export const Label = ({ children, tone, as: As = 'p' }: { children: ReactNode; tone?: 'accent' | 'muted'; as?: 'p' | 'span' }) => (
  <As className={`lbl${tone ? ` lbl--${tone}` : ''}`}>{children}</As>
);

export const Tag = ({ tier }: { tier: Tier }) => <span className={`tag tag--${tier}`}>{TIER_TAG[tier]}</span>;

/** Title with the accent phrase set in Newsreader italic. */
export function Accent({ text, accent }: { text: string; accent: string }) {
  const i = text.lastIndexOf(accent);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em>{accent}</em>
      {text.slice(i + accent.length)}
    </>
  );
}

export const Img = ({ shot, className, eager }: { shot: Shot; className?: string; eager?: boolean }) => (
  <img
    className={className}
    src={shot.src}
    alt={shot.alt}
    width={shot.w}
    height={shot.h}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
  />
);

/** Instrument-style gauge used only in the HARMAN work. */
export function Gauge({ n, label, fill, size = 'md' }: { n: string; label: string; fill: number; size?: 'sm' | 'md' }) {
  const r = 52;
  const arc = 2 * Math.PI * r * 0.75;
  return (
    <div className={`gauge gauge--${size}`} role="img" aria-label={`${n} ${label}`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle className="gauge__track" cx="64" cy="64" r={r} strokeDasharray={`${arc} 999`} transform="rotate(135 64 64)" />
        <circle
          className="gauge__fill"
          cx="64"
          cy="64"
          r={r}
          style={{ ['--arc' as string]: arc, ['--to' as string]: arc * (1 - fill / 100) }}
          strokeDasharray={`${arc} 999`}
          transform="rotate(135 64 64)"
        />
      </svg>
      <span className="gauge__n">{n}</span>
      <span className="gauge__l">{label}</span>
    </div>
  );
}

/* ---------- reveal on scroll (respects reduced motion via CSS) ---------- */

export function useReveal(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-rv]:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}
