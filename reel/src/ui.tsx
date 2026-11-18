// Building blocks for the showreel. Everything animates with translate and opacity only
// (no scaling of text), so every frame stays sharp.
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGeist } from '@remotion/google-fonts/Geist';
import { loadFont as loadMono } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSerif } from '@remotion/google-fonts/Newsreader';

export const SANS = loadGeist('normal', { weights: ['400', '500', '600'], subsets: ['latin'] }).fontFamily;
export const MONO = loadMono('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const SERIF = loadSerif('italic', { weights: ['400'], subsets: ['latin'] }).fontFamily;

export const C = {
  bg: '#0b0f0d',
  ink: '#f3f6f4',
  mint: '#9ef0c6',
  lime: '#c8ff4d',
  muted: '#8f9a94',
  glow: '#104332',
};

const EASE = Easing.bezier(0.2, 0.7, 0.2, 1);

/** 0 → 1 over `dur` frames starting at `from`, eased. */
export function useIn(from: number, dur = 36) {
  const f = useCurrentFrame();
  return interpolate(f, [from, from + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
}

/** A soft spring 0 → 1 starting at `from`. */
export function useSpring(from: number, damping = 200) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: { damping, mass: 0.9, stiffness: 90 } });
}

/** Dark green stage with a slowly drifting glow. */
export function Stage({ children, glowX = 85, glowY = 95 }: { children: ReactNode; glowX?: number; glowY?: number }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(f, [0, durationInFrames], [0, 6]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 70% at ${glowX - drift}% ${glowY}%, ${C.glow} 0%, rgba(16,67,50,0) 62%),
          radial-gradient(40% 50% at ${10 + drift}% 0%, rgba(158,240,198,.06) 0%, rgba(0,0,0,0) 70%), ${C.bg}`,
        fontFamily: SANS,
        color: C.ink,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

/** A line that slides up from behind a mask. */
export function Reveal({ at, children, style, dur = 40 }: { at: number; children: ReactNode; style?: CSSProperties; dur?: number }) {
  const p = useIn(at, dur);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>{children}</div>
    </div>
  );
}

export function Eyebrow({ at, children }: { at: number; children: ReactNode }) {
  const p = useIn(at, 30);
  return (
    <div style={{ font: `400 22px/1.4 ${MONO}`, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mint, opacity: p, transform: `translateX(${(1 - p) * -24}px)` }}>
      {children}
    </div>
  );
}

/** Headline lines; wrap the accent phrase in <em>. */
export function Headline({ at, lines, size = 92 }: { at: number; lines: ReactNode[]; size?: number }) {
  return (
    <div style={{ fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.04em' }}>
      {lines.map((l, i) => (
        <Reveal key={i} at={at + i * 8}>{l}</Reveal>
      ))}
    </div>
  );
}

export const Em = ({ children }: { children: ReactNode }) => (
  <em style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.08em', letterSpacing: '-0.02em', color: C.mint }}>{children}</em>
);

/** A number that counts up, e.g. prefix "+", value 7, suffix "%". */
export function Stat({ at, prefix = '', value, suffix = '', label, from = 0, align = 'right' }: {
  at: number; prefix?: string; value: number; suffix?: string; label: string; from?: number; align?: 'left' | 'right';
}) {
  const f = useCurrentFrame();
  const p = useIn(at, 24);
  const n = Math.round(interpolate(f, [at, at + 54], [from, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }));
  return (
    <div style={{ textAlign: align, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ fontWeight: 600, fontSize: 120, lineHeight: 1, letterSpacing: '-0.045em', color: C.lime, fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{n}{suffix}
      </div>
      <div style={{ marginTop: 14, font: `400 20px/1.3 ${MONO}`, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{label}</div>
    </div>
  );
}

/** A small line of proof under the headline (shipped status, scale). */
export function Note({ at, children }: { at: number; children: ReactNode }) {
  const p = useIn(at, 30);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: 'rgba(243,246,244,.82)', opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: C.lime, boxShadow: `0 0 16px ${C.lime}` }} />
      {children}
    </div>
  );
}

/** A product screenshot that rises in and drifts slowly. Shown at or below its native size. */
export function Shot({ src, at, style, radius = 18, drift = 24, from = 'bottom' }: {
  src: string; at: number; style?: CSSProperties; radius?: number; drift?: number; from?: 'bottom' | 'right' | 'left';
}) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = useSpring(at);
  const d = interpolate(f, [at, durationInFrames], [0, -drift], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const off = (1 - s) * 120;
  const t = from === 'bottom' ? `translate3d(0, ${off + d}px, 0)` : from === 'right' ? `translate3d(${off}px, ${d}px, 0)` : `translate3d(${-off}px, ${d}px, 0)`;
  return (
    <Img
      src={staticFile(`shots/${src}`)}
      style={{
        position: 'absolute', display: 'block', borderRadius: radius, opacity: Math.min(1, s * 1.4),
        boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.07)', transform: t, ...style,
      }}
    />
  );
}
