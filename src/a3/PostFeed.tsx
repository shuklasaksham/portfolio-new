// Posts tab: a social-style feed. Avatar, name, text clamped with "Show more",
// one image, and an action row. No invented times, views or counts.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { profile } from './content';
import { posts, type Post } from './posts';
import { Img } from './ui';

const MAILTO = 'mailto:shuklasaksham01@gmail.com';
const isPhone = (p: Post) => p.shot.h > p.shot.w * 1.4;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "16 Nov 2026", fixed so server and browser render the same text. */
const fmtDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

const Icon = ({ d, fill = 'none' }: { d: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={d} fill={fill} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = {
  reply: 'M4.5 12a7.5 7.5 0 1 1 3.4 6.3L4 19.5l1.2-3.6A7.4 7.4 0 0 1 4.5 12z',
  like: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z',
  share: 'M12 15V4.5M8 8.2l4-3.7 4 3.7M5 13.5v4.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4.5',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
  mail: 'M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
};

const BRAND = {
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
};
const Brand = ({ d, color }: { d: string; color: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={d} fill={color} /></svg>
);

/** The site's own share menu: copy link, LinkedIn, X, WhatsApp and email. */
function ShareMenu({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(`${title} — ${profile.name}`);
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <Brand d={BRAND.linkedin} color="#0A66C2" /> },
    { label: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}`, icon: <Brand d={BRAND.x} color="#0f1419" /> },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, icon: <Brand d={BRAND.whatsapp} color="#25D366" /> },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(title)}&body=${t}%0A${u}`, icon: <Icon d={I.mail} /> },
  ];

  return (
    <span className="sm" ref={root}>
      <button type="button" className={open ? 'is-open' : ''} aria-haspopup="menu" aria-expanded={open} aria-label="Share" title="Share" onClick={() => setOpen((o) => !o)}>
        <Icon d={I.share} />
      </button>
      {open && (
        <span className="sm__menu" role="menu" aria-label="Share this post">
          <span className="sm__h">Share this post</span>
          <button type="button" role="menuitem" className="sm__item" onClick={copy}>
            <span className="sm__ic">{copied ? <Icon d={I.check} /> : <Icon d={I.link} />}</span>
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          {links.map((l) => (
            <a key={l.label} role="menuitem" className="sm__item" href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" onClick={() => setOpen(false)}>
              <span className="sm__ic">{l.icon}</span>{l.label}
            </a>
          ))}
        </span>
      )}
    </span>
  );
}

function PostCard({ p, i }: { p: Post; i: number }) {
  const text = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(false);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const url = `${profile.site}/posts#${p.id}`;

  useEffect(() => {
    const el = text.current;
    if (el) setLong(el.scrollHeight > el.clientHeight + 2);
  }, []);


  return (
    <article className="sp" id={p.id} style={{ order: i }}>
      <img className="sp__avatar" src="/img/portrait.webp" width={40} height={40} alt="" />
      <div className="sp__main">
        <header className="sp__head">
          <b>{profile.name}</b>
          <span className="sp__dot" aria-hidden="true">·</span>
          <time className="sp__date" dateTime={p.date}>{fmtDate(p.date)}</time>
          <span className="sp__more" aria-hidden="true"><Icon d={I.more} /></span>
        </header>

        <div ref={text} className={`sp__text${open ? ' is-open' : ''}`}>
          {p.body.split('\n\n').map((para, i) => (
            <p key={i}>{para.split('\n').map((line, j) => <span key={j}>{line}</span>)}</p>
          ))}
        </div>
        {long && (
          <button type="button" className="sp__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? 'Show less' : 'Show more'}
          </button>
        )}

        {p.video ? (
          <div className="sp__media sp__media--video">
            <video src={p.video} poster={p.shot.src} width={p.shot.w} height={p.shot.h} controls playsInline preload="none" aria-label={p.shot.alt} />
          </div>
        ) : (
          <a className={`sp__media${isPhone(p) ? ' sp__media--phone' : ''}`} href={p.shot.src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${p.shot.alt}`}>
            <Img shot={p.shot} />
          </a>
        )}

        <footer className="sp__actions">
          <a href={`${MAILTO}?subject=${encodeURIComponent(`Re: ${p.title}`)}`} aria-label="Reply by email" title="Reply"><Icon d={I.reply} /></a>
          <button type="button" className={liked ? 'is-liked' : ''} aria-pressed={liked} aria-label="Like" title="Like" onClick={() => setLiked((v) => !v)}>
            <Icon d={I.like} fill={liked ? 'currentColor' : 'none'} />
          </button>
          {p.slug && <Link to={`/work/${p.slug}`} className="sp__case">Case study <span aria-hidden="true">→</span></Link>}
          <span className="sp__end"><ShareMenu title={p.title} url={url} /></span>
        </footer>
      </div>
    </article>
  );
}

export function Posts() {
  return (
    <>
      <h2 className="sr-only">Posts</h2>
      <div className="spfeed">
        {[0, 1].map((col) => (
          <div key={col} className="spfeed__col">
            {posts.map((p, i) => i % 2 === col && <PostCard key={p.id} p={p} i={i} />)}
          </div>
        ))}
      </div>
    </>
  );
}
