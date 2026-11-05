import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Motion tokens from the Figma motion spec.
CustomEase.create('expoOut', '0.16, 1, 0.3, 1');
CustomEase.create('expoInOut', '0.87, 0, 0.13, 1');

export const EASE_OUT = 'expoOut';
export const EASE_IN_OUT = 'expoInOut';

/** `?snap` (dev QA) jumps every animation to its end state, like reduced motion. */
export const SNAP = typeof window !== 'undefined' && new URLSearchParams(location.search).has('snap');

export const prefersReducedMotion = () =>
  SNAP || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export { gsap, ScrollTrigger };
