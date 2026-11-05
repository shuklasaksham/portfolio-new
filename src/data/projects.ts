// All copy and numbers come from the case studies in the Figma file
// "Portfolio — Case Studies". Images live in public/img (see scripts/optimize-images.mjs).

export type Pin = { x: number; y: number; label: string };
export type Shot = { src: string; w: number; h: number; pins?: Pin[] };
export type StackLayer = { name: string; stat: string; src?: string };

export type Project = {
  slug: string;
  num: string;
  name: string;
  title: string;
  oneLiner: string;
  role: string;
  company: string;
  year: string;
  cover: string;
  coverAspect: number;
  chips: string[];
  workMetric: string;
  metrics: [string, string][];
  tldr: [string, string, string];
  beforeAfter: { before: [string, string]; after: [string, string]; line: string };
  highlights: { title: string; text: string; shots: Shot[] }[];
  impact: {
    tag: string;
    bars?: { label: string; before: number; after: number; beforeText: string; afterText: string };
    tiles: [string, string][];
    method: string;
  };
  process: [string, string][];
  full: [string, string][];
  stack: StackLayer[];
  next: string;
};

const img = (name: string) => `/img/${name}.webp`;

export const projects: Project[] = [
  {
    slug: 'bracket',
    num: '01',
    name: 'Bracket 2.0',
    title: 'An AI memory people can trust.',
    oneLiner: 'AI decision OS for freelancers & small teams',
    role: 'Founder · Product Designer',
    company: 'Bracket',
    year: '2026 – now',
    cover: img('overview'),
    coverAspect: 1200 / 780,
    chips: ['Founder · Product Designer', 'Bracket', '2026 – now · Live'],
    workMetric: '148 users · live v0.4',
    metrics: [
      ['148', 'users since launch'],
      ['173', 'screens designed'],
      ['53', 'components'],
    ],
    tldr: [
      'Decisions — scope, dates, prices — get lost inside email and Slack threads.',
      'An AI loop that detects changes, then asks a human before updating anything.',
      'Live: 148 users, 115 projects, 90 client questions generated.',
    ],
    beforeAfter: { before: ['5', 'separate alerts'], after: ['1', 'grouped review'], line: 'One email, five changes — reviewed in one place.' },
    highlights: [
      {
        title: 'Only decisions get your attention.',
        text: 'The overview splits “needs you” from “just happened”, so nothing urgent hides in a feed.',
        shots: [{ src: img('attention'), w: 1200, h: 780, pins: [
          { x: 0.25, y: 0.3, label: 'Decisions only' },
          { x: 0.85, y: 0.36, label: 'Changes by category' },
          { x: 0.33, y: 0.8, label: 'Promises from threads' },
        ] }],
      },
      {
        title: 'A change is a diff, not an alert.',
        text: 'Source on the left, AI interpretation on the right. Nothing changes until you accept.',
        shots: [{ src: img('review'), w: 1200, h: 780, pins: [
          { x: 0.35, y: 0.47, label: 'Exact source sentence' },
          { x: 0.9, y: 0.36, label: 'Confidence on every claim' },
          { x: 0.57, y: 0.8, label: 'Risky items unselected' },
          { x: 0.9, y: 0.955, label: 'You approve, not the AI' },
        ] }],
      },
      {
        title: 'Every claim shows its receipts.',
        text: 'Any memory opens the original message with the quote highlighted.',
        shots: [{ src: img('evidence'), w: 588, h: 382, pins: [
          { x: 0.22, y: 0.42, label: 'Discovered categories' },
          { x: 0.85, y: 0.27, label: 'Quote in context' },
        ] }],
      },
    ],
    impact: {
      tag: 'Live since 2026 · v0.4',
      tiles: [
        ['148', 'freelancers & teams'],
        ['115', 'projects created'],
        ['18', 'projects completed'],
        ['90', 'client questions generated'],
      ],
      method: 'Cumulative product analytics since launch; accounts and workspace activity, not survey data.',
    },
    process: [
      ['Frame', '8 principles, 19 scenario areas'],
      ['Structure', 'One loop: detect → remember'],
      ['Design', '173 screens, every state real'],
      ['Ship', '53 components, dev-ready'],
    ],
    full: [
      ['Research & principles', '19 scenario areas mapped and 8 principles — “Humans control change”, “Every claim has evidence” — used to test every layout.'],
      ['The key trade-off', 'No auto-apply. One deliberate click per change, because one silently wrong price poisons every answer that depends on it.'],
      ['Stress test', 'I ran a polo manufacturer’s orders through the same screens to prove it’s a platform, not a template.'],
      ['What I’d do next', 'Tune confidence thresholds with real accept rates, then earn the right to automate category by category.'],
    ],
    stack: [
      { name: 'Research', stat: '8 principles', src: img('layer-research') },
      { name: 'Tokens', stat: 'AA contrast', src: img('layer-tokens') },
      { name: 'Components', stat: '53 components', src: img('layer-components') },
      { name: 'Screens', stat: '173 screens', src: img('overview') },
      { name: 'Prototype', stat: '227 screens · 11 flows', src: img('layer-prototype') },
    ],
    next: 'one-audio',
  },
  {
    slug: 'one-audio',
    num: '02',
    name: 'One Audio',
    title: 'Making sound you can see.',
    oneLiner: 'Harman Kardon in-car audio · CES 2025',
    role: 'Associate Experience Designer',
    company: 'HARMAN × Harman Kardon',
    year: '2024',
    cover: img('oa-hero'),
    coverAspect: 1920 / 1080,
    chips: ['Associate Experience Designer', 'HARMAN × Harman Kardon', '2024 · CES 2025'],
    workMetric: 'CES 2025 · 65% faster setup',
    metrics: [
      ['65%', 'faster device setup'],
      ['+13%', 'multi-device usage'],
      ['4.2', 'prototype rating'],
    ],
    tldr: [
      'Premium audio hardware is invisible — and CES visitors get six noisy minutes.',
      'Treated the demo script as the journey; made seats, moods and light the UI.',
      'Shown at CES 2025 on 3 cars and 5 display formats.',
    ],
    beforeAfter: { before: ['5', 'display formats'], after: ['1', 'adaptive app'], line: 'Rules, not redesigns: one app reflows to every screen.' },
    highlights: [
      {
        title: 'The hardware is the interface.',
        text: 'Seats render in 3D with their speakers in place, so visitors see why it sounds different.',
        shots: [{ src: img('oa-seatsonic'), w: 1920, h: 1080, pins: [
          { x: 0.68, y: 0.45, label: 'Speakers shown in seats' },
          { x: 0.11, y: 0.72, label: 'Tune one seat or all' },
          { x: 0.31, y: 0.62, label: 'Taste, not EQ' },
        ] }],
      },
      {
        title: 'A mood takes over the cabin.',
        text: 'One tap changes sound, light and visuals across three screens at once.',
        shots: [{ src: img('oa-mood-coast'), w: 1920, h: 1080, pins: [
          { x: 0.5, y: 0.26, label: 'One tap to start' },
          { x: 0.5, y: 0.47, label: 'Each sphere previews a scene' },
          { x: 0.64, y: 0.82, label: 'Lives in the main nav' },
        ] }],
      },
      {
        title: 'One app, five screens.',
        text: 'Background and UI scale separately and anchor to stage positions — no redesign per car.',
        shots: [{ src: img('oa-car1'), w: 2017, h: 756, pins: [
          { x: 0.1, y: 0.22, label: 'Background scales alone' },
          { x: 0.47, y: 0.5, label: 'Anchored, not artboards' },
          { x: 0.55, y: 0.93, label: '48px icons · 56px buttons' },
        ] }],
      },
    ],
    impact: {
      tag: 'Usability validation · CES 2025',
      bars: { label: 'Device setup time', before: 100, after: 35, beforeText: 'Baseline', afterText: '65% faster' },
      tiles: [
        ['+13%', 'multi-device usage'],
        ['4.2', 'prototype satisfaction'],
        ['55%', 'projected fewer support requests'],
      ],
      method: 'Prototype usability validation; support reduction is a projection, not a production figure.',
    },
    process: [
      ['Define', 'Car matrix + 15-step demo script'],
      ['Design', 'Home, Media, Mood, Sound, System'],
      ['Bring to life', '3D seats, moods, light themes'],
      ['Ship', 'Adaptation rules + UI QA'],
    ],
    full: [
      ['The demo-first reframe', 'A 15-step, 5:40 guided demo became the user journey — each step had a 10–30 second time budget.'],
      ['Light that listens', 'Five light themes on two mechanisms: speed follows amplitude, layers follow beats.'],
      ['The key trade-off', 'Pre-rendered light video driven by music data instead of real-time generation — cinematic and predictable on demo hardware.'],
      ['Craft & QA', 'Reviewed every build side by side with the design and logged pixel-level fixes until demo day.'],
    ],
    stack: [
      { name: 'Define', stat: '15-step demo script' },
      { name: 'Design', stat: '5 core sections' },
      { name: 'Bring to life', stat: '3D seats · moods · light' },
      { name: 'Ship', stat: 'CES 2025', src: img('oa-hero') },
    ],
    next: 'hyundai-bo',
  },
  {
    slug: 'hyundai-bo',
    num: '03',
    name: 'Hyundai × B&O',
    title: 'Shaping sound by feel.',
    oneLiner: 'Bang & Olufsen in-car audio concept',
    role: 'Experience Designer',
    company: 'HARMAN × Hyundai × B&O',
    year: '2024',
    cover: img('bo-ai-result'),
    coverAspect: 1600 / 1000,
    chips: ['Experience Designer', 'HARMAN × Hyundai × B&O', '2024 · In-car tested'],
    workMetric: '40% faster interactions',
    metrics: [
      ['40%', 'faster interactions'],
      ['3 → 1', 'navigation layers'],
      ['76%', 'user satisfaction'],
    ],
    tldr: [
      'Premium audio usually means an equaliser — meaningless to most drivers.',
      'One feel-based gesture, AI tuning in plain words, and one-QR sign-in.',
      'Validated in the car: 40% faster, 10% less driver distraction.',
    ],
    beforeAfter: { before: ['3', 'settings layers'], after: ['1', 'gesture'], line: 'Move one dot instead of digging through three menus of sliders.' },
    highlights: [
      {
        title: 'Move one dot to shape sound.',
        text: 'Bright–Warm and Relaxed–Energetic replace bass, treble and fader.',
        shots: [{ src: img('bo-beosonic'), w: 1600, h: 1000, pins: [
          { x: 0.5, y: 0.49, label: 'The dot is the sound' },
          { x: 0.5, y: 0.17, label: 'Feel-based axes' },
          { x: 0.29, y: 0.81, label: 'Safe preset modes' },
        ] }],
      },
      {
        title: 'Ask for a sound in plain words.',
        text: '“I want an AC/DC sound mode” lands on the same circle, so AI teaches the manual control.',
        shots: [{ src: img('bo-ai'), w: 1600, h: 1000, pins: [
          { x: 0.27, y: 0.81, label: 'Plain-language request' },
          { x: 0.5, y: 0.5, label: 'Answer on the same map' },
          { x: 0.87, y: 0.17, label: 'One tap to undo' },
        ] }],
      },
      {
        title: 'Sign in without typing in a car.',
        text: 'One QR installs the app and pairs the car; benefits come before the ask.',
        shots: [{ src: img('bo-signin'), w: 2946, h: 1600, pins: [
          { x: 0.27, y: 0.45, label: 'Benefits first' },
          { x: 0.45, y: 0.68, label: 'One QR, two jobs' },
          { x: 0.71, y: 0.48, label: 'Paired in one step' },
        ] }],
      },
    ],
    impact: {
      tag: 'In-car prototype sessions · concept stage',
      bars: { label: 'Navigation depth to change sound', before: 3, after: 1, beforeText: '3 layers', afterText: '1 layer' },
      tiles: [
        ['40%', 'faster audio interactions'],
        ['76%', 'user satisfaction'],
        ['10%', 'less driver distraction'],
      ],
      method: 'Compared against the previous 3-layer audio settings model, with live sound and ambient light. Concept, not a production release.',
    },
    process: [
      ['Align', '2-day workshop with B&O'],
      ['Explore', 'Gesture model and two tiers'],
      ['Design', 'Section-by-section approvals'],
      ['Test & refine', 'In the car, with live light'],
    ],
    full: [
      ['Trade-off: autosave presets?', 'No. Tap to load, long-press to save, so favourites never get silently overwritten.'],
      ['What in-car testing changed', 'Light lagged the screen, so light timing was tied to transitions — one of six fixes fed back into the spec.'],
      ['Two experience tiers', 'Fully useful signed out; signing in visibly adds AI tuning, B&O Radio and favourites.'],
      ['Light & motion spec', 'Light behaviour specified for every state, from start-up to soundscapes.'],
    ],
    stack: [
      { name: 'Align', stat: '2-day B&O workshop' },
      { name: 'Explore', stat: 'Gesture model · 2 tiers' },
      { name: 'Design', stat: 'Beosonic · AI · sign-in' },
      { name: 'Test & refine', stat: 'Validated in the car', src: img('bo-ai-result') },
    ],
    next: 'tello',
  },
  {
    slug: 'tello',
    num: '04',
    name: 'tello.ai',
    title: 'Twelve forms → one conversation.',
    oneLiner: 'Agentic AI assistant for Total Wireless',
    role: 'Experience Designer II',
    company: 'Verizon · Total Wireless',
    year: '2025',
    cover: img('cover-tello'),
    coverAspect: 960 / 620,
    chips: ['Experience Designer II', 'Verizon · Total Wireless', '2025 · A/B tested'],
    workMetric: '+7% conversion · 5× faster',
    metrics: [
      ['5×', 'faster plan selection'],
      ['+7%', 'conversion'],
      ['+12%', 'customer satisfaction'],
    ],
    tldr: [
      'Activation meant hunting for a 15-digit IMEI across 12+ form screens.',
      'An agent that asks one thing at a time and reads numbers with the camera.',
      'A/B test, 2,400 users: 5× faster, +7% conversion, −6% drop-off.',
    ],
    beforeAfter: { before: ['12', 'form screens'], after: ['1', 'conversation'], line: 'The agent does the copying; the customer just answers.' },
    highlights: [
      {
        title: 'Choosing, not filling in.',
        text: 'Plans and phones arrive as cards in the chat, and every choice stays pinned.',
        shots: [
          { src: img('tello-plans'), w: 1125, h: 2436, pins: [
            { x: 0.45, y: 0.62, label: 'Plans as cards' },
            { x: 0.5, y: 0.27, label: 'Agent recommends' },
          ] },
          { src: img('tello-phones'), w: 1125, h: 2436, pins: [
            { x: 0.5, y: 0.43, label: 'Choice pinned' },
            { x: 0.3, y: 0.62, label: 'Deals after intent' },
          ] },
        ],
      },
      {
        title: 'The camera does the copying.',
        text: 'IMEI, SIM and PIN are scanned off the box — with manual entry one tap away.',
        shots: [
          { src: img('tello-scan'), w: 1125, h: 2436, pins: [
            { x: 0.5, y: 0.5, label: 'Reads the IMEI' },
            { x: 0.88, y: 0.93, label: 'Upload or type' },
          ] },
          { src: img('tello-pin'), w: 1125, h: 2436 },
        ],
      },
    ],
    impact: {
      tag: 'A/B test · 2,400 users · 4 weeks',
      bars: { label: 'Time to choose a plan', before: 15, after: 2.8, beforeText: '15 min', afterText: '2.8 min' },
      tiles: [
        ['+7%', 'conversion'],
        ['+12%', 'customer satisfaction'],
        ['−6%', 'funnel drop-off'],
      ],
      method: 'Random split vs. the existing flow; CSAT from a post-purchase survey. The activation flow was prototyped, not A/B tested.',
    },
    process: [
      ['Audit', 'Mapped today’s flows'],
      ['Script', 'Conversation before UI'],
      ['Design', 'Scanning, stepper, rich cards'],
      ['Tell the story', 'Prototype for leadership'],
    ],
    full: [
      ['Trade-off: why not open chat?', 'Open chat makes people guess what to ask. A guided agent keeps “ask anything” but makes the happy path effortless.'],
      ['Designing for failure', 'Every scan offers rescan, type it in, or reach a human.'],
      ['Method & caveats', '2,400 users over 4 weeks, random split. Four weeks can include novelty effects.'],
      ['What I learned', 'Agents still need structure — steppers, pinned facts and cards are what make AI feel trustworthy.'],
    ],
    stack: [
      { name: 'Audit', stat: '12+ form screens mapped' },
      { name: 'Script', stat: 'Conversation first' },
      { name: 'Design', stat: '20+ states · 3 scan flows' },
      { name: 'Tell the story', stat: 'A/B · 2,400 users', src: img('cover-tello') },
    ],
    next: 'bracket',
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);

export const allImages = Array.from(
  new Set(
    projects.flatMap((p) => [p.cover, ...p.stack.flatMap((l) => (l.src ? [l.src] : []))]),
  ),
);
