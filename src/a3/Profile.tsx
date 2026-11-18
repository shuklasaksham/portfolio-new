// Profile layout shared by the home tabs (Work, Posts, Reviews) and About:
// who I am and the reel on top, then tabs.
import { useEffect, useRef, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { home, profile, type Case, type Shot } from './content';
import { GmailIcon, InstagramIcon, LinkedInIcon, PinIcon, ResumeIcon } from './brand';
import { Accent, Img } from './ui';

const MAILTO = `mailto:${profile.email}`;

type StatDef = { value: number; label: string; pad?: number; decimals?: number; suffix?: string };
export const STATS: StatDef[] = [
  { value: 3, pad: 2, label: 'Projects' },
  { value: 4, pad: 2, label: 'Case studies' },
  { value: 4.5, decimals: 1, suffix: '+', label: 'Years' },
];
const show = (d: StatDef, v: number) =>
  (d.decimals ? v.toFixed(d.decimals) : String(Math.round(v)).padStart(d.pad ?? 1, '0')) + (d.suffix ?? '');

/**
 * Three numbers on a small dark card. The page arrives with the final values; after it
 * loads they count up once (skipped with reduced motion). Text is updated in place, so
 * hydration always matches.
 */
function Stats() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      STATS.forEach((d, i) => { const el = refs.current[i]; if (el) el.textContent = show(d, d.value * e); });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <dl className="pf__stats">
      {STATS.map((d, i) => (
        <div key={d.label} className="pf__stat">
          <dt>{d.label}</dt>
          <dd ref={(el) => { refs.current[i] = el; }}>{show(d, d.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

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
            <a className="pf__avail" href={MAILTO}>Open to work</a>
          </span>
        </div>
        <h1 className="pf__name">{profile.name}</h1>
        <p className="pf__tag">Product designer. I design and build.</p>
        <div className="pf__ctas">
          <a className="pf__btn" href={MAILTO}>Message</a>
        </div>
        <Stats />
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

/** A work tile: the project's cover image, linking to its case study. */
export function Tile({ c }: { c: Case }) {
  const t = c.tile;
  return (
    <Link to={`/work/${c.slug}`} className="wtile wtile--cover" data-rv>
      <img src={`/img/covers/${c.slug}.webp`} width={1200} height={900} loading="lazy" decoding="async" alt="" />
      <span className="sr-only">{c.name}: {c.title} {t.stat.n} {t.stat.label}.</span>
    </Link>
  );
}
