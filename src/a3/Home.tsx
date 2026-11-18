import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { cases, type Case } from './content';
import { ProfilePage, Tile } from './Profile';
import { Img, useReveal } from './ui';
import { WorkModal } from './WorkModal';
import { posts } from './posts';

const bySlug = (s: string) => cases.find((c) => c.slug === s)!;

// Shipped company work first, then my own products and concepts.
const ORDER = ['tello', 'bang-olufsen', 'harman-kardon', 'plug', 'bracket', 'darpan', 'relayos'];

const isPhone = (w: number, h: number) => h > w * 1.4;

function Posts() {
  return (
    <>
      <h2 className="sr-only">Posts</h2>
      <div className="posts">
        {posts.map((p) => (
          <article key={p.id} id={p.id} className="post" data-rv>
            <a
              className={`post__media${isPhone(p.shot.w, p.shot.h) ? ' post__media--phone' : ''}`}
              href={p.shot.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full size: ${p.shot.alt}`}
            >
              <Img shot={p.shot} />
            </a>
            <div className="post__body">
              <p className="post__meta"><span>{p.project}</span><span aria-hidden="true">·</span><span>{p.topic}</span></p>
              <h3 className="post__title">{p.title}</h3>
              {p.body.map((t) => <p key={t} className="post__text">{t}</p>)}
              <Link className="post__link" to={`/work/${p.slug}`}>Read the case study <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="pf__empty">
      <p className="pf__empty-t">{title}</p>
      <p>{text}</p>
    </div>
  );
}

export default function Home({ tab = 'work' }: { tab?: 'work' | 'posts' | 'reviews' }) {
  useReveal(tab);
  const [open, setOpen] = useState<Case | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <ProfilePage className={`pf--${tab}`}>
      {tab === 'work' && (
        <>
          <h2 className="sr-only">Work</h2>
          <div className="wgrid">
            {ORDER.map((s) => <Tile key={s} c={bySlug(s)} onOpen={setOpen} />)}
          </div>
          {open && <WorkModal c={open} onClose={close} />}
        </>
      )}
      {tab === 'posts' && <Posts />}
      {tab === 'reviews' && <Empty title="No reviews yet" text="Reviews will appear here." />}
    </ProfilePage>
  );
}
