import { useRef } from 'react';
import { profile } from '../data/profile';
import { about } from './content';
import { Photo, SiteFooter, SLink } from './parts';
import { useSiteMotion } from './useSiteMotion';

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);
  useSiteMotion(root);
  const [l1, l2, l3] = about.quote;

  return (
    <div className="s-page s-page--light" ref={root}>
      <section className="s-about-hero">
        <div className="s-about-hero__band" />
        <h1 className="s-about-hero__quote">
          <span data-in>{l1}</span>
          <span data-in>{l2}</span>
          <span className="c-coral" data-in>{l3}</span>
        </h1>
        <div className="s-about-hero__photo" data-in>
          <Photo />
        </div>
      </section>

      <section className="s-about-body">
        {about.intro.map((p) => (
          <p key={p} data-reveal>{p}</p>
        ))}

        <h2 data-reveal>What I bring</h2>
        <ul data-reveal>
          {profile.pillars.map((p) => (
            <li key={p.title}>
              <b>{p.title}.</b> {p.text}
            </li>
          ))}
        </ul>

        <h2 data-reveal>How I work</h2>
        <ul data-reveal>
          {profile.habits.map(([title, text, where]) => (
            <li key={title}>
              <b>{title}.</b> {text} <span className="s-about-body__src">({where})</span>
            </li>
          ))}
        </ul>

        <h2 data-reveal>Brands I’ve designed for</h2>
        <p data-reveal>{profile.brands.join(' · ')}</p>

        <h2 data-reveal>Education</h2>
        <p data-reveal>
          {profile.education.degree} — {profile.education.school} ({profile.education.years.replace(' – ', '–')})
        </p>

        <p className="s-about-body__closing" data-reveal>{about.closing}</p>
        <div className="s-about-body__cta" data-reveal>
          <a href={`mailto:${profile.email}`} className="s-pill s-pill--dark">{profile.email}</a>
          <SLink to="/resume" className="s-pill s-pill--dark">View Résumé</SLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
