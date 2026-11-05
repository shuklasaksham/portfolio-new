import { useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGo } from '../lib/transition';
import { profile } from '../data/profile';
import { brands, type Cover, type Featured } from './content';

/** Plain internal link: swaps the route and returns to the top, no transition sweep. */
export function SLink({ to, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children: ReactNode }) {
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

const NAV_LEFT: [string, string][] = [['Work', '/'], ['Side projects', '/side-projects']];
const NAV_RIGHT: [string, string][] = [['About me', '/about'], ['Résumé', '/resume']];

export function SiteHeader() {
  const { pathname } = useLocation();
  const active = (to: string) => (to === '/' ? pathname === '/' || pathname.startsWith('/work') : pathname.startsWith(to));
  const link = ([label, to]: [string, string]) => (
    <SLink key={to} to={to} className={`s-nav__link ${active(to) ? 'is-active' : ''}`} aria-current={active(to) ? 'page' : undefined}>
      {label}
    </SLink>
  );
  return (
    <header className="s-header">
      <nav className="s-nav" aria-label="Main">
        <div className="s-nav__group">{NAV_LEFT.map(link)}</div>
        <div className="s-nav__group">{NAV_RIGHT.map(link)}</div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="s-footer">
      <div className="s-footer__icons">
        <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M5.3 8.6H2V22h3.3V8.6ZM3.6 2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM22 14.4c0-3.6-.8-6.1-5-6.1-2 0-3.3.7-3.9 1.8V8.6H10V22h3.3v-6.6c0-1.8.3-3.4 2.5-3.4s2.2 2 2.2 3.5V22H22v-7.6Z" />
          </svg>
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 6 8.5 7 8.5-7" />
          </svg>
        </a>
      </div>
      <p className="s-footer__copy">© 2026 Designed by Saksham Shukla</p>
    </footer>
  );
}

/** Coral line-art ornaments. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M50 4v132M6 70h88" strokeWidth="1.6" />
      <path d="M50 34c3 26 10 33 34 36-24 3-31 10-34 36-3-26-10-33-34-36 24-3 31-10 34-36Z" fill="currentColor" />
    </svg>
  );
}

export function Burst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45} 60 60)`}>
          <path d="M60 46V8" />
          <path d="m52 16 8-9 8 9" />
        </g>
      ))}
    </svg>
  );
}

export function Sunburst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 140" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x="64" y="8" width="12" height="40" rx="2" fill="currentColor" transform={`rotate(${(i * 360) / 14} 70 70)`} />
      ))}
    </svg>
  );
}

export function Swoosh({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden>
      <path d="M3 13C34 5 80 3 117 9" />
    </svg>
  );
}

export function DrawnArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 22c26-10 58-12 92-4" />
      <path d="m80 7 15 11-17 9" />
    </svg>
  );
}

/** Portrait; drop a photo at public/img/me.jpg and it replaces the monogram. */
export function Photo({ className = '' }: { className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`s-photo ${className}`}>
      {ok ? (
        <img src="/img/me.jpg" alt="Saksham Shukla" onError={() => setOk(false)} />
      ) : (
        <div className="s-photo__ph" role="img" aria-label="Saksham Shukla">
          <span>SS</span>
          {import.meta.env.DEV && <small>Add your photo at public/img/me.jpg</small>}
        </div>
      )}
    </div>
  );
}

/** Branded thumbnail: pastel card, brand line, headline number and real screens. */
export function ProjectCover({ cover }: { cover: Cover }) {
  return (
    <div className={`s-cover s-cover--${cover.kind}`} style={{ background: cover.bg }}>
      <span className="s-cover__brand">{cover.brand}</span>
      <span className="s-cover__metric">{cover.metric}</span>
      <span className="s-cover__caption">{cover.caption}</span>
      <div className="s-cover__shots">
        {cover.shots.map((src, i) => (
          <img key={src} src={src} alt="" loading="lazy" style={{ zIndex: cover.shots.length - i }} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedRow({ p }: { p: Featured }) {
  const to = `/work/${p.slug}`;
  return (
    <article className="s-row" data-reveal>
      <div className="s-row__text">
        <h3 className="s-row__title">
          {p.title[0]}
          <br />
          <span className="c-coral">{p.title[1]}</span>
        </h3>
        <p className="s-row__desc">{p.desc}</p>
        <SLink to={to} className="s-pill">View case study</SLink>
      </div>
      <SLink to={to} className="s-row__img" aria-label={`${p.title.join(' ')} case study`}>
        <ProjectCover cover={p.cover} />
      </SLink>
    </article>
  );
}

export function BrandStrip() {
  const row = [...brands, ...brands];
  return (
    <div className="s-strip" aria-label={`Brands: ${brands.join(', ')}`}>
      <div className="s-strip__track">
        {[0, 1].map((k) => (
          <div key={k} className="s-strip__set" aria-hidden={k === 1}>
            {row.map((b, i) => (
              <span key={i}>
                {b}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
