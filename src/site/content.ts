// Copy for the site shell (home, about, résumé, side projects).
// Facts come from data/profile.ts and data/projects.ts — keep them in sync.

const img = (name: string) => `/img/${name}.webp`;

export const hero = {
  lines: ['Product Designer', 'crafting'],
  script: 'trustworthy',
  last: 'AI experiences.',
  paras: [
    'Experience Designer II at Verizon, previously HARMAN. 4.5+ years designing AI, conversational and in-vehicle products for Verizon, Total Wireless, Harman Kardon and Bang & Olufsen.',
    'Specialising in agentic AI, conversational UX and multi-screen automotive HMI. Work shown at CES 2025.',
  ],
};

export type Cover = {
  bg: string;
  brand: string;
  metric: string;
  caption: string;
  shots: string[];
  kind: 'phones' | 'screen';
};

export type Featured = { slug: string; title: [string, string]; desc: string; cover: Cover };

export const featured: Featured[] = [
  {
    slug: 'tello',
    title: ['tello.ai', 'Agentic Assistant'],
    desc: 'Designed an AI assistant for Verizon’s Total Wireless that turns a 12-screen activation form into one guided conversation. A/B tested with 2,400 users: plan selection 5× faster, conversion +7%, CSAT +12%.',
    cover: { bg: '#7fd8db', brand: 'Verizon · Total Wireless', metric: '+7%', caption: 'conversion · A/B test, 2,400 users', shots: [img('tello-plans'), img('tello-phones')], kind: 'phones' },
  },
  {
    slug: 'one-audio',
    title: ['One Audio', 'Harman Kardon'],
    desc: 'Designed a connected multi-device audio experience for Harman Kardon, showcased in HARMAN’s AutoOne cockpit at CES 2025 — one app across five in-car screens, with 65% faster device setup.',
    cover: { bg: '#fee1d1', brand: 'HARMAN · Harman Kardon', metric: 'CES 2025', caption: 'shown in the AutoOne cockpit', shots: [img('oa-hero')], kind: 'screen' },
  },
  {
    slug: 'hyundai-bo',
    title: ['Hyundai ×', 'Bang & Olufsen'],
    desc: 'Redesigned the in-vehicle audio interaction model for a Hyundai × Bang & Olufsen concept. Validated in the car: navigation flattened from 3 layers to 1 and interaction time cut by 40%.',
    cover: { bg: '#a9b4ff', brand: 'HARMAN × Hyundai × B&O', metric: '−40%', caption: 'interaction time, tested in the car', shots: [img('bo-ai-result')], kind: 'screen' },
  },
];

export const side: Featured = {
  slug: 'bracket',
  title: ['Bracket', 'Decision OS'],
  desc: 'Founded and designed an AI decision OS for freelancers and small teams: human-in-the-loop AI that turns messy client conversations into clear decisions. Research to live beta, with 148 users so far.',
  cover: { bg: '#b3f5a0', brand: 'Bracket · Founder', metric: '148', caption: 'users on the live beta', shots: [img('overview')], kind: 'screen' },
};

export const brands = ['Verizon', 'HARMAN', 'Harman Kardon', 'Bang & Olufsen', 'Hyundai', 'Total Wireless', 'CES 2025'];

export const whyMe: { title: string; text: string; proof: [string, string]; bg: string }[] = [
  {
    title: 'I script the conversation before the screen.',
    text: 'For tello.ai I wrote every turn of the dialogue before drawing a pixel. It went to an A/B test with 2,400 users and lifted conversion by 7%.',
    proof: ['tello.ai', 'tello'],
    bg: '#7b8dff',
  },
  {
    title: 'I design for the real moment of use.',
    text: 'Arm’s length, five screens, a moving car. For CES 2025 the demo script was the user journey, so that is what I designed.',
    proof: ['One Audio', 'one-audio'],
    bg: '#b3f5a0',
  },
  {
    title: 'I make AI earn people’s trust.',
    text: 'AI proposes; people decide. Every AI claim in Bracket shows its evidence and confidence, with an easy way back.',
    proof: ['Bracket', 'bracket'],
    bg: '#99a3f0',
  },
  {
    title: 'I simplify until it can be felt.',
    text: 'For Hyundai × B&O I collapsed three layers of audio settings into one gesture: 40% faster, validated in the car.',
    proof: ['Hyundai × B&O', 'hyundai-bo'],
    bg: '#fee1d1',
  },
  {
    title: 'I take design all the way to ship.',
    text: 'Token-based systems, dev-ready specs and pixel-level QA side by side with engineering, from HARMAN to my own 0 → 1 product.',
    proof: ['One Audio', 'one-audio'],
    bg: '#cdf3f7',
  },
];

export const about = {
  quote: ['“Design for', 'the real moment', 'of use.”'],
  intro: [
    'Product designer with 4.5+ years leading end-to-end design for AI-powered, conversational and in-vehicle products — today as Experience Designer II at Verizon, before that at HARMAN, and as founder of Bracket, an AI-native decision OS.',
    'I started in cars. At HARMAN I designed for Harman Kardon, Hyundai and Bang & Olufsen: experiences that have to work at arm’s length, across five displays, in a moving vehicle. One of them, One Audio, was shown in HARMAN’s AutoOne cockpit at CES 2025.',
    'Now I design AI. At Verizon I designed tello.ai for Total Wireless, an agent that replaces a 12-screen activation form with one conversation. In a 4-week A/B test with 2,400 users, plan selection became 5× faster and conversion rose 7%.',
    'On the side I built Bracket, a human-in-the-loop AI tool for freelancers and small teams, taking it from research to a live beta with 148 users.',
  ],
  closing: 'Based in India and working remotely. The fastest way to reach me is email.',
};

export const resumeQuote = ['“AI proposes;', 'people decide.”'];
