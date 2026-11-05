import type { CSSProperties, ReactNode } from 'react';

// Exact Figma projection for every "layer": relativeTransform [[.927, -.866], [.375, .5]] × scale,
// applied to a 960 × 620 flat layer (the size of the Figma layer components).
export const A = 0.927;
export const B = 0.375;
export const C = -0.866;
export const D = 0.5;
export const LW = 960;
export const LH = 620;

export const matrix = (s: number) => `matrix(${A * s}, ${B * s}, ${C * s}, ${D * s}, 0, 0)`;

/** Screen position of a point (x, y) on a flat layer centred at (cx, cy). */
export function proj(s: number, cx: number, cy: number, x: number, y: number): [number, number] {
  const dx = x - LW / 2;
  const dy = y - LH / 2;
  return [cx + (A * dx + C * dy) * s, cy + (B * dx + D * dy) * s];
}

export const CORNERS: [number, number][] = [
  [0, 0],
  [LW, 0],
  [LW, LH],
  [0, LH],
];

type PlaneProps = {
  cx: number;
  cy: number;
  s: number;
  /** Multiplier of the --gap CSS var (layers above centre are negative). */
  k?: number;
  dx?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  planeRef?: (el: HTMLDivElement | null) => void;
};

/** A flat 960 × 620 layer, projected exactly like the Figma instances. */
export function Plane({ cx, cy, s, k = 0, dx = 0, className = '', style, children, planeRef, ...events }: PlaneProps) {
  return (
    <div
      ref={planeRef}
      className={`plane ${className}`}
      style={{
        left: cx - LW / 2,
        top: cy - LH / 2,
        transform: `translate(calc(${dx}px + var(--dx, 0px)), calc(var(--gap, 0px) * ${k})) ${matrix(s)}`,
        ...style,
      }}
      {...events}
    >
      {children}
    </div>
  );
}

/** Screenshot face. `framed` adds the Figma cover treatment (1px strong stroke, 20px radius). */
export function ImageFace({ src, framed = true }: { src: string; framed?: boolean }) {
  return <img className={`face face--img ${framed ? 'is-framed' : ''}`} src={src} alt="" draggable={false} />;
}

/** Phase layer: mono index (30px lime @ 56,52) + phase name (Display/XL 150px, 50px from bottom-left). */
export function PhaseFace({ n, name, size = 150, mono = 30 }: { n: string; name: string; size?: number; mono?: number }) {
  return (
    <div className="face face--phase">
      <span className="t-data c-accent" style={{ position: 'absolute', left: 56, top: 52, fontSize: mono }}>
        {n}
      </span>
      <span className="t-xl" style={{ position: 'absolute', left: 50, bottom: 50, fontSize: size, whiteSpace: 'nowrap' }}>
        {name}
      </span>
    </div>
  );
}

/** Plain shell (Figma rectangle: elevated fill, 1px strong stroke, 20 × s radius). */
export function ShellFace({ s, dashed = false, color }: { s: number; dashed?: boolean; color?: string }) {
  return (
    <div
      className={`face face--shell ${dashed ? 'is-dashed' : ''}`}
      style={{ borderWidth: `${1 / s}px`, borderColor: color, borderRadius: 20 }}
    />
  );
}

/** Face for one stack layer: Figma layer exports render as-is, screenshots get the cover frame, the rest are phase layers. */
export function StackFace({ layer, index, s }: { layer: { name: string; src?: string }; index: number; s: number }) {
  if (layer.src?.includes('/layer-')) return <ImageFace src={layer.src} framed={false} />;
  if (layer.src) return <ImageFace src={layer.src} />;
  void s;
  return <PhaseFace n={`0${index + 1}`} name={layer.name} />;
}

export function DotGrid({ step = 28, opacity = 0.09, size = 1.4 }: { step?: number; opacity?: number; size?: number }) {
  return (
    <div
      className="dotgrid"
      style={{
        backgroundImage: `radial-gradient(rgba(238,238,232,${opacity}) ${size * 0.5}px, transparent ${size * 0.5 + 0.6}px)`,
        backgroundSize: `${step}px ${step}px`,
        backgroundPosition: `${step / 2}px ${step / 2}px`,
      }}
    />
  );
}

/** Radial glow ellipse (Figma: centre colour → transparent at 60%). */
export function Glow({ x, y, w, h, color = '122,92,255', a = 0.32 }: { x: number; y: number; w: number; h: number; color?: string; a?: number }) {
  return (
    <div
      className="glow"
      style={{ left: x, top: y, width: w, height: h, background: `radial-gradient(closest-side, rgba(${color},${a}) 0%, rgba(${color},0) 60%)` }}
    />
  );
}
