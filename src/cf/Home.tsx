import { Fragment, useRef, useState } from 'react';
import { groups, work, type Work } from './work';
import { CLink, Footer, Label, Portrait, useReveal } from './parts';
import { scrollToEl } from '../lib/scroll';
import { getZoom, useLayout } from '../lib/layout';

const LEDGER: [string, string, string][] = [
  ['+7%', 'conversion for tello.ai in an A/B test with 2,400 users', 'Verizon · 2025'],
  ['−40%', 'in-car audio interaction time, validated in the car', 'HARMAN × Hyundai × B&O'],
  ['CES', 'Harman Kardon One Audio, shown in HARMAN’s AutoOne cockpit', 'HARMAN · CES 2025'],
  ['148', 'users on Bracket, an AI product I founded and designed', 'Independent · live'],
];

const HOW: [string, string, string][] = [
  ['Business', 'I start from the number that matters.', 'Conversion, setup time, task time — every case study says what moved and how it was measured.'],
  ['Technology', 'I design inside real constraints.', 'WhatsApp’s three-button limit, five in-car display formats, Indic scripts that run 40% longer.'],
  ['Execution', 'I take work all the way to ship.', 'Dev-ready specs, every state designed, and pixel-level QA against the build.'],
];

function Preview({ w }: { w: Work }) {
  const phones = w.cover[0].h > w.cover[0].w;
  return (
    <div className="cf-preview">
      <div className="cf-preview__text">
        <Label>What it shows</Label>
        <p className="cf-preview__shows">{w.shows}</p>
        <p className="cf-preview__summary">{w.summary}</p>
        <p className="cf-preview__brief">{w.brief.map(([n, l]) => `${n} ${l}`).join('  ·  ')}</p>
        <CLink to={`/work/${w.slug}`} className="cf-link">Read the {w.tier === 'concept' ? 'concept' : 'case study'} →</CLink>
      </div>
      <div className={`cf-preview__shots ${phones ? 'is-phones' : ''}`}>
        {(phones ? w.cover : w.cover.slice(0, 1)).map((s) => (
          <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState('tello');
  const mobile = useLayout() === 'mobile';
  return (
    <div className="cf-index">
      {!mobile && (
        <div className="cf-index__cols">
          <Label>No.</Label>
          <Label>Project</Label>
          <Label>Context</Label>
          <Label>Role</Label>
          <Label>Result</Label>
        </div>
      )}
      {groups.map((g) => (
        <Fragment key={g.tier}>
          <div className="cf-index__group" data-reveal>
            <span className="cf-index__group-title">{g.title}</span>
            <span className="cf-index__group-note">{g.note}</span>
          </div>
          {work
            .filter((w) => w.tier === g.tier)
            .map((w) => {
              const isOpen = !mobile && open === w.slug;
              const row = (
                <>
                  <span className="cf-row__num">{w.num}</span>
                  <span className="cf-row__project">
                    <span className="cf-row__name">{w.name}</span>
                    <span className="cf-row__line">{w.line}</span>
                  </span>
                  <span className="cf-row__cell">{w.context}</span>
                  <span className="cf-row__cell">{w.role}</span>
                  <span className={`cf-row__result ${w.tier === 'concept' ? 'is-concept' : ''}`}>{w.result}</span>
                  <span className="cf-row__arrow" aria-hidden>{isOpen ? '↑' : mobile ? '→' : '↓'}</span>
                </>
              );
              return (
                <div key={w.slug} className={`cf-row-wrap ${isOpen ? 'is-open' : ''}`} data-reveal>
                  {mobile ? (
                    <CLink to={`/work/${w.slug}`} className="cf-row">{row}</CLink>
                  ) : (
                    <button className="cf-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? '' : w.slug)}>
                      {row}
                    </button>
                  )}
                  {!mobile && (
                    <div className="cf-row__panel">
                      <div className="cf-row__panel-inner">{isOpen && <Preview w={w} />}</div>
                    </div>
                  )}
                </div>
              );
            })}
        </Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <div className="cf-page" ref={root}>
      <section className="cf-hero">
        <div className="cf-hero__main">
          <Label className="cf-hero__label" data-in>Product designer · AI, conversational & in-car UX</Label>
          <h1 className="cf-hero__title" data-in>
            I design products people <em>trust</em>, the business can <em>measure</em>, and engineering can <em>build</em>.
          </h1>
          <p className="cf-hero__intro" data-in>
            Experience Designer II at Verizon, previously HARMAN. 4.5+ years shipping agentic AI measured in A/B tests and in-car
            experiences validated in the car — and taking my own AI products from idea to live users.
          </p>
          <div className="cf-hero__ctas" data-in>
            <button className="cf-btn cf-btn--solid" onClick={() => workRef.current && scrollToEl(workRef.current, 100 * getZoom())}>
              See the work ↓
            </button>
            <CLink to="/resume" className="cf-btn">Résumé →</CLink>
          </div>
        </div>
        <div className="cf-hero__side" data-in>
          <Portrait />
          <Label>India · works remote</Label>
        </div>
      </section>

      <section className="cf-ledger" aria-label="Results">
        {LEDGER.map(([n, l, s]) => (
          <div key={n} className="cf-ledger__cell" data-reveal>
            <span className="cf-ledger__num">{n}</span>
            <span className="cf-ledger__text">{l}</span>
            <Label>{s}</Label>
          </div>
        ))}
      </section>

      <section className="cf-work" ref={workRef} id="work">
        <div className="cf-work__head" data-reveal>
          <h2 className="cf-h2">
            Selected work <span className="cf-count">(06)</span>
          </h2>
          <p className="cf-work__note">Three to read in depth. Three for range.</p>
        </div>
        <Index />
      </section>

      <section className="cf-how">
        <h2 className="cf-h2" data-reveal>How I work</h2>
        <div className="cf-how__grid">
          {HOW.map(([k, t, s]) => (
            <div key={k} className="cf-how__cell" data-reveal>
              <Label>{k}</Label>
              <h3>{t}</h3>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
