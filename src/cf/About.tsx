import { useRef } from 'react';
import { profile } from '../data/profile';
import { work } from './work';
import { CLink, Footer, Label, Portrait, useReveal } from './parts';

const INDEPENDENT = ['bracket', 'darpan', 'relayos'];

export default function About() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div className="cf-page" ref={root}>
      <section className="cf-about">
        <div className="cf-about__main">
          <Label data-in>About</Label>
          <h1 className="cf-about__title" data-in>
            I care about why it matters, how it’s <em>built</em>, and whether it <em>ships</em>.
          </h1>
          <div className="cf-about__copy" data-in>
            <p>{profile.summary}</p>
            <p>
              At Verizon I design agentic AI that is judged by conversion. At HARMAN I designed in-car experiences for Harman Kardon,
              Hyundai and Bang & Olufsen — work that has to hold up at arm’s length, across five displays, in a moving car.
            </p>
            <p>
              On my own I build AI products end to end: Bracket is live with 148 users, DarpanAI is an AI video director for everyday
              creators, and RelayOS is a voice-AI concept for Indian manufacturers.
            </p>
          </div>
        </div>
        <div className="cf-about__side" data-in>
          <Portrait />
          <Label>{profile.location}</Label>
        </div>
      </section>

      <section className="cf-table-sec">
        <h2 className="cf-h2" data-reveal>Experience</h2>
        <div className="cf-table">
          {profile.experience
            .filter((e) => !INDEPENDENT.includes(e.slug))
            .map((e) => (
              <div key={e.role + e.years} className="cf-table__row" data-reveal>
                <span className="cf-label">{e.years}</span>
                <span className="cf-table__main">{e.role}</span>
                <span>{e.company}</span>
                <span className="cf-table__muted">{e.place}</span>
              </div>
            ))}
        </div>
      </section>

      <section className="cf-table-sec">
        <h2 className="cf-h2" data-reveal>Independent work</h2>
        <div className="cf-table">
          {work
            .filter((w) => INDEPENDENT.includes(w.slug))
            .map((w) => (
              <CLink key={w.slug} to={`/work/${w.slug}`} className="cf-table__row" data-reveal>
                <span className="cf-label">{w.context}</span>
                <span className="cf-table__main">{w.name}</span>
                <span>{w.line}</span>
                <span className="cf-table__muted">Read →</span>
              </CLink>
            ))}
        </div>
      </section>

      <section className="cf-table-sec">
        <h2 className="cf-h2" data-reveal>How I work</h2>
        <div className="cf-table">
          {profile.habits.map(([t, s, where]) => (
            <div key={t} className="cf-table__row cf-table__row--habit" data-reveal>
              <span className="cf-table__main">{t}</span>
              <span>{s}</span>
              <span className="cf-table__muted">{where}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cf-table-sec">
        <h2 className="cf-h2" data-reveal>Education</h2>
        <div className="cf-table">
          <div className="cf-table__row" data-reveal>
            <span className="cf-label">{profile.education.years}</span>
            <span className="cf-table__main">{profile.education.degree}</span>
            <span>{profile.education.school}</span>
            <span />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
