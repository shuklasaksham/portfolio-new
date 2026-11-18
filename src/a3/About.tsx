import { useEffect, useRef, useState } from 'react';
import { about, resume } from './content';
import { ProfilePage, Socials } from './Profile';
import { useReveal } from './ui';

const SKILLS = resume.skills.flatMap(([, v]) => v.split(', '));
const SHOWN = 8;

function SideCard() {
  const [all, setAll] = useState(false);
  const shown = all ? SKILLS : SKILLS.slice(0, SHOWN);
  return (
    <aside className="pf__card" aria-label="Skills and details">
      <p className="pf__card-h">Skills and tools</p>
      <p className="pf__chips">
        {shown.map((s) => <span key={s} className="pf__chip">{s}</span>)}
        {!all && SKILLS.length > SHOWN && (
          <button type="button" className="pf__chip pf__chip--more" onClick={() => setAll(true)} aria-label={`Show ${SKILLS.length - SHOWN} more skills`}>
            +{SKILLS.length - SHOWN}
          </button>
        )}
      </p>
      <p className="pf__card-h">Details</p>
      <ul className="pf__details">
        {about.details.map(([k, v]) => <li key={k}><span className="sr-only">{k}: </span>{v}</li>)}
      </ul>
      <Socials />
    </aside>
  );
}

type Employment = (typeof about.employment)[number];

/** One role: title, dates, and a summary clamped to three lines with a "more" toggle. */
function Job({ e }: { e: Employment }) {
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(true);
  const text = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = text.current;
    if (el && !open) setLong(el.scrollHeight > el.clientHeight + 2);
  }, [open]);
  return (
    <article className="emp__job" data-rv>
      <h3>{e.role} | {e.company}</h3>
      <p className="emp__dates">{e.dates}</p>
      <p ref={text} className={`emp__text${open ? ' is-open' : ''}`}>{e.text}</p>
      {long && (
        <button type="button" className="emp__more" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'less' : 'more'}
        </button>
      )}
    </article>
  );
}

export default function About() {
  useReveal('about');
  return (
    <ProfilePage className="pf--about">
      <div className="pf__about">
        <div className="pf__meet">
          <p className="pf__meet-h">
            <img src="/img/portrait.webp" width={820} height={1025} alt="" />
            <span>Meet Saksham</span>
          </p>
          <h2 className="sr-only">About</h2>
          {about.bio.map((p) => <p key={p} className="pf__bio">{p}</p>)}
        </div>
        <SideCard />
      </div>

      <section className="emp" aria-labelledby="emp-title">
        <h2 id="emp-title" className="emp__h">Employment history</h2>
        {about.employment.map((e) => <Job key={e.role} e={e} />)}
      </section>

    </ProfilePage>
  );
}
