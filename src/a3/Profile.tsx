// Profile layout shared by the home tabs (Work, Posts, Reviews) and About:
// who I am and the reel on top, then tabs.
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { home, profile, type Case, type Shot } from './content';
import { GmailIcon, InstagramIcon, LinkedInIcon, PinIcon, ResumeIcon } from './brand';
import { Accent, Img } from './ui';

const MAILTO = `mailto:${profile.email}`;

export const STATS: [string, string][] = [
  ['03', 'Projects'],
  ['04', 'Case studies'],
  ['4.5+', 'Years'],
];

export function Socials() {
  return (
    <span className="pf__icons">
      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="pf__icon pf__icon--li"><LinkedInIcon /></a>
      <a href={profile.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="pf__icon pf__icon--ig"><InstagramIcon /></a>
      <a href={MAILTO} aria-label="Email" className="pf__icon pf__icon--mail"><GmailIcon /></a>
      <Link to="/resume" aria-label="Résumé" className="pf__icon pf__icon--cv"><ResumeIcon /></Link>
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
            <a className="pf__avail" href={MAILTO}>Open to work <span aria-hidden="true">›</span></a>
          </span>
        </div>
        <h1 className="pf__name">{profile.name}</h1>
        <p className="pf__tag">Product designer. I design and build.</p>
        <div className="pf__ctas">
          <a className="pf__btn" href={MAILTO}>Message</a>
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
        <span className="pf__loc"><PinIcon /> {profile.location}</span>
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
    const shots: Shot[] = home.cards[c.slug].slice(0, 3);
    return (
      <span className="tile__media tile__media--phones" aria-hidden="true">
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

/** A work tile: the work on top; below it the company, the title and one sourced result. */
export function Tile({ c }: { c: Case }) {
  const t = c.tile;
  return (
    <Link to={`/work/${c.slug}`} className="wtile" data-rv>
      <TileMedia c={c} />
      <span className="wtile__body">
        <span className="wtile__meta">{t.eyebrow}</span>
        <span className="wtile__row">
          <h3 className="wtile__title"><Accent text={c.title} accent={c.accent} /></h3>
          <span className="wtile__stat"><b>{t.stat.n}</b><span>{t.stat.label}</span></span>
        </span>
      </span>
    </Link>
  );
}
