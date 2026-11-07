// "Ask Saksham" answers only with sentences published on this site, each with its source.
// There is no language model behind it, so it cannot invent outcomes or responsibilities:
// a question with no good match gets the fallback, never a guess.

import { about, cases, type Case, type Section } from './content';

export type Answer = { text: string; sources: { label: string; to: string }[] } | { text: string; fallback: true };

export const SUGGESTIONS = [
  'What did you ship at Verizon?',
  'Show me your in-car work',
  'How do you work with engineers?',
  'What didn’t work?',
];

const src = (c: Case) => ({ label: `Case study ${c.num} — ${c.name}`, to: `/work/${c.slug}` });
const byslug = (s: string) => cases.find((c) => c.slug === s)!;

const CURATED: Record<string, Answer> = {
  [SUGGESTIONS[0]]: {
    text: 'tello.ai — an agentic assistant for Total Wireless, designed with a team. In a 4-week A/B test with 2,400 users, plan selection was 5× faster and conversion rose 7% (a team result). The camera activation flow was prototyped, not part of the test.',
    sources: [src(byslug('tello'))],
  },
  [SUGGESTIONS[1]]: {
    text: 'Two HARMAN projects. Bang & Olufsen × Hyundai: one feel-based gesture replaced three layers of equaliser sliders; in in-car prototype sessions with 98 participants, interaction time fell 40%. Harman Kardon One Audio: one app across five in-car displays, shown at CES 2024; prototype validation with about 2,000 US participants measured 65% faster setup.',
    sources: [src(byslug('bang-olufsen')), src(byslug('harman-kardon'))],
  },
  [SUGGESTIONS[2]]: {
    text: 'Dev-ready specs with every state designed, then pixel-level QA against the build. On One Audio he reviewed every build side by side with the design and logged fixes until demo day; on RelayOS he handed off 46 screens and 5 prototype flows, with loading, empty, error and offline states for every surface.',
    sources: [src(byslug('harman-kardon')), src(byslug('relayos'))],
  },
  [SUGGESTIONS[3]]: {
    text: 'Two things, both published with the data. DarpanAI: 65 creators signed up and 6 subscribed at ₹299/month, but only 2 recorded a take this week — retention is the open problem, and a guided second reel is the next hypothesis. Bracket: 1 of 15 workspaces is active and no trial has converted; he suspects setup comes before value and plans to investigate before changing onboarding.',
    sources: [src(byslug('darpan')), src(byslug('bracket'))],
  },
};

// Every published sentence, tagged with where it lives.
type Doc = { text: string; c?: Case };
function sectionText(s: Section): string[] {
  switch (s.kind) {
    case 'lede': return [s.text];
    case 'list': return s.items;
    case 'steps': return s.steps.map(([a, b]) => `${a}: ${b}`);
    case 'pairs': return s.items.map(([a, b]) => `${a}. ${b}`);
    case 'image': return [s.caption];
    case 'decisions': return s.items.flatMap((d) => [d.title, d.context, d.chosen?.join(': ') ?? '', d.tradeoff ?? ''].filter(Boolean));
    case 'outcome': return [`How it was measured — ${s.outcome.method}`, ...(s.outcome.callouts ?? []).map((c) => c.text)];
    case 'results': return [s.status.text, ...s.items, ...(s.callouts ?? []).map((c) => c.text)];
  }
}
const DOCS: Doc[] = [
  ...cases.flatMap((c) => [c.summary, ...c.facts.map(([k, v]) => `${k}: ${v}.`), ...[c.myCall, c.myPart].filter((x): x is string => !!x), c.brief.problem, c.brief.did, `${c.brief.result.n} ${c.brief.result.label} (${c.brief.result.source})`, ...c.sections.flatMap(sectionText)].map((text) => ({ text, c }))),
  ...about.paragraphs.map((text) => ({ text })),
];

const STOP = new Set('a an and are as at be by can did do does for from has have he his how i in is it its me my of on or so tell that the their them this to was what when where which who why with you your about saksham work many much first day days any some one'.split(' '));
// Questions about the future or personal terms are never in the case studies.
const OFF_TOPIC = /\b(would you|will you|salary|ctc|notice period|relocat|visa|hire you|availab|hourly|rate card|first \d+ days)\b/i;
const ALIAS: Record<string, string> = { paid: 'pay', payment: 'pay', measured: 'measur', measure: 'measur', led: 'lead' };
const words = (s: string) => s.replace(/\bB\s*&\s*O\b/gi, 'Bang Olufsen').toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}%+−-]+/gu, ' ').split(' ').filter((w) => w.length > 1 && !STOP.has(w));
const stem = (w: string) => ALIAS[w] ?? w.replace(/(ing|ed|es|s)$/, '');

// Each sentence also carries its project's name and aliases, so "One Audio" finds Harman Kardon.
const ALIASES: Record<string, string> = { tello: 'Verizon Total Wireless', 'bang-olufsen': 'B&O Hyundai', 'harman-kardon': 'One Audio HARMAN CES' };
const BAGS = DOCS.map((d) => new Set(words(`${d.text} ${d.c?.name ?? ''} ${d.c ? ALIASES[d.c.slug] ?? '' : ''}`).map(stem)));

export function answer(q: string): Answer {
  const curated = CURATED[q.trim()];
  if (curated) return curated;
  if (OFF_TOPIC.test(q)) return FALLBACK;
  const terms = [...new Set(words(q).map(stem))];
  if (!terms.length) return FALLBACK;
  // Rarer words count for more (idf), so "One Audio validation" beats a sentence that only shares "audio".
  const idf = (t: string) => Math.log(DOCS.length / (1 + BAGS.filter((b) => b.has(t)).length));
  const scored = BAGS.map((ws, i) => {
    const hits = terms.filter((t) => ws.has(t));
    return { d: DOCS[i], hits: hits.length, score: hits.reduce((n, t) => n + idf(t), 0) };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.score - a.score);
  if (!scored.length || scored[0].hits < Math.min(2, terms.length)) return FALLBACK;
  const top = scored.filter((x) => x.score === scored[0].score).slice(0, 2).map((x) => x.d);
  const sources = [...new Map(top.filter((d) => d.c).map((d) => [d.c!.slug, src(d.c!)])).values()];
  return { text: top.map((d) => d.text).join(' '), sources: sources.length ? sources : [{ label: 'About', to: '/about' }] };
}

const FALLBACK: Answer = {
  text: 'That isn’t covered in the published case studies, so I won’t guess. Email Saksham and he’ll answer directly.',
  fallback: true,
};
