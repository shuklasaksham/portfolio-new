import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap, EASE_IN_OUT, prefersReducedMotion } from './motion';
import { scrollToTop } from './scroll';

type Go = (to: string, opts?: { label?: string; instant?: boolean }) => void;
const Ctx = createContext<{ go: Go; busy: () => boolean }>({ go: () => {}, busy: () => false });

// Page transition: three layers sweep up over the page (like a stack assembling),
// the route swaps underneath, then the layers continue up and off-screen.
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const busyRef = useRef(false);

  const go: Go = useCallback((to, opts = {}) => {
    if (busyRef.current) return;
    if (to === location.pathname) { scrollToTop(false); return; }
    const panels = gsap.utils.toArray<HTMLElement>('.t-panel');
    const label = document.querySelector<HTMLElement>('.t-overlay__label');
    if (opts.instant || prefersReducedMotion() || !panels.length) {
      navigate(to); scrollToTop(); return;
    }
    busyRef.current = true;
    if (label) label.textContent = opts.label ?? '';
    const tl = gsap.timeline({ onComplete: () => { busyRef.current = false; } });
    tl.set(panels, { yPercent: 105, display: 'block' })
      .to(panels, { yPercent: 0, duration: 0.75, ease: EASE_IN_OUT, stagger: 0.07 })
      .fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.35')
      .add(() => { navigate(to); scrollToTop(); })
      .to(label, { opacity: 0, y: -16, duration: 0.3 }, '+=0.15')
      .to(panels, { yPercent: -105, duration: 0.8, ease: EASE_IN_OUT, stagger: { each: 0.06, from: 'end' } }, '<0.05')
      .set(panels, { display: 'none' });
  }, [navigate, location.pathname]);

  return <Ctx.Provider value={{ go, busy: () => busyRef.current }}>{children}</Ctx.Provider>;
}

export const useGo = () => useContext(Ctx).go;

export function TransitionOverlay() {
  return (
    <div className="t-overlay" aria-hidden>
      <div className="t-panel t-panel--1" />
      <div className="t-panel t-panel--2" />
      <div className="t-panel t-panel--3">
        <span className="t-overlay__label" />
      </div>
    </div>
  );
}
