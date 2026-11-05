import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCase, TIER_TAG, type Callout, type Decision, type Outcome, type Section, type Shot } from './content';
import NotFound from './NotFound';
import { jumpTo } from './scroll';
import { Accent, Footer, Gauge, Img, Label, Tag, useReveal } from './ui';

const pad = (i: number) => String(i + 1).padStart(2, '0');
const isPhone = (s: Shot) => s.h > s.w;

function Shots({ shots }: { shots: Shot[] }) {
  return (
    <div className={`shots${isPhone(shots[0]) ? ' shots--phones' : ''}`}>
      {shots.map((s) => (
        <figure key={s.src + s.alt}>
          <Img shot={s} />
          <figcaption className="sr-only">{s.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const Bar = ({ c, tone = 'line' }: { c: Callout; tone?: 'line' | 'accent' }) => (
  <div className={`note note--${tone}`} data-rv>
    <Label tone={tone === 'accent' ? 'accent' : 'muted'}>{c.label}</Label>
    <p>{c.text}</p>
  </div>
);

function DecisionView({ d }: { d: Decision }) {
  return (
    <article className="dec" data-rv>
      <Label tone="accent">{d.label}</Label>
      <h3 className="dec__title">{d.title}</h3>
      <p className="dec__ctx">{d.context}</p>
      {d.rejected && d.chosen && (
        <div className="dec__alt">
          <div className="dec__box dec__box--no">
            <Label tone="muted">Rejected</Label>
            <p className="dec__h"><span aria-hidden="true">✕</span> {d.rejected[0]}</p>
            <p>{d.rejected[1]}</p>
          </div>
          <div className="dec__box dec__box--yes">
            <Label tone="accent">Chosen</Label>
            <p className="dec__h"><span aria-hidden="true">✓</span> {d.chosen[0]}</p>
            <p>{d.chosen[1]}</p>
          </div>
        </div>
      )}
      {d.tradeoff && <Bar c={{ label: 'Trade-off we accepted', text: d.tradeoff }} tone="accent" />}
      {d.shots && <Shots shots={d.shots} />}
    </article>
  );
}

function Bars({ b }: { b: NonNullable<Outcome['bars']> }) {
  const max = Math.max(b.before, b.after);
  return (
    <div className="bars" data-rv>
      <p className="bars__label">{b.label}</p>
      {(['before', 'after'] as const).map((k) => (
        <div key={k} className={`bars__row is-${k}`}>
          <span className="lbl lbl--muted">{k}</span>
          <span className="bars__track"><i style={{ width: `${(b[k] / max) * 100}%` }} /></span>
          <span className="bars__v">{k === 'before' ? b.beforeText : b.afterText}</span>
        </div>
      ))}
    </div>
  );
}

function OutcomeView({ o }: { o: Outcome }) {
  return (
    <div className="out">
      {o.gauge ? (
        <div className="hmi" data-rv>
          <p className="lbl hmi__tag">{o.tag}</p>
          <div className="hmi__row">
            {o.gauge.map((g) => (
              <div key={g.label} className="hmi__cell">
                <Gauge n={g.n} label={g.label} fill={g.fill} />
                <p className="lbl hmi__src">{g.source}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Label tone="accent">{o.tag}</Label>
      )}
      {o.bars && <Bars b={o.bars} />}
      {o.tiles && (
        <div className="tiles">
          {o.tiles.map((t) => (
            <div key={t.label} className="tile" data-rv>
              <span className="tile__n">{t.n}</span>
              <span className="tile__l">{t.label}</span>
              <span className="lbl lbl--muted">{t.source}</span>
            </div>
          ))}
        </div>
      )}
      <Bar c={{ label: 'Method and source', text: o.method }} />
      {o.callouts?.map((c) => <Bar key={c.label} c={c} />)}
    </div>
  );
}

function Body({ s }: { s: Section }) {
  switch (s.kind) {
    case 'lede':
      return <p className="lede" data-rv>{s.text}</p>;
    case 'list':
      return (
        <ul className="dash" data-rv>
          {s.items.map((x) => <li key={x}>{x}</li>)}
        </ul>
      );
    case 'steps':
      return (
        <ol className="steps" style={{ ['--n' as string]: s.steps.length }} data-rv>
          {s.steps.map(([k, v], i) => (
            <li key={k}>
              <span className="lbl lbl--accent">{pad(i)}</span>
              <b>{k}</b>
              <span>{v}</span>
            </li>
          ))}
        </ol>
      );
    case 'decisions':
      return <div className="decs">{s.items.map((d) => <DecisionView key={d.title} d={d} />)}</div>;
    case 'pairs':
      return (
        <dl className="pairs">
          {s.items.map(([k, v]) => (
            <div key={k} data-rv>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      );
    case 'image':
      return (
        <figure className="map" data-rv>
          <a href={s.shot.src} target="_blank" rel="noreferrer" aria-label={`Open full size: ${s.shot.alt}`}>
            <Img shot={s.shot} />
          </a>
          <figcaption>{s.caption} <span className="lbl lbl--muted">Open full size ↗</span></figcaption>
        </figure>
      );
    case 'outcome':
      return <OutcomeView o={s.outcome} />;
    case 'results':
      return (
        <div className="out">
          <div className="status" data-rv>
            <Label tone="accent">{s.status.label}</Label>
            <p>{s.status.text}</p>
          </div>
          <Label tone="muted">{s.listLabel}</Label>
          <ul className="dash dash--sm" data-rv>
            {s.items.map((x) => <li key={x}>{x}</li>)}
          </ul>
          {s.callouts?.map((c) => <Bar key={c.label} c={c} />)}
        </div>
      );
  }
}

function Toc({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    // The active section is the last one whose top has passed 30% of the viewport.
    const secs = [...document.querySelectorAll<HTMLElement>('.sec')];
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let i = 0;
      secs.forEach((s, k) => s.getBoundingClientRect().top < line && (i = k));
      setActive(i);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [sections]);
  return (
    <nav className="toc" aria-label="On this page">
      <Label tone="muted">On this page</Label>
      <ol>
        {sections.map((s, i) => (
          <li key={s.title}>
            <a
              href={`#s${i + 1}`}
              aria-current={active === i ? 'true' : undefined}
              onClick={(e) => { e.preventDefault(); jumpTo(`s${i + 1}`); }}
            >
              <span className="lbl">{pad(i)}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function CasePage() {
  const { slug } = useParams();
  const c = getCase(slug);
  useReveal(slug);
  useEffect(() => {
    if (c) document.title = `${c.name} — Saksham Shukla`;
  }, [c]);
  if (!c) return <NotFound />;
  const next = getCase(c.next)!;

  return (
    <div className={`page case is-${c.tier}`}>
      <section className="wrap grid chead">
        <p className="chead__crumb">
          <Link to="/" className="lbl lbl--muted">Work</Link>
          <span className="lbl lbl--muted"> / {c.num}</span>
          <Tag tier={c.tier} />
        </p>
        <dl className="meta chead__facts">
          {c.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="lbl lbl--muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="chead__main">
          <h1 className="h-case"><Accent text={c.title} accent={c.accent} /></h1>
          <p className="chead__sum">{c.summary}</p>
        </div>
      </section>

      <section className="wrap brief" aria-label="In 60 seconds">
        <Label tone="muted">In 60 seconds</Label>
        <div className="brief__cols">
          <div>
            <Label tone="accent">Problem</Label>
            <p>{c.brief.problem}</p>
          </div>
          <div>
            <Label tone="accent">What I did</Label>
            <p>{c.brief.did}</p>
          </div>
          <div>
            <Label tone="accent">Result</Label>
            <p className="brief__n">{c.brief.result.n}</p>
            <p className="brief__l">{c.brief.result.label}</p>
            <p className="lbl lbl--muted">{c.brief.result.source}</p>
          </div>
        </div>
      </section>

      <section className="wrap" aria-label="Screens">
        {'phones' in c.cover ? (
          <div className="cover cover--phones">
            {c.cover.phones.map((s, i) => <Img key={s.src} shot={s} eager={i < 2} />)}
          </div>
        ) : (
          <div className={`cover cover--wide${c.cover.gauge ? ' is-dark' : ''}`}>
            <Img shot={c.cover.wide} eager />
            {c.cover.gauge && <div className="hmi-chip"><Gauge {...c.cover.gauge} size="sm" /></div>}
          </div>
        )}
      </section>

      <div className="wrap grid cbody">
        <Toc sections={c.sections} />
        <div className="cbody__main">
          {c.sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} data-i={i} className="sec" aria-labelledby={`h${i + 1}`}>
              <p className="lbl lbl--accent">{pad(i)}</p>
              <h2 id={`h${i + 1}`} className="h-sec">{s.title}</h2>
              <Body s={s} />
            </section>
          ))}
        </div>
      </div>

      <Link to={`/work/${next.slug}`} className="wrap nextlink">
        <span className="lbl lbl--muted">Next · {next.num} — {TIER_TAG[next.tier]}</span>
        <span className="nextlink__name">{next.name} <span aria-hidden="true">→</span></span>
        <span className="nextlink__line">{next.card.line}</span>
      </Link>
      <Footer />
    </div>
  );
}
