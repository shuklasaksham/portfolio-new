import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { answer, SUGGESTIONS, type Answer } from './ask';
import { profile, TIER_TAG, type Shot, type Tier } from './content';

/* ---------- small pieces ---------- */

export const Label = ({ children, tone, as: As = 'p' }: { children: ReactNode; tone?: 'accent' | 'muted'; as?: 'p' | 'span' }) => (
  <As className={`lbl${tone ? ` lbl--${tone}` : ''}`}>{children}</As>
);

export const Tag = ({ tier }: { tier: Tier }) => <span className={`tag tag--${tier}`}>{TIER_TAG[tier]}</span>;

/** Title with the accent phrase set in Newsreader italic. */
export function Accent({ text, accent }: { text: string; accent: string }) {
  const i = text.lastIndexOf(accent);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em>{accent}</em>
      {text.slice(i + accent.length)}
    </>
  );
}

export const Img = ({ shot, className, eager }: { shot: Shot; className?: string; eager?: boolean }) => (
  <img
    className={className}
    src={shot.src}
    alt={shot.alt}
    width={shot.w}
    height={shot.h}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
  />
);

/** Instrument-style gauge used only in the HARMAN work. */
export function Gauge({ n, label, fill, size = 'md' }: { n: string; label: string; fill: number; size?: 'sm' | 'md' }) {
  const r = 52;
  const arc = 2 * Math.PI * r * 0.75;
  return (
    <div className={`gauge gauge--${size}`} role="img" aria-label={`${n} ${label}`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle className="gauge__track" cx="64" cy="64" r={r} strokeDasharray={`${arc} 999`} transform="rotate(135 64 64)" />
        <circle
          className="gauge__fill"
          cx="64"
          cy="64"
          r={r}
          style={{ ['--arc' as string]: arc, ['--to' as string]: arc * (1 - fill / 100) }}
          strokeDasharray={`${arc} 999`}
          transform="rotate(135 64 64)"
        />
      </svg>
      <span className="gauge__n">{n}</span>
      <span className="gauge__l">{label}</span>
    </div>
  );
}

/* ---------- reveal on scroll (respects reduced motion via CSS) ---------- */

export function useReveal(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-rv]:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/* ---------- Ask Saksham ---------- */

const AskCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useAsk = () => useContext(AskCtx);

type Msg = { q: string; a: Answer };

function AskPanel({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button, a[href], input');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    log.current?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  }, [msgs]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { q: t, a: answer(t) }]);
    setQ('');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
  };
  const asked = new Set(msgs.map((m) => m.q));

  return (
    <div className="ask" role="presentation">
      <div className="ask__scrim" onClick={onClose} />
      <div className="ask__panel" role="dialog" aria-modal="true" aria-labelledby="ask-title" ref={panel}>
        <span className="ask__grip" aria-hidden="true" />
        <header className="ask__head">
          <div>
            <h2 id="ask-title">Ask Saksham</h2>
            <Label tone="muted">AI assistant · answers from this site’s case studies</Label>
          </div>
          <button className="ask__close" onClick={onClose} aria-label="Close Ask Saksham">✕</button>
        </header>
        <div className="ask__body">
          <p className="ask__note">
            Optional. Answers only use what’s published here and link to the source case study. For anything else,{' '}
            <a href={`mailto:${profile.email}`}>email me</a>.
          </p>
          <div className="ask__log" ref={log} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className="ask__turn">
                <p className="ask__q">{m.q}</p>
                <div className="ask__a">
                  <p>{m.a.text}</p>
                  {'sources' in m.a ? (
                    m.a.sources.map((s) => (
                      <Link key={s.to} to={s.to} onClick={onClose} className="ask__src">
                        Source · {s.label} →
                      </Link>
                    ))
                  ) : (
                    <a className="ask__src" href={`mailto:${profile.email}`}>Email Saksham →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {SUGGESTIONS.some((s) => !asked.has(s)) && (
            <div className="ask__try">
              <Label tone="muted">Try asking</Label>
              {SUGGESTIONS.filter((s) => !asked.has(s)).map((s) => (
                <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>
        <form className="ask__form" onSubmit={submit}>
          <label className="sr-only" htmlFor="ask-input">Ask about my work</label>
          <input id="ask-input" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about my work…" autoComplete="off" />
          <button type="submit" aria-label="Send question">↑</button>
        </form>
      </div>
    </div>
  );
}

export function AskProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<Element | null>(null);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open);
    if (!open && opener.current instanceof HTMLElement) opener.current.focus();
  }, [open]);
  return (
    <AskCtx.Provider value={{ open: () => { opener.current = document.activeElement; setOpen(true); } }}>
      {children}
      {open && <AskPanel onClose={() => setOpen(false)} />}
    </AskCtx.Provider>
  );
}

export function AskButton({ className = '' }: { className?: string }) {
  const { open } = useAsk();
  return (
    <button className={`btn btn--line ${className}`} onClick={open}>
      <span className="dot" aria-hidden="true" /> Ask Saksham
    </button>
  );
}

/* ---------- header, menu, footer ---------- */

const NAV = [
  ['Work', '/'],
  ['About', '/about'],
  ['Résumé', '/resume'],
] as const;

function Menu({ onClose }: { onClose: () => void }) {
  const { open } = useAsk();
  const first = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('is-locked');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
    };
  }, [onClose]);
  return (
    <div className="menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="menu__top wrap">
        <Link to="/" className="hdr__name" onClick={onClose}>{profile.name}</Link>
        <button className="hdr__menu" onClick={onClose}>Close</button>
      </div>
      <nav className="menu__nav wrap" aria-label="Main">
        {NAV.map(([label, to], i) => (
          <Link key={to} to={to} onClick={onClose} ref={i === 0 ? first : undefined}>
            <span className="lbl">{String(i + 1).padStart(2, '0')}</span>
            {label}
          </Link>
        ))}
        <a href={`mailto:${profile.email}`}>
          <span className="lbl">04</span>Contact
        </a>
      </nav>
      <div className="menu__foot wrap">
        <button className="btn btn--line btn--block" onClick={() => { onClose(); open(); }}>
          <span className="dot" aria-hidden="true" /> Ask Saksham about the work
        </button>
        <Label tone="muted">Contact</Label>
        <a className="menu__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p className="lbl">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn →</a>
          <Link to="/resume" onClick={onClose}>Résumé PDF →</Link>
        </p>
        <Label tone="muted">{profile.location}</Label>
      </div>
    </div>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => setMenu(false), [location.pathname]);
  return (
    <header className="hdr">
      <div className="hdr__in wrap">
        <Link to="/" className="hdr__name">{profile.name}</Link>
        <span className="hdr__meta">Product designer</span>
        <span className="hdr__meta">{profile.location}</span>
        <nav className="hdr__nav" aria-label="Main">
          {NAV.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive || (to === '/' && location.pathname.startsWith('/work')) ? 'is-active' : '')}>
              {label}
            </NavLink>
          ))}
          <a href={`mailto:${profile.email}`}>Contact</a>
        </nav>
        <button className="hdr__menu" aria-expanded={menu} aria-controls="site-menu" onClick={() => setMenu(true)}>Menu</button>
      </div>
      {/* Portal: the header's backdrop-filter would otherwise contain the fixed overlay. */}
      {menu && createPortal(<Menu onClose={() => setMenu(false)} />, document.body)}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ftr wrap">
      <a className="ftr__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
      <p className="ftr__links lbl">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn →</a>
        <Link to="/resume">Résumé →</Link>
        <span>© 2026</span>
      </p>
    </footer>
  );
}
