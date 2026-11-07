import { profile, resume } from './content';
import { Accent, Footer, Label } from './ui';

// Generated from this page's print styles by `npm run resume-pdf`; regenerate after editing the résumé.
const RESUME_PDF = '/Saksham-Shukla-Resume.pdf';

/** One-page ATS résumé with a downloadable PDF of the same content. */
const Roles = ({ roles }: { roles: typeof resume.roles }) => (
  <>
    {roles.map((r) => (
      <section key={r.role} className="doc__role">
        <p className="doc__rh"><b>{r.role}</b><span>{r.when}</span></p>
        <ul>{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </section>
    ))}
  </>
);

export default function Resume() {
  return (
    <div className="page resume">
      <section className="wrap grid rhead">
        <Label tone="muted">Résumé</Label>
        <dl className="meta rhead__meta">
          <div><dt className="lbl lbl--muted">Format</dt><dd>ATS-friendly · single column</dd></div>
          <div><dt className="lbl lbl--muted">Length</dt><dd>One page</dd></div>
          <div><dt className="lbl lbl--muted">Updated</dt><dd>2026</dd></div>
          <div><dt className="lbl lbl--muted">Prints</dt><dd>Clean A4 / Letter PDF</dd></div>
        </dl>
        <div className="rhead__main">
          <h1 className="h-case"><Accent text="One page. Every number checks out." accent="checks out." /></h1>
          <div className="hero__ctas">
            <a className="btn btn--solid" href={RESUME_PDF} download>Download PDF</a>
            <a className="btn btn--line" href={`mailto:${profile.email}`}>Email me</a>
          </div>
        </div>

        <article className="doc" aria-label="Résumé">
          <header>
            <h2>{profile.name}</h2>
            <p className="doc__hl">{resume.headline}</p>
            <p className="doc__contact">
              <span>{profile.location}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.linkedin}>{profile.linkedinLabel}</a>
            </p>
          </header>
          <p>{profile.summary}</p>
          <h3>Experience</h3>
          <Roles roles={resume.roles} />
          <h3>Independent products</h3>
          <Roles roles={resume.independent} />
          <h3>Skills</h3>
          {resume.skills.map(([k, v]) => <p key={k} className="doc__skill"><b>{k}:</b> {v}</p>)}
          <h3>Education</h3>
          <p>{resume.education}</p>
        </article>
      </section>
      <Footer />
    </div>
  );
}
