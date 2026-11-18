// Project preview that opens over the work grid: role, description, skills and the
// key result on the left; every screen from the case study on the right.
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Body } from './CasePage';
import { home, profile, type Case, type Section, type Shot } from './content';
import { Img } from './ui';

/** Short subtitle and skill tags shown in the preview, per project. */
const META: Record<string, { subtitle: string; role: string; skills: string[] }> = {
  tello: { subtitle: 'Agentic AI for plan selection', role: 'Experience Designer II, Verizon', skills: ['Conversational UX', 'Agentic AI', 'Interaction design', 'Prototyping', 'A/B testing'] },
  'bang-olufsen': { subtitle: 'In-car audio interaction model', role: 'Experience Designer, HARMAN', skills: ['Automotive HMI', 'Interaction design', 'AI sound tuning', 'In-car testing', 'Client workshops'] },
  'harman-kardon': { subtitle: 'Multi-device in-car audio', role: 'Associate Experience Designer, HARMAN', skills: ['Automotive HMI', 'Adaptive layouts', 'Usability validation', 'Design QA'] },
  plug: { subtitle: 'AI overpayment recovery platform', role: 'Founder & product designer', skills: ['Product design', 'Information architecture', 'Design systems', 'AI trust patterns', 'Fintech'] },
  bracket: { subtitle: 'AI-native SaaS product design', role: 'Founder & product designer', skills: ['Product design', 'Human-in-the-loop AI', 'Design systems', 'SaaS', 'Prototyping'] },
  darpan: { subtitle: 'AI video director for creators', role: 'Founder & product designer', skills: ['0-to-1 product design', 'Voice UX', 'Mobile UI', 'AI coaching', 'UX writing'] },
  relayos: { subtitle: 'Voice AI for manufacturers', role: 'Product designer · independent concept', skills: ['Voice AI', 'WhatsApp UX', 'Multilingual design', 'Service design', 'Engineering handoff'] },
};

type TabKey = 'overview' | 'process' | 'decisions' | 'outcome';
const TAB_LABEL: Record<TabKey, string> = { overview: 'Overview', process: 'Process', decisions: 'Key decisions', outcome: 'Outcome' };
const GROUP: Record<Section['kind'], Exclude<TabKey, 'overview'>> = {
  lede: 'process', list: 'process', steps: 'process', image: 'process', gallery: 'process',
  decisions: 'decisions', outcome: 'outcome', results: 'outcome', pairs: 'outcome',
};

type Block = { kind: 'wide'; shot: Shot } | { kind: 'phones'; shots: Shot[] };
const isTall = (s: Shot) => s.h > s.w * 1.4;

/** Every screen in the case study, in reading order, with phones grouped into rows. */
function blocksFor(c: Case): Block[] {
  const all: Shot[] = [];
  if ('wide' in c.cover) all.push(c.cover.wide);
  else all.push(...c.cover.phones);
  if (c.slug === 'tello' || c.slug === 'darpan') all.push(...home.cards[c.slug]);
  for (const s of c.sections) {
    if (s.kind === 'decisions') s.items.forEach((d) => d.shots && all.push(...d.shots));
    if (s.kind === 'image') all.push(s.shot);
    if (s.kind === 'gallery') { if (s.flow) all.push(s.flow.shot); all.push(...s.shots); }
  }
  const seen = new Set<string>();
  const shots = all.filter((s) => (seen.has(s.src) ? false : (seen.add(s.src), true)));
  const out: Block[] = [];
  let row: Shot[] = [];
  const flush = () => { if (row.length) out.push({ kind: 'phones', shots: row }); row = []; };
  for (const s of shots) {
    if (isTall(s)) { row.push(s); if (row.length === 3) flush(); }
    else { flush(); out.push({ kind: 'wide', shot: s }); }
  }
  flush();
  return out;
}

export function WorkModal({ c, onClose }: { c: Case; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<TabKey>('overview');
  const body = useRef<HTMLDivElement>(null);
  const tabs: TabKey[] = ['overview', ...(['process', 'decisions', 'outcome'] as const).filter((k) => c.sections.some((x) => GROUP[x.kind] === k))];

  // New tab: back to the top, and show its content (no scroll-reveal inside the preview).
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
    panel.current?.querySelectorAll('[data-rv]').forEach((el) => el.classList.add('is-in'));
  }, [tab]);

  const onTabKey = (e: ReactKeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next);
    document.getElementById(`wm-tab-${next}`)?.focus();
  };
  const meta = META[c.slug];
  const role = meta?.role ?? c.facts.find(([k]) => k === 'Role')?.[1];
  const url = `${profile.site}/work/${c.slug}`;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add('is-locked');
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
      opener?.focus();
    };
  }, [onClose]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard blocked: the link is still on the page */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="wm" role="presentation">
      <div className="wm__scrim" onClick={onClose} />
      <div className="wm__panel" role="dialog" aria-modal="true" aria-labelledby="wm-title" ref={panel}>
        <header className="wm__head">
          <h2 id="wm-title">{c.name} <span className="wm__dash">—</span> <em>{meta?.subtitle ?? c.title}</em></h2>
          <div className="wm__actions">
            <button type="button" className="wm__copy" onClick={copy} aria-live="polite">
              {copied ? 'Link copied' : 'Copy link'}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
            </button>
            <button type="button" className="wm__close" onClick={onClose} aria-label="Close" ref={close}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        </header>

        <div className="wm__tabs" role="tablist" aria-label="Project sections">
          {tabs.map((k, i) => (
            <button
              key={k}
              type="button"
              role="tab"
              id={`wm-tab-${k}`}
              aria-selected={tab === k}
              aria-controls="wm-panel"
              tabIndex={tab === k ? 0 : -1}
              className={tab === k ? 'is-active' : ''}
              onClick={() => setTab(k)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {TAB_LABEL[k]}
            </button>
          ))}
        </div>

        <div className="wm__body" ref={body} id="wm-panel" role="tabpanel" aria-labelledby={`wm-tab-${tab}`} key={tab}>
          {tab === 'overview' ? (
            <div className="wm__ov">
              {(() => {
                const blocks = blocksFor(c);
                const [lead, ...rest] = blocks;
                const show = (b: Block, i: number, eager = false) =>
                  b.kind === 'wide' ? (
                    <figure key={b.shot.src} className="wm__shot">
                      <Img shot={b.shot} eager={eager} />
                    </figure>
                  ) : (
                    <figure key={b.shots[0].src} className="wm__shot wm__shot--phones wm__span">
                      {b.shots.map((x) => <Img key={x.src} shot={x} eager={eager} />)}
                    </figure>
                  );
                const year = c.facts.find(([k]) => k === 'Year')?.[1];
                const status = c.facts.find(([k]) => k === 'Status' || k === 'Type')?.[1];
                return (
                  <>
                    {lead && <div className="wm__lead">{show(lead, 0, true)}</div>}

                    <dl className="wm__strip">
                      {role && <div><dt>My role</dt><dd>{role}</dd></div>}
                      {year && <div><dt>Year</dt><dd>{year}</dd></div>}
                      {status && <div><dt>Status</dt><dd>{status}</dd></div>}
                      <div className="wm__strip-result">
                        <dt>Key result</dt>
                        <dd><b>{c.brief.result.n}</b> {c.brief.result.label}</dd>
                      </div>
                    </dl>

                    <div className="wm__text">
                      <p className="wm__lede">{c.summary}</p>
                      {(c.myCall || c.myPart) && (
                        <blockquote className="wm__call">
                          <p className="wm__call-h">{c.myCall ? 'My call' : 'My part'}</p>
                          <p>{c.myCall ?? c.myPart}</p>
                        </blockquote>
                      )}
                      {meta && (
                        <div className="wm__skills">
                          <p className="wm__call-h">Skills and deliverables</p>
                          <p className="wm__chips">{meta.skills.map((x) => <span key={x}>{x}</span>)}</p>
                        </div>
                      )}
                      <p className="wm__src">Result source: {c.brief.result.source}</p>
                    </div>

                    {rest.length > 0 && (
                      <>
                        <h3 className="wm__gal-h">Screens</h3>
                        <div className="wm__gallery">{rest.map((b, i) => show(b, i))}</div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="wm__doc">
              {tab === 'process' && (
                <section className="wm__sec wm__brief">
                  <div><h3 className="wm__sec-h">Problem</h3><p>{c.brief.problem}</p></div>
                  <div><h3 className="wm__sec-h">What I did</h3><p>{c.brief.did}</p></div>
                  {c.myCall && c.myPart && <div><h3 className="wm__sec-h">My part</h3><p>{c.myPart}</p></div>}
                </section>
              )}
              {c.sections.filter((x) => GROUP[x.kind] === tab).map((x) => (
                <section key={x.title} className="wm__sec">
                  {x.title !== TAB_LABEL[tab] && x.title !== 'Outcome' && <h3 className="wm__sec-h">{x.title}</h3>}
                  <Body s={x} />
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
