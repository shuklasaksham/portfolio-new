import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start());
  document.documentElement.classList.toggle('is-locked', locked);
}

/** Smooth-scroll so `el` sits `offset` CSS px below the top of the viewport. */
export function scrollToEl(el: HTMLElement, offset = 0) {
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: 'smooth' });
}
