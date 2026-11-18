// Profile layout shared by the home tabs (Work, Posts, Reviews) and About:
// who I am and the reel on top, then tabs.
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { home, profile, type Case, type Shot } from './content';
import { Accent, AskButton, Img } from './ui';

const MAILTO = `mailto:${profile.email}`;

export const STATS: [string, string][] = [
  ['03', 'Projects'],
  ['04', 'Case studies'],
  ['4.5+', 'Years'],
];

/* ---------- icons (inline, decorative) ---------- */
const Pin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" /></svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
);
const Doc = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M14 3v5h5M10 13h6M10 17h6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
);

export function Socials() {
  return (
    <span className="pf__icons">
      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="pf__icon"><LinkedIn /></a>
      <a href={MAILTO} aria-label="Email" className="pf__icon"><Mail /></a>
      <Link to="/resume" aria-label="Résumé" className="pf__icon"><Doc /></Link>
    </span>
  );
}

/** The reel plays muted on larger screens; on phones, with reduced motion or data saver it waits for a tap. */
function Reel() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 639px)').matches;
    if (saveData || calm) return;
    v.preload = 'auto';
    v.play().catch(() => {});
  }, []);
  return (
    <figure className="pf__reel">
      <video
        ref={ref}
        src="/video/reel.mp4"
        poster="/video/reel-poster.webp"
        muted
        loop
        playsInline
        controls
        preload="none"
        aria-label="20-second reel: tello.ai, Bang & Olufsen and Harman Kardon in-car audio, Bracket, DarpanAI and RelayOS"
      />
    </figure>
  );
}

export function ProfileHead() {
  return (
    <section className="pf__head wrap">
      <div className="pf__id">
        <div className="pf__who">
          <span className="pf__avatar">
            <img src="/img/portrait.webp" width={820} height={1025} alt="Saksham Shukla" />
            <i aria-hidden="true" />
          </span>
          <span className="pf__where">
            <span>Verizon · Hyderabad</span>
            <a className="pf__avail" href={MAILTO}>Available <span aria-hidden="true">›</span></a>
          </span>
        </div>
        <h1 className="pf__name">{profile.name}</h1>
        <p className="pf__tag">Product designer. I design and build.</p>
        <div className="pf__ctas">
          <a className="pf__btn" href={MAILTO}>Message</a>
          <AskButton className="pf__btn2" />
        </div>
        <dl className="pf__stats">
          {STATS.map(([n, l]) => (
            <div key={l}><dt>{l}</dt><dd>{n}</dd></div>
          ))}
        </dl>
      </div>
      <Reel />
    </section>
  );
}

const TABS = [
  ['Work', '/'],
  ['Posts', '/posts'],
  ['Reviews', '/reviews'],
  ['About', '/about'],
] as const;

export function ProfileTabs() {
  return (
    <div className="pf__bar wrap">
      <nav className="pf__tabs" aria-label="Profile">
        {TABS.map(([label, to]) => (
          <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>{label}</NavLink>
        ))}
      </nav>
      <span className="pf__meta">
        <span className="pf__loc"><Pin /> {profile.location}</span>
        <Socials />
      </span>
    </div>
  );
}

export function ProfilePage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`page pf ${className}`}>
      <ProfileHead />
      <ProfileTabs />
      <div className="pf__body wrap">{children}</div>
    </div>
  );
}

/* ---------- work tile ---------- */

function TileMedia({ c }: { c: Case }) {
  if (c.slug === 'tello' || c.slug === 'darpan') {
    const shots: Shot[] = home.cards[c.slug];
    return (
      <span className={`tile__media tile__media--phones n${shots.length}`} aria-hidden="true">
        {shots.map((s) => <Img key={s.src} shot={{ ...s, alt: '' }} />)}
      </span>
    );
  }
  if ('wide' in c.cover) {
    return (
      <span className="tile__media tile__media--wide" aria-hidden="true">
        <Img shot={{ ...c.cover.wide, alt: '' }} />
      </span>
    );
  }
  return null;
}

/** A work tile: what it is, one sourced result, status and one proof point, then the work. */
export function Tile({ c }: { c: Case }) {
  const t = c.tile;
  return (
    <Link to={`/work/${c.slug}`} className="wtile" data-rv>
      <span className="wtile__head">
        <span className="wtile__eyebrow">{t.eyebrow}</span>
        <span className="wtile__stat"><b>{t.stat.n}</b><span>{t.stat.label}</span></span>
      </span>
      <h3 className="wtile__title"><Accent text={c.title} accent={c.accent} /></h3>
      <span className="wtile__pills">
        {t.pills.map((x) => <span key={x.text} className={`xpill xpill--${x.tone}`}>{x.text}</span>)}
      </span>
      <span className="wtile__role">{t.role}</span>
      <TileMedia c={c} />
    </Link>
  );
}
