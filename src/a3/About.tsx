import { Link } from 'react-router-dom';
import { about, cases, profile } from './content';
import { Accent, Footer, Label, useReveal } from './ui';

export default function About() {
  useReveal();
  return (
    <div className="page about">
      <section className="wrap grid ahead">
        <Label tone="muted">About</Label>
        <aside className="ahead__side">
          <img className="portrait" src="/img/portrait.webp" width={820} height={1025} alt="Saksham Shukla speaking on stage" />
          <dl className="meta">
            <div><dt className="lbl lbl--muted">Based</dt><dd>{profile.location}</dd></div>
            <div><dt className="lbl lbl--muted">Experience</dt><dd>4.5+ years</dd></div>
            <div><dt className="lbl lbl--muted">Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
            <div><dt className="lbl lbl--muted">LinkedIn</dt><dd><a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedinLabel}</a></dd></div>
          </dl>
        </aside>
        <div className="ahead__main">
          <h1 className="h-case"><Accent text={about.title} accent={about.accent} /></h1>
          {about.paragraphs.map((p) => <p key={p} className="ahead__p">{p}</p>)}
        </div>
      </section>

      <section className="wrap grid rows-sec">
        <h2 className="h-sec">Experience</h2>
        <div className="rows">
          {about.experience.map(([when, role, co, place]) => (
            <div key={when} className="rows__r" data-rv>
              <span className="lbl lbl--muted">{when}</span>
              <span className="rows__main">{role}</span>
              <span>{co}</span>
              <span className="rows__muted">{place}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap grid rows-sec">
        <h2 className="h-sec">Independent work</h2>
        <div className="rows">
          {about.independent.map(([slug, line, status]) => {
            const c = cases.find((x) => x.slug === slug)!;
            return (
              <Link key={slug} to={`/work/${slug}`} className="rows__r rows__r--link" data-rv>
                <span className="rows__main">{c.name}</span>
                <span>{line}</span>
                <span className="rows__muted">{status} →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap grid rows-sec">
        <h2 className="h-sec">A disagreement, resolved</h2>
        <article className="story" data-rv>
          <Label tone="accent">{about.disagreement.where}</Label>
          <h3>{about.disagreement.title}</h3>
          {about.disagreement.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </article>
      </section>

      <section className="wrap grid rows-sec">
        <h2 className="h-sec">How I work</h2>
        <div className="habits">
          {about.habits.map(([where, t, d]) => (
            <div key={t} data-rv>
              <Label tone="accent">{where}</Label>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap grid rows-sec">
        <h2 className="h-sec">Education</h2>
        <div className="rows">
          <div className="rows__r" data-rv>
            <span className="lbl lbl--muted">{about.education[0]}</span>
            <span className="rows__main">{about.education[1]}</span>
            <span className="rows__muted rows__wide">{about.education[2]}</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
