import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { getWork, type Block, type Outcome, type Shot, type Work } from './work';
import { CLink, Footer, Label, useReveal } from './parts';
import { scrollToEl } from '../lib/scroll';
import { getZoom } from '../lib/layout';
import NotFound from './NotFound';

const TIER_LABEL = { deep: 'Case study', medium: 'More work', concept: 'Concept — not shipped' } as const;

type Section = { id: string; title: string; body: ReactNode };

function Shots({ shots }: { shots: Shot[] }) {
  const phones = shots[0].h > shots[0].w;
  return (
    <div className={`cf-shots ${phones ? 'is-phones' : ''}`}>
      {shots.map((s) => (
        <figure key={s.src + s.alt}>
          <img src={s.src} alt={s.alt} loading="lazy" style={{ aspectRatio: `${s.w} / ${s.h}` }} />
          <figcaption>{s.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="cf-blocks">
      {blocks.map((b, i) => (
        <article key={b.title} className="cf-block" data-reveal>
          <Label>Decision {String(i + 1).padStart(2, '0')}</Label>
          <h3>{b.title}</h3>
          <p>{b.text}</p>
          {b.tradeoff && (
            <p className="cf-tradeoff">
              <Label>Trade-off</Label>
              {b.tradeoff}
            </p>
          )}
          {b.shots && <Shots shots={b.shots} />}
        </article>
      ))}
    </div>
  );
}

function OutcomeView({ o }: { o: Outcome }) {
  return (
    <div className="cf-outcome" data-reveal>
      <Label>{o.tag}</Label>
      {o.bars && (
        <div className="cf-bars">
          <span className="cf-bars__label">{o.bars.label}</span>
          {(['before', 'after'] as const).map((k) => (
            <div key={k} className={`cf-bars__row is-${k}`}>
              <span className="cf-label">{k}</span>
              <span className="cf-bars__track">
                <i style={{ width: `${(o.bars![k] / Math.max(o.bars!.before, o.bars!.after)) * 100}%` }} />
              </span>
              <span className="cf-bars__value">{k === 'before' ? o.bars!.beforeText : o.bars!.afterText}</span>
            </div>
          ))}
        </div>
      )}
      <div className="cf-tiles">
        {o.tiles.map(([n, l]) => (
          <div key={l}>
            <span className="cf-tiles__num">{n}</span>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <p className="cf-method">
        <Label>Method</Label>
        {o.method}
      </p>
    </div>
  );
}

function Pairs({ items }: { items: [string, string][] }) {
  return (
    <dl className="cf-pairs">
      {items.map(([k, v]) => (
        <div key={k} data-reveal>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Steps({ steps }: { steps: [string, string][] }) {
  return (
    <ol className="cf-steps" data-reveal>
      {steps.map(([k, v], i) => (
        <li key={k}>
          <span className="cf-label">{String(i + 1).padStart(2, '0')}</span>
          <b>{k}</b>
          <span>{v}</span>
        </li>
      ))}
    </ol>
  );
}

function sectionsFor(w: Work): Section[] {
  const s: Section[] = [{ id: 'problem', title: 'The problem', body: <p className="cf-lede" data-reveal>{w.problem}</p> }];
  if (w.tier === 'concept') {
    if (w.process) s.push({ id: 'how', title: 'How it works', body: <Steps steps={w.process} /> });
    s.push({ id: 'design', title: 'The design', body: <Blocks blocks={w.blocks} /> });
    w.extra?.forEach((x, i) => s.push({ id: `extra-${i}`, title: x.title, body: <Pairs items={x.items} /> }));
    return s;
  }
  if (w.scope) {
    s.push({
      id: 'role',
      title: w.tier === 'deep' ? 'My role and scope' : 'My contribution',
      body: (
        <ul className="cf-list" data-reveal>
          {w.scope.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ),
    });
  }
  if (w.tier === 'deep' && w.process) s.push({ id: 'process', title: 'Process', body: <Steps steps={w.process} /> });
  if (w.tier === 'medium') w.extra?.forEach((x, i) => s.push({ id: `extra-${i}`, title: x.title, body: <Pairs items={x.items} /> }));
  s.push({ id: 'decisions', title: w.tier === 'deep' ? 'Key decisions' : 'Highlights', body: <Blocks blocks={w.blocks} /> });
  if (w.tier === 'deep') w.extra?.forEach((x, i) => s.push({ id: `extra-${i}`, title: x.title, body: <Pairs items={x.items} /> }));
  if (w.outcome) s.push({ id: 'outcome', title: 'Outcome', body: <OutcomeView o={w.outcome} /> });
  if (w.learned) s.push({ id: 'learned', title: 'What I learned', body: <Pairs items={w.learned} /> });
  return s;
}

function Toc({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);
  return (
    <nav className="cf-toc" aria-label="Sections">
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={active === s.id ? 'is-active' : ''}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(s.id);
            if (el) scrollToEl(el, 110 * getZoom());
          }}
        >
          <span>{String(i + 1).padStart(2, '0')}</span>
          {s.title}
        </a>
      ))}
    </nav>
  );
}

export default function CasePage() {
  const { slug } = useParams();
  const w = getWork(slug);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, [slug]);
  if (!w) return <NotFound />;
  const next = getWork(w.next)!;
  const sections = sectionsFor(w);

  return (
    <div className={`cf-page cf-case is-${w.tier}`} ref={root}>
      <section className="cf-case__hero">
        <p className="cf-crumb" data-in>
          <CLink to="/">Work</CLink> / {w.num} — <span className={w.tier === 'concept' ? 'cf-badge' : ''}>{TIER_LABEL[w.tier]}</span>
        </p>
        <h1 className="cf-case__title" data-in>{w.title}</h1>
        <p className="cf-case__summary" data-in>{w.summary}</p>
        <dl className="cf-facts" data-in>
          {w.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="cf-label">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cf-case__cover" data-in>
        <Shots shots={w.cover} />
      </section>

      <section className="cf-brief" aria-label="In brief">
        {w.brief.map(([n, l]) => (
          <div key={l} data-reveal>
            <span className="cf-brief__num">{n}</span>
            <span>{l}</span>
          </div>
        ))}
      </section>

      <div className="cf-case__body">
        <Toc sections={sections} />
        <div className="cf-case__content">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="cf-sec">
              <h2 className="cf-sec__title" data-reveal>
                <span className="cf-label">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>

      <CLink to={`/work/${next.slug}`} className="cf-next">
        <Label>Next · {next.num} — {TIER_LABEL[next.tier]}</Label>
        <span className="cf-next__name">{next.name}</span>
        <span className="cf-next__line">{next.line} →</span>
      </CLink>
      <Footer />
    </div>
  );
}
