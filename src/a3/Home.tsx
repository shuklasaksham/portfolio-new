import { Link } from 'react-router-dom';
import { cases, home, profile, type Case, type Shot } from './content';
import { jumpTo } from './scroll';
import { Accent, AskButton, Footer, Img, Label, useReveal } from './ui';

const bySlug = (s: string) => cases.find((c) => c.slug === s)!;

function Media({ c }: { c: Case }) {
  if (c.slug === 'tello' || c.slug === 'darpan') {
    const shots: Shot[] = home.cards[c.slug];
    return (
      <div className={`xcard__media xcard__media--phones n${shots.length}`} aria-hidden="true">
        {shots.map((s) => <Img key={s.src} shot={{ ...s, alt: '' }} />)}
      </div>
    );
  }
  if ('wide' in c.cover) {
    return (
      <div className="xcard__media xcard__media--wide" aria-hidden="true">
        <Img shot={{ ...c.cover.wide, alt: '' }} />
      </div>
    );
  }
  return null;
}

/** Work card, ordered for a recruiter's first scan: what it is, the result, the status, the role, then the work. */
function Card({ c, big }: { c: Case; big?: boolean }) {
  const t = c.tile;
  return (
    <Link to={`/work/${c.slug}`} className={`xcard${big ? ' xcard--big' : ''}`} data-rv>
      <div className="xcard__text">
        <div className="xcard__head">
          <p className="xcard__eyebrow">{t.eyebrow}</p>
          <p className="xcard__stat"><b>{t.stat.n}</b><span>{t.stat.label}</span></p>
        </div>
        <h3 className="xcard__title"><Accent text={c.title} accent={c.accent} /></h3>
        <p className="xcard__pills">
          {t.pills.map((x) => <span key={x.text} className={`xpill xpill--${x.tone}`}>{x.text}</span>)}
        </p>
        <p className="xcard__foot">
          <span>{c.num} · {t.role}</span>
          <span className="xcard__cta">Read case study →</span>
        </p>
      </div>
      <Media c={c} />
    </Link>
  );
}

export default function Home() {
  useReveal();
  return (
    <div className="page home">
      <section className="hero wrap grid">
        <dl className="meta hero__meta">
          {home.meta.map(([k, v]) => (
            <div key={k}>
              <dt className="lbl lbl--muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt className="lbl lbl--muted">Contact</dt>
            <dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
          </div>
        </dl>
        <div className="hero__main">
          <p className="lbl lbl--muted hero__kicker">Product designer · Verizon, previously HARMAN</p>
          <h1 className="display">
            <Accent text="I turn complex technology into products people understand." accent="understand." />
          </h1>
          <p className="hero__sub">{home.sub}</p>
          <div className="hero__ctas">
            <a className="btn btn--solid" href="#work" onClick={(e) => { e.preventDefault(); jumpTo('work'); }}>See the work ↓</a>
            <Link className="btn btn--line" to="/resume">Résumé →</Link>
            <AskButton />
          </div>
        </div>
      </section>

      <section className="wrap stats" aria-label="Selected results">
        {home.stats.map((s) => (
          <Link key={s.label} to={`/work/${s.to}`} className="stat" data-rv>
            <span className="stat__n">{s.n}</span>
            <span className="stat__l">{s.label}</span>
            <span className="lbl lbl--accent">{s.source}</span>
          </Link>
        ))}
      </section>

      <section className="wrap work" id="work" aria-labelledby="work-title">
        <div className="work__head">
          <h2 id="work-title" className="h-xl">Work</h2>
          <span className="lbl lbl--muted">07 projects · ordered by depth</span>
        </div>

        <Label tone="muted">Case studies — full reads</Label>
        <Card c={bySlug('tello')} big />
        <Card c={bySlug('plug')} big />
        <div className="cards2">
          <Card c={bySlug('darpan')} />
          <Card c={bySlug('bang-olufsen')} />
        </div>

        <Label tone="muted">More work — shorter reads</Label>
        <div className="cards2">
          <Card c={bySlug('bracket')} />
          <Card c={bySlug('harman-kardon')} />
        </div>

        <Label tone="muted">Concept — not shipped</Label>
        <Card c={bySlug('relayos')} big />
      </section>

      <section className="wrap how" aria-labelledby="how-title">
        <h2 id="how-title" className="h-xl">How I work</h2>
        <div className="how__grid">
          {home.principles.map(([k, t, d]) => (
            <div key={k} data-rv>
              <Label tone="accent">{k}</Label>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
