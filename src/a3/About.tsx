import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { about, home, resume } from './content';
import { ProfilePage, Socials } from './Profile';
import { Label, useReveal } from './ui';

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

      <section className="grid rows-sec">
        <h2 className="h-sec">A disagreement, resolved</h2>
        <article className="story" data-rv>
          <Label tone="accent">{about.disagreement.where}</Label>
          <h3>{about.disagreement.title}</h3>
          {about.disagreement.paragraphs.map((p) => <p key={p}>{p}</p>)}
          <Link to="/work/bang-olufsen" className="lbl story__link">Read the Bang &amp; Olufsen case study →</Link>
        </article>
      </section>

      <section className="grid rows-sec">
        <h2 className="h-sec">How I work</h2>
        <div className="habits">
          {home.principles.map(([k, t, d]) => (
            <div key={k} data-rv>
              <Label tone="accent">{k}</Label>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
          {about.habits.slice(0, 1).map(([where, t, d]) => (
            <div key={t} data-rv>
              <Label tone="accent">{where}</Label>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid rows-sec">
        <h2 className="h-sec">Education</h2>
        <div className="rows">
          <div className="rows__r" data-rv>
            <span className="lbl lbl--muted">{about.education[0]}</span>
            <span className="rows__main">{about.education[1]}</span>
            <span className="rows__muted rows__wide">{about.education[2]}</span>
          </div>
        </div>
      </section>
    </ProfilePage>
  );
}
