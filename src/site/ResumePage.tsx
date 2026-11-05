import { useRef } from 'react';
import { profile } from '../data/profile';
import { resumeQuote } from './content';
import { SiteFooter } from './parts';
import { useSiteMotion } from './useSiteMotion';

/** Single-page ATS résumé rendered as a document; prints cleanly to PDF. */
function ResumeDoc() {
  return (
    <article className="s-doc">
      <h2 className="s-doc__name">{profile.name}</h2>
      <p className="s-doc__contact">
        <span>{profile.location}</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedinLabel}</a>
      </p>
      <p className="s-doc__bar">{profile.headline}</p>
      <p>{profile.summary}</p>

      <h3 className="s-doc__h">Experience</h3>
      {profile.experience.map((e) => (
        <section key={e.role + e.years} className="s-doc__role">
          <p className="s-doc__role-head">
            <b>{e.role} · {e.company}</b>
            <span>{e.years} · {e.place}</span>
          </p>
          <ul>
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      ))}

      <h3 className="s-doc__h">Skills</h3>
      {profile.skills.map(([k, v]) => (
        <p key={k} className="s-doc__skill">
          <b>{k}:</b> {v.join(', ')}
        </p>
      ))}

      <h3 className="s-doc__h">Education</h3>
      <p className="s-doc__role-head">
        <b>{profile.education.degree}</b>
        <span>{profile.education.years}</span>
      </p>
      <p>{profile.education.school}</p>
    </article>
  );
}

export default function ResumePage() {
  const root = useRef<HTMLDivElement>(null);
  useSiteMotion(root);
  return (
    <div className="s-page s-page--light" ref={root}>
      <section className="s-resume">
        <h1 className="s-resume__quote" data-in>
          {resumeQuote.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </h1>
        <div className="s-resume__grid">
          <div data-in>
            <ResumeDoc />
          </div>
          <aside className="s-resume__aside" data-in>
            <p className="s-resume__note">
              One page.
              <br />
              Every number checks out.
            </p>
            <span className="s-resume__label">ATS-friendly résumé</span>
            <button className="s-pill s-pill--dark" onClick={() => window.print()}>Download PDF</button>
            <a className="s-pill s-pill--dark" href={`mailto:${profile.email}`}>Email me</a>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
