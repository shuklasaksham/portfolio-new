import { useEffect, useRef, useState } from 'react';
import { isTouch } from '../lib/motion';

type Variant = 'default' | 'hover' | 'drag' | 'view';

/** Custom cursor: lerps toward the pointer; morphs by the nearest [data-cursor]. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>('default');
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(true);
  const [touch] = useState(() => isTouch());

  useEffect(() => {
    if (touch) return;
    document.documentElement.classList.add('has-cursor');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setHidden(false);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      const v = (el?.dataset.cursor as Variant) || 'default';
      setVariant(v);
      setLabel(el?.dataset.cursorLabel || (v === 'view' ? 'View' : v === 'drag' ? 'Drag' : ''));
    };
    const leave = () => setHidden(true);
    addEventListener('pointermove', move);
    addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [touch]);

  if (touch) return null;
  return (
    <div ref={ref} className={`cursor cursor--${variant} ${hidden ? 'is-hidden' : ''}`} aria-hidden>
      <div className="cursor__shape">
        <span className="cursor__dot" />
        <span className="cursor__label mono">{variant === 'drag' ? `‹ ${label} ›` : label}</span>
      </div>
    </div>
  );
}
