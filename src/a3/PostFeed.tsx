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
  repost: 'M7 7h10l-2.5-2.5M17 7v4M17 17H7l2.5 2.5M7 17v-4',
  like: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z',
  save: 'M6.5 4.5h11v15L12 15.8l-5.5 3.7z',
  share: 'M12 15V4.5M8 8.2l4-3.7 4 3.7M5 13.5v4.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4.5',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
};

function PostCard({ p, i }: { p: Post; i: number }) {
  const text = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(false);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `${profile.site}/posts#${p.id}`;

  useEffect(() => {
    const el = text.current;
    if (el) setLong(el.scrollHeight > el.clientHeight + 2);
  }, []);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: p.title, url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* share sheet dismissed */ }
  };
  const tweet = `https://x.com/intent/post?text=${encodeURIComponent(`${p.title} — ${profile.name}`)}&url=${encodeURIComponent(url)}`;

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
          <a href={tweet} target="_blank" rel="noreferrer" aria-label="Repost on X" title="Repost"><Icon d={I.repost} /></a>
          <button type="button" className={liked ? 'is-liked' : ''} aria-pressed={liked} aria-label="Like" title="Like" onClick={() => setLiked((v) => !v)}>
            <Icon d={I.like} fill={liked ? 'currentColor' : 'none'} />
          </button>
          {p.slug && <Link to={`/work/${p.slug}`} className="sp__case">Case study <span aria-hidden="true">→</span></Link>}
          <span className="sp__end">
            <button type="button" className={saved ? 'is-saved' : ''} aria-pressed={saved} aria-label="Bookmark" title="Bookmark" onClick={() => setSaved((v) => !v)}>
              <Icon d={I.save} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button type="button" aria-label={copied ? 'Link copied' : 'Share'} title={copied ? 'Link copied' : 'Share'} onClick={share}><Icon d={I.share} /></button>
          </span>
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
