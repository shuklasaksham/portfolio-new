import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { getZoom } from '../lib/layout';

/**
 * Shared motion for the site pages:
 * - [data-in] elements rise in on load,
 * - [data-reveal] elements rise in when scrolled into view,
 * - .s-card tilts back and fades as it leaves the top (desktop "Why me?" stack).
 */
export function useSiteMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-in]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expoOut', stagger: 0.08, delay: 0.1 });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((r) => {
        gsap.fromTo(r, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expoOut', scrollTrigger: { trigger: r, start: 'top 88%', once: true } });
      });
      if (document.documentElement.dataset.layout !== 'mobile') {
        const z = getZoom();
        gsap.utils.toArray<HTMLElement>('.s-card').forEach((c, i, all) => {
          if (i === all.length - 1) return;
          gsap.to(c, {
            rotateX: 32,
            scale: 0.9,
            opacity: 0,
            transformOrigin: '50% 100%',
            ease: 'none',
            scrollTrigger: { trigger: c, start: `top ${140 * z}px`, end: `top ${-160 * z}px`, scrub: true },
          });
        });
      }
    }, el);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, [root]);
}
