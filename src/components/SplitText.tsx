import { Fragment, useLayoutEffect, useRef, type ElementType } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useUI } from '../lib/ui';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  scroll?: boolean;
  /** Words rendered in the Instrument Serif italic accent. */
  serif?: string[];
};

/** Word-by-word masked reveal, triggered on scroll (or on entry for hero copy). */
export function SplitText({ text, as = 'h2', className = '', delay = 0, scroll = true, serif = [] }: Props) {
  const Tag = as as any;
  const ref = useRef<HTMLElement>(null);
  const { entered } = useUI();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll('.w__i');
    if (!entered) {
      gsap.set(words, { yPercent: 115 });
      return;
    }
    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, rotate: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.1,
          ease: 'expoOut',
          stagger: 0.045,
          delay,
          scrollTrigger: scroll ? { trigger: el, start: 'top 88%', once: true } : undefined,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [entered, delay, scroll, text]);

  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className={`w ${serif.includes(w.replace(/[.,]/g, '')) ? 'serif accent' : ''}`} aria-hidden>
            <span className="w__i">{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  );
}
