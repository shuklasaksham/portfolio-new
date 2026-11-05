import { Link } from 'react-router-dom';
import { cases, home, profile, type Case, type Shot } from './content';
import { Accent, AskButton, Footer, Gauge, Img, Label, Tag, useReveal } from './ui';

const bySlug = (s: string) => cases.find((c) => c.slug === s)!;

function Visual({ c }: { c: Case }) {
  if (c.slug === 'tello' || c.slug === 'darpan') {
    const shots: Shot[] = home.cards[c.slug];
    return (
      <div className={`card__media card__media--phones n${shots.length}`}>
        {shots.map((s) => <Img key={s.src} shot={s} />)}
      </div>
    );
  }
  if ('wide' in c.cover) {
    const dark = c.slug === 'bang-olufsen' || c.slug === 'harman-kardon' || c.slug === 'bracket';
    return (
      <div className={`card__media card__media--wide${dark ? ' is-dark' : ''}`}>
        <Img shot={{ ...c.cover.wide, alt: '' }} />
        {c.cover.gauge && (
          <div className="hmi-chip">
            <Gauge {...c.cover.gauge} size="sm" />
          </div>
        )}
      </div>
    );
  }
  return null;
}

function Card({ c, big }: { c: Case; big?: boolean }) {
  return (
    <Link to={`/work/${c.slug}`} className={`card${big ? ' card--big' : ''}`} data-rv>
      <Visual c={c} />
      <div className="card__row">
        <span className="lbl">{c.num}</span>
        <Tag tier={c.tier} />
        {c.card.result && <span className="card__result">{c.card.result}</span>}
      </div>
      <h3 className="card__name">{c.name}</h3>
      <p className="card__line">{c.card.line}</p>
      <p className="lbl lbl--muted">{c.card.meta}</p>
    </Link>
  );
}

export default function Home() {
  useReveal();
  const relay = bySlug('relayos');
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
            <a className="btn btn--solid" href="#work">See the work ↓</a>
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
          <span className="lbl lbl--muted">06 projects · ordered by depth</span>
          <span className="work__legend" aria-hidden="true">
            <Tag tier="deep" />
            <Tag tier="medium" />
            <Tag tier="concept" />
          </span>
        </div>

        <Label tone="muted">Case studies — full reads</Label>
        <Card c={bySlug('tello')} big />
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
        <Link to={`/work/${relay.slug}`} className="concept" data-rv>
          <div className="concept__text">
            <div className="card__row">
              <span className="lbl">{relay.num}</span>
              <Tag tier="concept" />
            </div>
            <h3 className="card__name">{relay.name}</h3>
            <p className="card__line">{relay.card.line}</p>
          </div>
          {'wide' in relay.cover && <Img shot={{ ...relay.cover.wide, alt: '' }} className="concept__img" />}
        </Link>
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
