import { useRef } from 'react';
import { profile } from '../data/profile';
import { Footer, Label, useReveal } from './parts';

/** One-page ATS résumé; "Download PDF" prints just the document. */
export default function Resume() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div className="cf-page" ref={root}>
      <section className="cf-resume">
        <div className="cf-resume__head">
          <div>
            <Label data-in>Résumé</Label>
            <h1 className="cf-resume__title" data-in>One page. Every number checks out.</h1>
          </div>
          <div className="cf-resume__ctas" data-in>
            <button className="cf-btn cf-btn--solid" onClick={() => window.print()}>Download PDF</button>
            <a className="cf-btn" href={`mailto:${profile.email}`}>Email me</a>
          </div>
        </div>

        <article className="cf-doc" data-in>
          <header className="cf-doc__head">
            <h2>{profile.name}</h2>
            <p>{profile.headline}</p>
            <p className="cf-doc__contact">
              <span>{profile.location}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedinLabel}</a>
            </p>
          </header>
          <p>{profile.summary}</p>

          <h3>Experience</h3>
          {profile.experience.map((e) => (
            <section key={e.role + e.years} className="cf-doc__role">
              <p className="cf-doc__role-head">
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

          <h3>Skills</h3>
          {profile.skills.map(([k, v]) => (
            <p key={k} className="cf-doc__skill">
              <b>{k}:</b> {v.join(', ')}
            </p>
          ))}

          <h3>Education</h3>
          <p className="cf-doc__role-head">
            <b>{profile.education.degree}</b>
            <span>{profile.education.years}</span>
          </p>
          <p>{profile.education.school}</p>
        </article>
      </section>
      <Footer />
    </div>
  );
}
