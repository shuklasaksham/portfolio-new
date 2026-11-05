import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/** Counts up the numeric part of values like "148", "+7%", "5×", "4.2" when scrolled into view. */
export function Counter({ value, className = '', style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([^\d−-]*)([−-]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!el || !m || value.includes('→') || prefersReducedMotion()) return;
    const [, pre, sign, num, post] = m;
    const target = parseFloat(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const obj = { v: 0 };
    const render = () => {
      el.textContent = `${pre}${sign}${obj.v.toFixed(decimals)}${post}`;
    };
    render();
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: 1.6, ease: 'expoOut', onUpdate: render }),
    });
    return () => {
      st.kill();
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  );
}
