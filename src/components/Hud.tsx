import { forwardRef, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TLink } from './Link';
import { Magnetic } from './Magnetic';
import { useUI } from '../lib/ui';
import { useSound } from '../lib/sound';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useLayout } from '../lib/layout';

/** Label/Mono component: 6px lime dot + Mono/Label text. */
export function LabelMono({ text, dot = true, className = '', color = 'c-muted' }: { text: string; dot?: boolean; className?: string; color?: string }) {
  return (
    <span className={`label-mono ${className}`}>
      {dot && <i className="dot" />}
      <span className={`t-label ${color}`}>{text}</span>
    </span>
  );
}

/** HUD/Top bar (Figma 34:58): fixed at 40, 32 — 1360 × 44. */
export function TopBar() {
  const { menuOpen, setMenuOpen, entered } = useUI();
  const { on, toggle, tick } = useSound();
  const layout = useLayout();
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!entered || !ref.current || prefersReducedMotion()) return;
    gsap.fromTo(ref.current.children, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expoOut', delay: 0.2 });
  }, [entered]);

  // Hide while scrolling down long pages, return on scroll up.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      ref.current?.classList.toggle('is-hidden', y > last && y > 120 && !menuOpen);
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [menuOpen, pathname]);

  return (
    <header className={`topbar ${layout}`} ref={ref}>
      <TLink to="/" label="Home" className="brand">
        <span className="brand__mono t-data">SS</span>
        <span className="brand__name">
          <span className="t-name">Saksham Shukla</span>
          {layout === 'desktop' && <span className="t-label c-muted">Product Designer</span>}
        </span>
      </TLink>
      {layout === 'desktop' && <LabelMono text="Portfolio — 2026 edition" />}
      <div className="controls">
        {layout === 'desktop' && (
          <Magnetic>
            <button className={`sound ${on ? 'is-on' : ''}`} aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'} data-cursor="hover" onClick={() => toggle()}>
              {[6, 12, 8, 14, 5].map((h, i) => (
                <i key={i} style={{ height: h, animationDelay: `${i * 80}ms` }} />
              ))}
            </button>
          </Magnetic>
        )}
        <Magnetic>
          <button
            className={`menu-button ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            data-cursor="hover"
            onMouseEnter={tick}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-button__label t-label">
              <span>Menu</span>
              <span>Close</span>
            </span>
            <span className="menu-button__icon">
              <i />
              <i />
            </span>
          </button>
        </Magnetic>
      </div>
    </header>
  );
}

type BottomProps = { hint: string; index: number; total?: number; readout?: string };

/** HUD/Bottom bar (Figma 34:80): hint · progress segments · readout. */
export const BottomBar = forwardRef<HTMLSpanElement, BottomProps>(function BottomBar({ hint, index, total = 5, readout = 'X 0.000  Y 0.000  ·  60 FPS' }, readoutRef) {
  return (
    <div className="bottombar">
      <div className="bottombar__hint">
        <span className="mouse">
          <i />
        </span>
        <span className="t-label c-muted">{hint}</span>
      </div>
      <div className="bottombar__progress">
        <span className="t-data">{String(index).padStart(2, '0')}</span>
        <span className="track">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i === Math.min(index, 5) - 1 ? 'is-on' : ''} />
          ))}
        </span>
        <span className="t-data c-faint">{String(total).padStart(2, '0')}</span>
      </div>
      <span className="t-data c-faint bottombar__readout" ref={readoutRef}>
        {readout}
      </span>
    </div>
  );
});
