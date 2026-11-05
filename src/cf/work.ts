// Portfolio content, in the agreed order and depth:
// 3 full case studies, 2 medium, 1 concept.
// Sources: Figma "Portfolio — Case Studies" (tello.ai, B&O, Bracket, One Audio),
// "Darpan – App Design" and "RelayOS — Product Design". Keep numbers in sync with those files.

const img = (name: string) => `/img/${name}.webp`;

export type Tier = 'deep' | 'medium' | 'concept';
export type Shot = { src: string; w: number; h: number; alt: string };
export type Block = { title: string; text: string; tradeoff?: string; shots?: Shot[] };
export type Outcome = {
  tag: string;
  bars?: { label: string; before: number; after: number; beforeText: string; afterText: string };
  tiles: [string, string][];
  method: string;
};

export type Work = {
  slug: string;
  num: string;
  tier: Tier;
  name: string;
  line: string;
  context: string;
  role: string;
  year: string;
  result: string;
  shows: string;
  title: string;
  summary: string;
  facts: [string, string][];
  cover: Shot[];
  brief: [string, string][];
  problem: string;
  scope?: string[];
  process?: [string, string][];
  blocks: Block[];
  outcome?: Outcome;
  learned?: [string, string][];
  extra?: { title: string; items: [string, string][] }[];
  next: string;
};

const phone = (name: string, alt: string): Shot => ({ src: img(name), w: 390, h: 844, alt });
const tall = (name: string, alt: string): Shot => ({ src: img(name), w: 1125, h: 2436, alt });

export const work: Work[] = [
  {
    slug: 'tello',
    num: '01',
    tier: 'deep',
    name: 'tello.ai',
    line: 'Twelve forms became one conversation',
    context: 'Shipped at Verizon · A/B tested',
    role: 'Experience Designer II',
    year: '2025',
    result: '+7% conversion',
    shows: 'AI UX at enterprise scale',
    title: 'Twelve forms became one conversation.',
    summary:
      'An agentic assistant for Verizon’s Total Wireless that replaces a 12-screen activation form with a guided conversation — and reads the IMEI, SIM and PIN off the box with the camera.',
    facts: [
      ['Role', 'Experience Designer II · end to end, research to high-fidelity UI'],
      ['Worked with', 'Product managers and engineers'],
      ['Year', '2025'],
      ['Status', 'Plan selection A/B tested · activation prototyped'],
    ],
    cover: [tall('tello-plans', 'Plans shown as cards in the chat'), tall('tello-phones', 'Phone choice pinned in the chat'), tall('tello-scan', 'Camera reading the IMEI'), tall('tello-pin', 'Plan PIN step')],
    brief: [
      ['5×', 'faster plan selection'],
      ['+7%', 'conversion'],
      ['+12%', 'customer satisfaction'],
    ],
    problem:
      'Activating a phone meant hunting for a 15-digit IMEI across 12+ form screens, and choosing a plan took around 15 minutes. People dropped out of the funnel at exactly the steps that asked them to copy numbers.',
    scope: [
      'Led design end to end, from auditing today’s flows to high-fidelity UI and a prototype for leadership.',
      'Wrote the conversation before drawing a screen, then designed the stepper, rich cards and three scan flows (20+ states).',
      'Extended the assistant from plan selection into an agentic activation flow.',
    ],
    process: [
      ['Audit', 'Mapped today’s flows: 12+ form screens'],
      ['Script', 'Wrote the conversation before the UI'],
      ['Design', 'Scanning, stepper, rich cards · 20+ states'],
      ['Tell the story', 'Prototype for leadership'],
    ],
    blocks: [
      {
        title: 'A guided agent, not an open chat.',
        text: 'Plans and phones arrive as cards inside the conversation, and every choice stays pinned so nobody loses their place.',
        tradeoff: 'Open chat makes people guess what to ask. A guided agent keeps “ask anything” available but makes the happy path effortless.',
        shots: [tall('tello-plans', 'Plans arrive as cards'), tall('tello-phones', 'The chosen phone stays pinned')],
      },
      {
        title: 'The camera does the copying.',
        text: 'IMEI, SIM and PIN are scanned off the box instead of typed, so the slowest part of the old form disappears.',
        tradeoff: 'Every scan is designed for failure: rescan, type it in, or reach a human — one tap each.',
        shots: [tall('tello-scan', 'Scanning the IMEI'), tall('tello-pin', 'Entering the plan PIN')],
      },
    ],
    outcome: {
      tag: 'A/B test · 2,400 users · 4 weeks',
      bars: { label: 'Time to choose a plan', before: 15, after: 2.8, beforeText: '15 min', afterText: '2.8 min' },
      tiles: [
        ['+7%', 'conversion'],
        ['+12%', 'customer satisfaction'],
        ['−6%', 'funnel drop-off'],
      ],
      method: 'Random split against the existing flow; CSAT from a post-purchase survey. Four weeks can include novelty effects. The activation flow was prototyped, not A/B tested.',
    },
    learned: [
      ['Agents still need structure', 'Steppers, pinned facts and cards are what make an AI flow feel trustworthy — not the chat itself.'],
    ],
    next: 'darpan',
  },
  {
    slug: 'darpan',
    num: '02',
    tier: 'deep',
    name: 'DarpanAI',
    line: 'An AI video director in your pocket',
    context: 'Independent product · 0 → 1',
    role: 'Product designer · end to end',
    year: '',
    result: 'Idea → reel in ~5 min',
    shows: '0 → 1 AI product development',
    title: 'From an idea to a finished reel in five minutes.',
    summary:
      'DarpanAI is an AI video director for everyday creators in India. Say what your video is about in Hindi, Hinglish or English; it plans the shots, coaches you out loud, scores every take and edits the reel for you.',
    facts: [
      ['Role', 'Product, flows and UI, end to end'],
      ['Platform', 'Mobile app'],
      ['Languages', 'Hindi, Hinglish, English'],
      ['Status', 'MVP flow designed · 9 screens + journey map'],
    ],
    cover: [phone('darpan-plan', 'Shot plan'), phone('darpan-check', 'Live check before recording'), phone('darpan-report', 'Take report with score'), phone('darpan-ready', 'Finished video')],
    brief: [
      ['~5 min', 'from an idea to a finished reel'],
      ['3', 'languages, including Hinglish'],
      ['0', 'logins or editing skills needed'],
    ],
    problem:
      'Home cooks, shop owners and students know what they want to say, not what to shoot. Planning, delivery and editing are three separate skills, so most attempts end in long unplanned takes full of “umm” and “matlab” — and an unfinished edit.',
    scope: [
      'Defined the product loop: plan → check → record → report → keep → make.',
      'Designed the 9-screen MVP flow and the journey map of what the user does, what Darpan does and how each step should feel.',
      'Wrote the in-app copy, including spoken coaching in Hindi and a take report that explains every score.',
    ],
    process: [
      ['Start', 'Say or type the idea, in any language'],
      ['Plan', 'A 5-shot plan with a line to say'],
      ['Check · Record', 'Spoken tips, then silence'],
      ['Report · Keep', 'Score each take, keep the best'],
      ['Make', 'Cut, join, caption, export'],
    ],
    blocks: [
      {
        title: 'A plan before the camera opens.',
        text: 'Darpan turns “Mummy’s mango pickle recipe” into five shots — hook, ingredients, mixing, taste test, ending — each with a line to say and a target length.',
        tradeoff: 'Templates (recipe, unboxing, shop offer) are offered, but typing or speaking the idea comes first, so the plan fits the person rather than the other way round.',
        shots: [phone('darpan-start', 'What’s your video about?'), phone('darpan-plan', 'Your shot plan')],
      },
      {
        title: 'Coach out loud, then go quiet.',
        text: 'Before recording, Darpan watches the camera and speaks one fix at a time — “खिड़की की तरफ़ मुड़िए, चेहरा अँधेरे में है” (turn toward the window, your face is dark).',
        tradeoff: 'While recording it stays silent and shows only small on-screen tips, so the creator can focus on talking.',
        shots: [phone('darpan-check', 'Check before recording')],
      },
      {
        title: 'Score the take, not the person.',
        text: 'Each take gets a score out of 100 and the two things to fix: filler words, speaking speed (aim for 130–150 a minute), long pauses, light and framing. The transcript highlights every “umm”.',
        tradeoff: 'The best take is kept automatically and progress is shown per shot, so a retake feels like improvement, not failure.',
        shots: [phone('darpan-report', 'Take report'), phone('darpan-done', 'Shot done, best take kept')],
      },
      {
        title: 'Editing disappears.',
        text: 'Darpan cuts the dead seconds, joins the best takes in order, adds Hinglish captions (most reels are watched on mute) and hands back one MP4 for Instagram and WhatsApp.',
        shots: [phone('darpan-ready', 'Your video is ready')],
      },
    ],
    outcome: {
      tag: 'Designed MVP · targets, not measured usage',
      tiles: [
        ['~5 min', 'idea to finished reel'],
        ['9', 'screens in the MVP flow'],
        ['3', 'languages: Hindi, Hinglish, English'],
      ],
      method: 'These describe the designed MVP flow. Add validation results here once they are in.',
    },
    extra: [
      {
        title: 'The journey, mapped',
        items: [
          ['You do', 'Say the idea → read the plan → fix the light → record → retake if needed → keep → tap “Make my video” → post.'],
          ['Darpan does', 'Understands the language → writes the plan → speaks tips → stays quiet → counts umms and checks speed → saves the best take → edits → exports.'],
          ['You feel', '“Easy. Nothing to learn.” → “Like having a director with me.” → “I didn’t have to edit anything.” → “Proud to post this.”'],
        ],
      },
    ],
    next: 'hyundai-bo',
  },
  {
    slug: 'hyundai-bo',
    num: '03',
    tier: 'deep',
    name: 'Bang & Olufsen',
    line: 'Shaping in-car sound by feel · Hyundai',
    context: 'HARMAN · validated in the car',
    role: 'Experience Designer',
    year: '2024',
    result: '−40% interaction time',
    shows: 'Premium automotive HMI',
    title: 'Shaping sound by feel, not by equaliser.',
    summary:
      'A new in-vehicle audio interaction model for a Hyundai × Audio by Bang & Olufsen concept: one feel-based gesture instead of three layers of sliders, AI tuning in plain words, and sign-in with a single QR code.',
    facts: [
      ['Role', 'Experience Designer, HARMAN'],
      ['Worked with', 'Bang & Olufsen, Hyundai, HARMAN engineering'],
      ['Year', '2024'],
      ['Status', 'Concept · validated in the car'],
    ],
    cover: [{ src: img('bo-beosonic'), w: 1600, h: 1000, alt: 'Beosonic sound circle' }],
    brief: [
      ['−40%', 'interaction time'],
      ['3 → 1', 'navigation layers'],
      ['76%', 'user satisfaction'],
    ],
    problem:
      'Premium audio usually means an equaliser: bass, treble and fader, three layers deep. That is meaningless to most drivers and distracting at speed — so the hardware’s quality goes unnoticed.',
    scope: [
      'Aligned with Bang & Olufsen in a 2-day workshop, then explored the gesture model and two experience tiers.',
      'Designed Beosonic, AI sound tuning and the sign-in flow, approved section by section.',
      'Tested in the car with live sound and ambient light, and fed six fixes back into the spec.',
    ],
    process: [
      ['Align', '2-day workshop with B&O'],
      ['Explore', 'Gesture model and two tiers'],
      ['Design', 'Section-by-section approvals'],
      ['Test & refine', 'In the car, with live light'],
    ],
    blocks: [
      {
        title: 'Move one dot to shape sound.',
        text: 'Bright–Warm and Relaxed–Energetic replace bass, treble and fader. The dot is the sound; safe preset modes sit underneath.',
        tradeoff: 'Presets don’t autosave. Tap to load, long-press to save — so favourites never get silently overwritten.',
        shots: [{ src: img('bo-beosonic'), w: 1600, h: 1000, alt: 'Beosonic: one dot on two feel-based axes' }],
      },
      {
        title: 'Ask for a sound in plain words.',
        text: '“I want an AC/DC sound mode” lands on the same circle, so the AI answer teaches the manual control instead of replacing it.',
        tradeoff: 'One tap to undo any AI change, so trying it costs nothing.',
        shots: [{ src: img('bo-ai'), w: 1600, h: 1000, alt: 'AI sound request shown on the same map' }],
      },
      {
        title: 'Sign in without typing in a car.',
        text: 'One QR code installs the app and pairs the car. The benefits are shown before the ask.',
        tradeoff: 'Two tiers: fully useful signed out; signing in visibly adds AI tuning, B&O Radio and favourites.',
        shots: [{ src: img('bo-signin'), w: 2946, h: 1600, alt: 'QR sign-in' }],
      },
    ],
    outcome: {
      tag: 'In-car prototype sessions · concept stage',
      bars: { label: 'Navigation depth to change sound', before: 3, after: 1, beforeText: '3 layers', afterText: '1 layer' },
      tiles: [
        ['40%', 'faster audio interactions'],
        ['76%', 'user satisfaction'],
        ['10%', 'less driver distraction'],
      ],
      method: 'Compared against the previous 3-layer audio settings model, with live sound and ambient light. A concept, not a production release.',
    },
    learned: [
      ['Test where it’s used', 'In the car, the light lagged the screen, so light timing was tied to transitions — one of six fixes that only showed up in the vehicle.'],
      ['Specify every state', 'Light behaviour was specified for every state, from start-up to soundscapes, so engineering never had to guess.'],
    ],
    next: 'bracket',
  },
  {
    slug: 'bracket',
    num: '04',
    tier: 'medium',
    name: 'Bracket',
    line: 'An AI memory people can trust',
    context: 'Independent product · live',
    role: 'Founder · Product Designer',
    year: '2026 – now',
    result: '148 users',
    shows: 'Complex SaaS · AI-native',
    title: 'An AI memory people can trust.',
    summary:
      'An AI decision OS for freelancers and small teams. It detects decisions — scope, dates, prices — inside email and Slack threads, then asks a human before updating anything.',
    facts: [
      ['Role', 'Founder · strategy, research and design'],
      ['Year', '2026 – now'],
      ['Scope', '173 screens · 53 components · 11 flows'],
      ['Status', 'Live · v0.4'],
    ],
    cover: [{ src: img('review'), w: 1200, h: 780, alt: 'Change review screen' }],
    brief: [
      ['148', 'users since launch'],
      ['115', 'projects created'],
      ['90', 'client questions generated'],
    ],
    problem: 'Decisions about scope, dates and prices get lost inside email and Slack threads, and nobody can say later who agreed to what.',
    scope: [
      'Led product strategy, research and design from concept to launch.',
      'Designed human-in-the-loop AI workflows: every AI claim shows its source and confidence, and nothing changes until a person accepts it.',
      'Built a tokenised design system (53 components) and 173 screens with clickable prototypes for handoff.',
    ],
    extra: [
      {
        title: 'Complexity handled',
        items: [
          ['19 scenario areas, 8 principles', '“Humans control change” and “Every claim has evidence” were used to test every layout.'],
          ['No auto-apply', 'One deliberate click per change, because one silently wrong price poisons every answer that depends on it.'],
          ['Platform, not template', 'I ran a polo manufacturer’s orders through the same screens to prove the model generalises.'],
        ],
      },
    ],
    blocks: [
      { title: 'Only decisions get your attention.', text: 'The overview splits “needs you” from “just happened”, so nothing urgent hides in a feed.', shots: [{ src: img('attention'), w: 1200, h: 780, alt: 'Overview: needs you vs just happened' }] },
      { title: 'A change is a diff, not an alert.', text: 'Source on the left, AI interpretation on the right, confidence on every claim. Nothing changes until you accept.', shots: [{ src: img('review'), w: 1200, h: 780, alt: 'Change review' }] },
    ],
    outcome: {
      tag: 'Live since 2026 · v0.4',
      tiles: [
        ['148', 'freelancers and teams'],
        ['115', 'projects created'],
        ['18', 'projects completed'],
        ['90', 'client questions generated'],
      ],
      method: 'Cumulative product analytics since launch: accounts and workspace activity, not survey data.',
    },
    next: 'one-audio',
  },
  {
    slug: 'one-audio',
    num: '05',
    tier: 'medium',
    name: 'Harman Kardon',
    line: 'One Audio · shown at CES 2025',
    context: 'HARMAN · CES 2025',
    role: 'Associate Experience Designer',
    year: '2024',
    result: '65% faster setup',
    shows: 'Automotive UX · design systems',
    title: 'Making sound you can see.',
    summary:
      'One Audio, a connected multi-device audio experience for Harman Kardon, showcased in HARMAN’s AutoOne cockpit at CES 2025 — one app across five in-car display formats.',
    facts: [
      ['Role', 'Associate Experience Designer, HARMAN'],
      ['Year', '2024'],
      ['Scope', '3 cars · 5 display formats · 15-step demo'],
      ['Status', 'Shown at CES 2025'],
    ],
    cover: [{ src: img('oa-seatsonic'), w: 1920, h: 1080, alt: 'Seatsonic 3D seats' }],
    brief: [
      ['65%', 'faster device setup'],
      ['+13%', 'multi-device usage'],
      ['CES', '2025 show floor'],
    ],
    problem: 'Premium audio hardware is invisible, and CES visitors get about six noisy minutes in the car.',
    scope: [
      'Treated the 15-step, 5:40 guided demo as the user journey, giving each step a 10–30 second time budget.',
      'Designed Home, Media, Mood, Sound and System, and the adaptation rules that let one app reflow to five display formats.',
      'Reviewed every build side by side with the design and logged pixel-level fixes until demo day.',
    ],
    extra: [
      {
        title: 'Complexity handled',
        items: [
          ['Rules, not redesigns', 'Background and UI scale separately and anchor to stage positions, so no car needed its own redesign.'],
          ['Light that listens', 'Five light themes on two mechanisms: speed follows amplitude, layers follow beats.'],
          ['The key trade-off', 'Pre-rendered light video driven by music data instead of real-time generation — cinematic and predictable on demo hardware.'],
        ],
      },
    ],
    blocks: [
      { title: 'The hardware is the interface.', text: 'Seats render in 3D with their speakers in place, so visitors see why it sounds different.', shots: [{ src: img('oa-seatsonic'), w: 1920, h: 1080, alt: '3D seats with speakers' }] },
      { title: 'A mood takes over the cabin.', text: 'One tap changes sound, light and visuals across three screens at once.', shots: [{ src: img('oa-mood-coast'), w: 1920, h: 1080, alt: 'Mood selection' }] },
    ],
    outcome: {
      tag: 'Usability validation · CES 2025',
      bars: { label: 'Device setup time', before: 100, after: 35, beforeText: 'Baseline', afterText: '65% faster' },
      tiles: [
        ['+13%', 'multi-device usage'],
        ['4.2', 'prototype satisfaction'],
      ],
      method: 'Prototype usability validation, not production analytics.',
    },
    next: 'relayos',
  },
  {
    slug: 'relayos',
    num: '06',
    tier: 'concept',
    name: 'RelayOS',
    line: 'Voice AI that recovers delayed orders',
    context: 'Concept · not shipped',
    role: 'Product strategy and design',
    year: '',
    result: '1 voice note → 1 plan',
    shows: 'Systems thinking · voice AI',
    title: 'One voice note to recover a delayed order.',
    summary:
      'A concept for Indian manufacturers. When an order slips, the owner sends one WhatsApp voice note. RelayOS calls the supplier, transporter and floor in their own languages, connects what each of them says, and sends back one recovery plan to approve.',
    facts: [
      ['Type', 'Concept · not shipped'],
      ['Surfaces', 'WhatsApp, phone calls, web app'],
      ['Languages', 'Hindi, Tamil, Telugu, English'],
      ['Scope', '46 screens · 5 prototype flows · full handoff'],
    ],
    cover: [{ src: img('relay-run'), w: 1440, h: 1261, alt: 'Live run view' }],
    brief: [
      ['11 min', 'of calls in the example run'],
      ['1 tap', 'owner effort to approve the plan'],
      ['4', 'languages in one run'],
    ],
    problem:
      'One late order means twenty phone calls and no clear answer. The supplier knows the material, the transporter knows the truck, the floor knows the capacity — and they speak Tamil, Hindi and Telugu. Promises are made on calls and forgotten.',
    process: [
      ['Tell it', 'A voice note, or a risk alert from a check-in call'],
      ['It calls', 'Supplier in Tamil, transporter in Hindi, dispatch in Telugu'],
      ['You decide', 'One message: cause, who promised what, one decision'],
      ['It follows through', 'Checks in as each promise comes due; re-plans on a slip'],
    ],
    blocks: [
      {
        title: 'The owner never leaves WhatsApp.',
        text: 'A voice note starts a run. Eleven minutes later one message comes back: the cause, the plan, and the single decision that needs the owner — Approve, Reject or Call me.',
        shots: [phone('relay-voice', 'Owner reports a delay by voice note'), phone('relay-plan', 'Recovery plan and approval')],
      },
      {
        title: 'Every call informs the next.',
        text: 'The live run view shows the order map re-planning as calls finish, each call’s transcript in the original language with a translation, and the cross-checks that make the plan safe to approve.',
        shots: [{ src: img('relay-run'), w: 1440, h: 1261, alt: 'Live run view with order map, calls and decision' }],
      },
    ],
    extra: [
      {
        title: 'Trust rules, designed in',
        items: [
          ['Says it’s an AI on every call', '“I’m RelayOS, an AI assistant calling for Kaveri Fabricators. This call is recorded.”'],
          ['Money always comes to the owner', 'Prices, payments and cancellations need a tap. It never negotiates.'],
          ['Never assumes a yes', 'No reply means it waits, reminds once, then holds.'],
          ['Only calls approved contacts', 'Contacts get a forwarded intro from the owner first, and can opt out with one word.'],
        ],
      },
      {
        title: 'Built for the real constraints',
        items: [
          ['WhatsApp platform rules', 'Max 3 reply buttons of 20 characters; list messages beyond that; utility templates outside the 24-hour window.'],
          ['Indic scripts', 'Tamil and Telugu run up to ~40% longer, so every text box wraps and nothing truncates mid-word.'],
          ['Every state', 'Loading, empty, error and offline specified for every surface, plus 6 branches and 4 error flows.'],
        ],
      },
    ],
    next: 'tello',
  },
];

export const getWork = (slug?: string) => work.find((w) => w.slug === slug);

export const groups: { title: string; note: string; tier: Tier }[] = [
  { title: 'Case studies', note: 'Full reads: process, decisions, trade-offs and outcomes.', tier: 'deep' },
  { title: 'More work', note: 'Shorter reads: my contribution and the complexity handled.', tier: 'medium' },
  { title: 'Concept', note: 'Not shipped. Shown for systems and product thinking.', tier: 'concept' },
];
