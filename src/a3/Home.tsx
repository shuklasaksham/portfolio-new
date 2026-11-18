import { useCallback, useState } from 'react';
import { cases, type Case } from './content';
import { ProfilePage, Tile } from './Profile';
import { useReveal } from './ui';
import { WorkModal } from './WorkModal';
import { Posts } from './PostFeed';

const bySlug = (s: string) => cases.find((c) => c.slug === s)!;

// Shipped company work first, then my own products and concepts.
const ORDER = ['tello', 'bang-olufsen', 'harman-kardon', 'plug', 'bracket', 'darpan', 'relayos'];

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
