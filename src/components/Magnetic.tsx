import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, isTouch } from '../lib/motion';

/** Pulls its child toward the pointer (strength 0.3), springs back on leave. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expoOut' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expoOut' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
