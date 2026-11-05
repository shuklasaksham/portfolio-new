// Condensed copy used on the mobile case-study frames ("M — Case · …" in Figma).
type Pin = [number, number, string];
type Img = [string, number, number, Pin[]];
export type MobileCase = {
  title: string;
  chips: string[];
  metrics: [string, string][];
  phases: [string, string, string];
  tldr: [string, string, string];
  ba: [string, string, string, string, string];
  hl: { h: string; s: string; imgs: Img[] }[];
  impact: { tag: string; bars?: [string, number, number, string, string]; tiles: [string, string][] };
  full: [string, string][];
  next: string;
};
const im = (n: string) => `/img/${n}.webp`;

export const mobileCase: Record<string, MobileCase> = {
  bracket: {
    title: 'An AI memory people can trust.', chips: ['Founder · Product Designer', '2026 · Live'],
    metrics: [['148', 'users'], ['173', 'screens'], ['53', 'components']], phases: ['Frame', 'Structure', 'Design'],
    tldr: ['Decisions get lost inside email and Slack threads.', 'An AI loop that asks a human before changing anything.', 'Live: 148 users, 115 projects.'],
    ba: ['5', 'alerts', '1', 'review', 'One email, five changes — one review.'],
    hl: [
      { h: 'Only decisions get your attention.', s: '“Needs you” is split from “just happened”.', imgs: [[im('attention'), 1200, 780, [[0.25, 0.3, 'Decisions only'], [0.85, 0.36, 'Changes by category'], [0.33, 0.8, 'Promises from threads']]]] },
      { h: 'A change is a diff, not an alert.', s: 'Nothing changes until you accept.', imgs: [[im('review'), 1200, 780, [[0.35, 0.47, 'Exact source sentence'], [0.9, 0.36, 'Confidence on every claim'], [0.9, 0.955, 'You approve, not the AI']]]] },
      { h: 'Every claim shows its receipts.', s: 'Any memory opens its source quote.', imgs: [[im('evidence'), 588, 382, [[0.22, 0.42, 'Discovered categories'], [0.85, 0.27, 'Quote in context']]]] },
    ],
    impact: { tag: 'live v0.4', tiles: [['148', 'users'], ['115', 'projects'], ['18', 'completed'], ['90', 'questions']] },
    full: [['Research & principles', '19 scenario areas, 8 principles.'], ['The key trade-off', 'No auto-apply: trust is the product.'], ['What I’d do next', 'Tune confidence with real accept rates.']],
    next: 'One Audio',
  },
  'one-audio': {
    title: 'Making sound you can see.', chips: ['HARMAN × Harman Kardon', 'CES 2025'],
    metrics: [['65%', 'faster setup'], ['+13%', 'multi-device'], ['4.2', 'rating']], phases: ['Define', 'Design', 'Bring to life'],
    tldr: ['Premium hardware is invisible to CES visitors.', 'The demo script became the user journey.', 'Shown at CES 2025 on 3 cars, 5 displays.'],
    ba: ['5', 'displays', '1', 'app', 'Rules, not redesigns.'],
    hl: [
      { h: 'The hardware is the interface.', s: 'Speakers shown inside 3D seats.', imgs: [[im('oa-seatsonic'), 1920, 1080, [[0.68, 0.45, 'Speakers in seats'], [0.11, 0.72, 'One seat or all'], [0.31, 0.62, 'Taste, not EQ']]]] },
      { h: 'A mood takes over the cabin.', s: 'Sound, light and visuals in one tap.', imgs: [[im('oa-mood-coast'), 1920, 1080, [[0.5, 0.26, 'One tap to start'], [0.5, 0.47, 'Spheres preview scenes']]]] },
      { h: 'One app, five screens.', s: 'Anchored UI, independent backgrounds.', imgs: [[im('oa-car1'), 2017, 756, [[0.1, 0.22, 'Background scales alone'], [0.47, 0.5, 'Anchored UI']]]] },
    ],
    impact: { tag: 'usability validation', bars: ['Device setup time', 100, 35, 'Baseline', '65% faster'], tiles: [['+13%', 'multi-device'], ['4.2', 'satisfaction']] },
    full: [['Demo-first reframe', '15 steps, 5:40, 10–30 s each.'], ['Light that listens', '5 themes, 2 mechanisms.'], ['Craft & QA', 'Pixel-level fixes to demo day.']],
    next: 'Hyundai × B&O',
  },
  'hyundai-bo': {
    title: 'Shaping sound by feel.', chips: ['HARMAN × Hyundai × B&O', '2024'],
    metrics: [['40%', 'faster'], ['3 → 1', 'layers'], ['76%', 'satisfied']], phases: ['Align', 'Explore', 'Design'],
    tldr: ['An equaliser means nothing to most drivers.', 'One gesture, AI in plain words, one-QR sign-in.', 'In-car: 40% faster, 10% less distraction.'],
    ba: ['3', 'layers', '1', 'gesture', 'One dot instead of three menus.'],
    hl: [
      { h: 'Move one dot to shape sound.', s: 'Feel-based axes replace EQ sliders.', imgs: [[im('bo-beosonic'), 1600, 1000, [[0.5, 0.49, 'The dot is the sound'], [0.5, 0.17, 'Feel-based axes'], [0.29, 0.81, 'Safe presets']]]] },
      { h: 'Ask for a sound in plain words.', s: 'AI answers on the same circle.', imgs: [[im('bo-ai'), 1600, 1000, [[0.27, 0.81, 'Plain-language ask'], [0.5, 0.5, 'Same map'], [0.87, 0.17, 'One-tap undo']]]] },
      { h: 'Sign in without typing.', s: 'One QR installs the app and pairs the car.', imgs: [[im('bo-signin'), 2946, 1600, [[0.27, 0.45, 'Benefits first'], [0.45, 0.68, 'One QR, two jobs']]]] },
    ],
    impact: { tag: 'in-car prototype', bars: ['Navigation depth', 3, 1, '3 layers', '1 layer'], tiles: [['40%', 'faster'], ['10%', 'less distraction']] },
    full: [['Autosave presets?', 'No — long-press to save.'], ['In-car findings', 'Light timing tied to transitions.'], ['Two tiers', 'Useful signed out; richer signed in.']],
    next: 'tello.ai',
  },
  tello: {
    title: 'Twelve forms → one conversation.', chips: ['Verizon · Total Wireless', '2025 · A/B'],
    metrics: [['5×', 'faster'], ['+7%', 'conversion'], ['+12%', 'CSAT']], phases: ['Audit', 'Script', 'Design'],
    tldr: ['Activation meant 12+ form screens and a 15-digit IMEI.', 'An agent that asks one thing at a time and scans numbers.', 'A/B, 2,400 users: 5× faster, +7% conversion.'],
    ba: ['12', 'screens', '1', 'chat', 'The agent does the copying.'],
    hl: [
      { h: 'Choosing, not filling in.', s: 'Plans arrive as cards; choices stay pinned.', imgs: [[im('tello-plans'), 1125, 2436, [[0.45, 0.62, 'Plans as cards']]], [im('tello-phones'), 1125, 2436, [[0.5, 0.43, 'Choice pinned']]]] },
      { h: 'The camera does the copying.', s: 'IMEI scanned off the box; typing is the fallback.', imgs: [[im('tello-scan'), 1125, 2436, [[0.5, 0.5, 'Reads the IMEI']]], [im('tello-pin'), 1125, 2436, []]] },
    ],
    impact: { tag: '2,400 users · 4 weeks', bars: ['Time to choose a plan', 15, 2.8, '15 min', '2.8 min'], tiles: [['+7%', 'conversion'], ['−6%', 'drop-off']] },
    full: [['Why not open chat?', 'Guided beats guessing what to ask.'], ['Designing for failure', 'Rescan, type, or reach a human.'], ['Method & caveats', 'Random split; UC2 prototyped only.']],
    next: 'Bracket 2.0',
  },
};
