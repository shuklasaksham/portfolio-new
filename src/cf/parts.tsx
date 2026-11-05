import { useEffect, useState, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { useGo } from '../lib/transition';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { profile } from '../data/profile';

/** Internal link: swaps the route and returns to the top. */
export function CLink({ to, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode }) {
  const go = useGo();
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        go(to, { instant: true });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

const NAV: [string, string][] = [['Work', '/'], ['About', '/about'], ['Résumé', '/resume']];

export function Header() {
  const { pathname } = useLocation();
  const active = (to: string) => (to === '/' ? pathname === '/' || pathname.startsWith('/work') : pathname.startsWith(to));
  return (
    <header className="cf-header">
      <CLink to="/" className="cf-header__name">Saksham Shukla</CLink>
      <nav className="cf-nav" aria-label="Main">
        {NAV.map(([label, to]) => (
          <CLink key={to} to={to} className={active(to) ? 'is-active' : ''} aria-current={active(to) ? 'page' : undefined}>
            {label}
          </CLink>
        ))}
        <a href={`mailto:${profile.email}`}>Contact</a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="cf-footer">
      <a href={`mailto:${profile.email}`} className="cf-footer__mail">{profile.email}</a>
      <div className="cf-footer__links">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn →</a>
        <CLink to="/resume">Résumé →</CLink>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

export function Label({ children, className = '', ...rest }: HTMLAttributes<HTMLSpanElement> & { 'data-in'?: boolean }) {
  return (
    <span className={`cf-label ${className}`} {...rest}>
      {children}
    </span>
  );
}

/** Portrait; drop a photo at public/img/me.jpg to replace the placeholder. */
export function Portrait({ className = '' }: { className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`cf-portrait ${className}`}>
      {ok ? <img src="/img/me.jpg" alt="Saksham Shukla" onError={() => setOk(false)} /> : <span className="cf-label">Your portrait</span>}
    </div>
  );
}

/** Fade-up for [data-in] on load and [data-reveal] on scroll. */
export function useReveal(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-in]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expoOut', stagger: 0.07, delay: 0.05 });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((r) => {
        gsap.fromTo(r, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expoOut', scrollTrigger: { trigger: r, start: 'top 90%', once: true } });
      });
    }, el);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, ...deps]);
}
