// Site content, copied from the Figma page "Website — A3 Swiss dossier (final)".
// Every number carries its source. Keep this file and the Figma frames in sync.

const img = (name: string) => `/img/${name}.webp`;

export type Shot = { src: string; w: number; h: number; alt: string };
export type Stat = { n: string; label: string; source: string };
export type Callout = { label: string; text: string };

export type Decision = {
  label: string;
  title: string;
  context: string;
  rejected?: [string, string];
  chosen?: [string, string];
  tradeoff?: string;
  shots?: Shot[];
};

export type Outcome = {
  tag: string;
  gauge?: { n: string; label: string; fill: number; source: string }[];
  bars?: { label: string; before: number; after: number; beforeText: string; afterText: string };
  tiles?: Stat[];
  method: string;
  callouts?: Callout[];
};

export type Section =
  | { kind: 'lede'; title: string; text: string }
  | { kind: 'list'; title: string; items: string[] }
  | { kind: 'steps'; title: string; steps: [string, string][] }
  | { kind: 'decisions'; title: string; items: Decision[] }
  | { kind: 'pairs'; title: string; items: [string, string][] }
  | { kind: 'image'; title: string; shot: Shot; caption: string }
  | { kind: 'outcome'; title: string; outcome: Outcome }
  | { kind: 'results'; title: string; status: Callout; listLabel: string; items: string[]; callouts?: Callout[] };

export type Tier = 'deep' | 'medium' | 'concept';

export type Case = {
  slug: string;
  num: string;
  tier: Tier;
  name: string;
  title: string;
  accent: string; // the part of the title set in Newsreader italic
  summary: string;
  facts: [string, string][];
  brief: { problem: string; did: string; result: Stat };
  cover: { phones: Shot[] } | { wide: Shot; gauge?: { n: string; label: string; fill: number } };
  sections: Section[];
  card: { result: string; line: string; meta: string };
  /** The decision that was the designer's own call — only where that is documented. */
  myCall?: string;
  next: string;
};

export const TIER_TAG: Record<Tier, string> = {
  deep: 'Case study',
  medium: 'More work',
  concept: 'Concept — not shipped',
};

const phone = (name: string, alt: string): Shot => ({ src: img(name), w: 390, h: 844, alt });
const tall = (name: string, alt: string): Shot => ({ src: img(name), w: 900, h: 1949, alt });
const wide = (name: string, w: number, h: number, alt: string): Shot => ({ src: img(name), w, h, alt });

export const profile = {
  name: 'Saksham Shukla',
  email: 'shuklasaksham01@gmail.com',
  linkedin: 'https://linkedin.com/in/saksham-shuklaa',
  linkedinLabel: 'linkedin.com/in/saksham-shuklaa',
  location: 'Hyderabad, India',
  summary:
    'Product designer with 4.5+ years designing AI-powered, conversational and in-vehicle products at Verizon and HARMAN. Outside work, I design and launch my own AI products end to end.',
};

export const cases: Case[] = [
  {
    slug: 'tello',
    num: '01',
    tier: 'deep',
    name: 'tello.ai',
    title: 'A plan in 2.8 minutes, not 15.',
    accent: '2.8 minutes',
    summary:
      'An agentic assistant for Verizon’s Total Wireless. The plan-selection conversation shipped and was A/B tested. The activation flow — one conversation instead of a 12-screen form, reading the IMEI, SIM and PIN off the box with the camera — was prototyped, not tested.',
    facts: [
      ['Role', 'Experience Designer II'],
      ['Worked with', 'Designers, product managers and engineers'],
      ['Year', '2025'],
      ['Status', 'Plan selection A/B tested · activation prototyped'],
    ],
    brief: {
      problem: 'Activation meant hunting for a 15-digit IMEI across 12+ form screens; choosing a plan took about 15 minutes.',
      did: 'With the team, designed a guided agent with plan cards (A/B tested) and a camera activation flow (prototype).',
      result: { n: '+7%', label: 'conversion, with plan selection 5× faster (15 → 2.8 min)', source: 'A/B test · 2,400 users · 4 weeks' },
    },
    cover: { wide: wide('cover-tello', 1920, 1240, 'tello.ai screens: the assistant home, the guided conversation, camera scanning (prototype) and the account view') },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'People dropped out at exactly the steps that asked them to copy numbers. The brief was an AI assistant — the risk was an open chat that leaves customers guessing what to ask.',
      },
      {
        kind: 'list',
        title: 'My role and scope',
        items: [
          'Part of a team of designers, PMs and engineers. My focus: cutting the steps a customer takes and simplifying the experience — from auditing today’s flows to high-fidelity UI.',
          'Wrote the conversation before drawing a screen, then designed the stepper, rich cards and three scan flows (20+ states).',
          'Extended the assistant from plan selection into an agentic activation flow.',
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decisions',
        items: [
          {
            label: 'Decision 01',
            title: 'A guided agent, not an open chat.',
            context: 'Customers arrive to do one job: pick a plan and a phone, then activate. Most don’t know what to ask an assistant.',
            rejected: ['Open chat — “Ask me anything”', 'People have to guess what to type, and the happy path gets lost in back-and-forth.'],
            chosen: ['Guided agent with cards and pinned choices', 'One question at a time; plans arrive as cards and every choice stays pinned, while “ask anything” stays available.'],
            tradeoff: 'Less free-form on the first turn, in exchange for a path nobody gets lost on.',
            shots: [tall('tello-plans', 'Plans arrive as cards'), tall('tello-phones', 'The chosen phone stays pinned')],
          },
          {
            label: 'Decision 02',
            title: 'The camera does the copying.',
            context: 'The slowest steps asked people to find and type a 15-digit IMEI, a SIM number and a plan PIN.',
            rejected: ['Keep typed form fields', 'Today’s flow: long numbers copied by hand, where people stall and drop out.'],
            chosen: ['Scan the numbers off the box', 'The agent reads IMEI, SIM and PIN with the camera and fills them in.'],
            tradeoff: 'Scans can fail, so every scan offers rescan, type it in, or reach a human — one tap each.',
            shots: [tall('tello-scan', 'Scanning the IMEI'), tall('tello-pin', 'Entering the plan PIN')],
          },
        ],
      },
      {
        kind: 'steps',
        title: 'Process',
        steps: [
          ['Audit', 'Mapped today’s flows: 12+ form screens'],
          ['Script', 'Wrote the conversation before the UI'],
          ['Design', 'Scanning, stepper, rich cards · 20+ states'],
          ['Tell the story', 'Prototype for leadership'],
        ],
      },
      {
        kind: 'outcome',
        title: 'Outcome',
        outcome: {
          tag: 'A/B test · 2,400 users · 4 weeks',
          bars: { label: 'Time to choose a plan', before: 15, after: 2.8, beforeText: '15 min', afterText: '2.8 min' },
          tiles: [
            { n: '+7%', label: 'conversion', source: 'A/B test vs existing flow' },
            { n: '+12%', label: 'customer satisfaction', source: 'Post-purchase CSAT survey' },
            { n: '−6%', label: 'funnel drop-off', source: 'A/B test vs existing flow' },
          ],
          method:
            'Random split against the existing flow over 4 weeks; CSAT from a post-purchase survey. Four weeks can include novelty effects. The activation flow was prototyped, not A/B tested. These are team results; my part is under “My role and scope”.',
        },
      },
      {
        kind: 'pairs',
        title: 'What I learned',
        items: [['Agents still need structure', 'Steppers, pinned facts and cards are what make an AI flow feel trustworthy — not the chat itself.']],
      },
    ],
    card: { result: '+7% conversion', line: 'A plan in 2.8 minutes, not 15.', meta: 'Plan selection shipped and A/B tested · Activation prototyped' },
    next: 'darpan',
  },
  {
    slug: 'darpan',
    num: '02',
    tier: 'deep',
    name: 'DarpanAI',
    title: 'From an idea to a finished reel, with no editing.',
    accent: 'no editing.',
    summary:
      'DarpanAI is an AI video director for everyday creators in India. Say what your video is about in Hindi, Hinglish or English; it plans the shots, coaches you out loud, scores every take and edits the reel for you.',
    facts: [
      ['Role', 'Product, flows and UI, end to end'],
      ['Type', 'Independent product · 0 → 1'],
      ['Languages', 'Hindi, Hinglish, English'],
      ['Status', 'Live since Oct 2026 · 6 paying creators'],
    ],
    brief: {
      problem: 'Everyday creators know what they want to say, not what to shoot — and most give up at editing.',
      did: 'Designed an AI director that plans five shots, coaches out loud, scores every take and edits the reel.',
      result: { n: '65', label: 'creators signed up; 6 paid ₹299 and 32 reels were finished', source: 'Admin dashboard · 5 Nov 2026' },
    },
    cover: {
      phones: [
        phone('darpan-plan', 'Your shot plan'),
        phone('darpan-check', 'Live check before recording'),
        phone('darpan-report', 'Take report with a score'),
        phone('darpan-ready', 'Your video is ready'),
      ],
    },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'Home cooks, shop owners and students know what they want to say. Planning, delivery and editing are three separate skills, so most attempts end in long unplanned takes full of “umm” and “matlab” — and an unfinished edit.',
      },
      {
        kind: 'list',
        title: 'My role and scope',
        items: [
          'Defined the product loop: plan → check → record → report → keep → make.',
          'Designed the 9-screen MVP flow and the journey map of what the user does, what Darpan does and how each step should feel.',
          'Wrote the in-app copy, including spoken coaching in Hindi and a take report that explains every score.',
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decisions',
        items: [
          {
            label: 'Decision 01',
            title: 'Start from the idea, not a template.',
            context: 'The first screen has to turn “Mummy’s mango pickle recipe” into something filmable — in whatever language the creator speaks.',
            rejected: ['Pick a format first', 'A template fits the format, not the person’s idea, and adds a choice before anything is filmed.'],
            chosen: ['Say or type the idea; templates as a shortcut', 'Darpan writes a 5-shot plan — hook, ingredients, mixing, taste test, ending — with a line to say for each.'],
            tradeoff: 'The first screen has to understand free-form Hindi, Hinglish or English input.',
            shots: [phone('darpan-start', 'What’s your video about?'), phone('darpan-plan', 'Your shot plan')],
          },
          {
            label: 'Decision 02',
            title: 'Coach out loud, then go quiet.',
            context: 'Light and framing are easiest to fix before the take; delivery is easiest when nobody interrupts.',
            rejected: ['Spoken tips during recording', 'Talking over the creator breaks their delivery mid-take.'],
            chosen: ['Speak tips before, stay silent during', '“Turn toward the window. Your face is dark.” — then only small on-screen tips while recording.'],
            tradeoff: 'Some fixes wait until the take ends.',
            shots: [phone('darpan-check', 'Spoken check before recording')],
          },
          {
            label: 'Decision 03',
            title: 'Score the take, not the person.',
            context: 'First-time creators need to know what to fix next, not just that something was wrong.',
            tradeoff:
              'Each take gets a score out of 10 and only the top two fixes — filler words, speed (130–150/min), pauses, light — and the best take is kept automatically.',
            shots: [phone('darpan-report', 'Take report'), phone('darpan-done', 'Shot done, best take kept')],
          },
          {
            label: 'Decision 04',
            title: 'Editing disappears.',
            context: 'Editing is where most first attempts stop.',
            tradeoff:
              'Darpan cuts dead seconds, joins the best takes, adds Hinglish captions and exports one MP4 — creators give up fine control in exchange for finishing.',
            shots: [phone('darpan-ready', 'Your video is ready')],
          },
        ],
      },
      {
        kind: 'steps',
        title: 'Process',
        steps: [
          ['Start', 'Say or type the idea'],
          ['Plan', '5 shots with a line each'],
          ['Check · Record', 'Spoken tips, then silence'],
          ['Report · Keep', 'Score each take, keep the best'],
          ['Make', 'Cut, join, caption, export'],
        ],
      },
      {
        kind: 'image',
        title: 'The journey, mapped',
        shot: wide('darpan-journey', 2400, 502, 'Journey map: what the creator does, what Darpan does and how each step should feel'),
        caption: 'What the creator does, what Darpan does, and how each step should feel — from idea to posted reel.',
      },
      {
        kind: 'results',
        title: 'Early results',
        status: { label: 'Launch data · Admin dashboard, 5 Nov 2026', text: 'Live since October 2026. 61 of 70 sign-ups came on a single day, 24 Oct.' },
        listLabel: 'What the dashboard shows',
        items: [
          '65 creators signed up (the dashboard flags 5 as developer accounts).',
          '6 creators paid ₹299 for Pro — ₹1,794 in total.',
          '152 scripts → 266 recorded takes (average score 7.1/10) → 32 finished reels, none failed.',
          'Only 2 creators recorded a take this week. Retention, not sign-up, is the next problem to design for.',
        ],
        callouts: [
          {
            label: 'Hypothesis to test · A guided second reel · Not built',
            text: 'My hypothesis: creators stop after their first reel because Darpan’s loop ends at export — nothing guides them to the next one. What I intend to test: a guided second reel. Every finished reel ends with the next idea already planned (three follow-up topics from the same niche) and a reminder when it’s ready to shoot. It works if more creators start a second script within 7 days of their first reel.',
          },
        ],
      },
    ],
    card: { result: '6 paying creators', line: 'An AI video director that plans, coaches and edits.', meta: 'Independent · 0 → 1 · Live' },
    myCall: 'I decided Darpan starts from the creator’s own words rather than a template, and that editing is fully automatic — trading fine control for finished reels.',
    next: 'bang-olufsen',
  },
  {
    slug: 'bang-olufsen',
    num: '03',
    tier: 'deep',
    name: 'Bang & Olufsen',
    title: 'Shaping sound by feel, not by equaliser.',
    accent: 'by feel,',
    summary:
      'A new in-vehicle audio interaction model for a Hyundai × Audio by Bang & Olufsen concept: one feel-based gesture instead of three layers of sliders, AI tuning in plain words, and sign-in with a single QR code.',
    facts: [
      ['Role', 'Experience Designer, HARMAN'],
      ['Worked with', 'Bang & Olufsen, Hyundai, HARMAN engineering'],
      ['Year', '2024'],
      ['Status', 'Concept · validated in the car'],
    ],
    brief: {
      problem: 'Premium audio meant an equaliser three layers deep — meaningless to most drivers and distracting at speed.',
      did: 'Designed one feel-based gesture, AI tuning in plain words and one-QR sign-in, then tested it in the car.',
      result: { n: '−40%', label: 'interaction time; navigation from 3 layers to 1', source: 'In-car prototype sessions · 98 participants' },
    },
    cover: { wide: wide('bo-beosonic', 2400, 1500, 'Beosonic: one dot on two feel-based axes'), gauge: { n: '−40%', label: 'Task time', fill: 40 } },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'Bass, treble and fader, three layers deep. Most drivers never touch them, and the ones who do take their eyes off the road — so the hardware’s quality goes unnoticed.',
      },
      {
        kind: 'list',
        title: 'My role and scope',
        items: [
          'Aligned with Bang & Olufsen in a 2-day workshop, then explored the gesture model and two experience tiers.',
          'Designed Beosonic, AI sound tuning and the sign-in flow, approved section by section.',
          'Tested in the car with live sound and ambient light, and fed six fixes back into the spec.',
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decisions',
        items: [
          {
            label: 'Decision 01',
            title: 'Move one dot to shape sound.',
            context: 'Drivers need to change the sound at arm’s length, in a moving car, without understanding audio engineering.',
            rejected: ['Equaliser sliders — bass, treble, fader', 'Three layers deep, meaningless to most drivers and distracting at speed.'],
            chosen: ['One dot on two feel-based axes', 'Bright–Warm and Relaxed–Energetic: the dot is the sound, with safe preset modes underneath.'],
            tradeoff: 'Presets don’t autosave — tap to load, long-press to save — so favourites are never silently overwritten.',
            shots: [wide('bo-beosonic', 2400, 1500, 'Beosonic sound circle')],
          },
          {
            label: 'Decision 02',
            title: 'Ask for a sound in plain words.',
            context: 'AI tuning had to help drivers, not hide what changed.',
            tradeoff: '“I want an AC/DC sound mode” lands on the same circle, so the AI answer teaches the manual control — and one tap undoes any AI change.',
            shots: [wide('bo-ai', 2400, 1500, 'An AI sound request shown on the same circle')],
          },
          {
            label: 'Decision 03',
            title: 'Sign in without typing in a car.',
            context: 'AI tuning, B&O Radio and favourites need an account, but nobody should type on a car screen.',
            rejected: ['Type credentials on the car screen', 'Slow, error-prone and unsafe in a vehicle.'],
            chosen: ['One QR code installs the app and pairs the car', 'Benefits are shown before the ask.'],
            tradeoff: 'Two tiers: fully useful signed out; signing in visibly adds AI tuning, B&O Radio and favourites.',
            shots: [wide('bo-signin', 2400, 1303, 'QR sign-in')],
          },
        ],
      },
      {
        kind: 'steps',
        title: 'Process',
        steps: [
          ['Align', '2-day workshop with B&O'],
          ['Explore', 'Gesture model and two tiers'],
          ['Design', 'Section-by-section approvals'],
          ['Test & refine', 'In the car, with live light'],
        ],
      },
      {
        kind: 'outcome',
        title: 'Outcome',
        outcome: {
          tag: 'In-car prototype sessions · 98 participants',
          gauge: [
            { n: '−40%', label: 'Interaction time', fill: 40, source: 'In-car sessions vs 3-layer model' },
            { n: '76%', label: 'Satisfaction', fill: 76, source: 'In-car prototype sessions' },
            { n: '−10%', label: 'Driver distraction', fill: 10, source: 'In-car sessions vs 3-layer model' },
          ],
          bars: { label: 'Navigation depth to change sound', before: 3, after: 1, beforeText: '3 layers', afterText: '1 layer' },
          method:
            'Compared against the previous 3-layer audio settings model, in the car with live sound and ambient light. A concept, not a production release. 98 participants took part in the in-car prototype sessions.',
        },
      },
      {
        kind: 'pairs',
        title: 'What I learned',
        items: [
          ['Test where it’s used', 'In the car, the light lagged the screen, so light timing was tied to transitions — one of six fixes that only showed up in the vehicle.'],
          ['Specify every state', 'Light behaviour was specified for every state, from start-up to soundscapes, so engineering never had to guess.'],
        ],
      },
    ],
    card: { result: '−40% interaction time', line: 'Shaping in-car sound by feel, not equaliser.', meta: 'HARMAN × Hyundai · In-car' },
    next: 'bracket',
  },
  {
    slug: 'bracket',
    num: '04',
    tier: 'medium',
    name: 'Bracket',
    title: 'An AI memory people can trust.',
    accent: 'trust.',
    summary:
      'An AI memory for freelancers and small teams. It detects decisions — scope, dates, prices — inside email and Slack threads, then asks a human before updating anything.',
    facts: [
      ['Role', 'Founder · strategy, research and design'],
      ['Year', '2026 – now'],
      ['Scope', '173 screens · 53 components · 11 flows'],
      ['Status', 'Live · v0.4'],
    ],
    brief: {
      problem: 'Scope, date and price decisions get lost in email and Slack threads; nobody can say later who agreed to what.',
      did: 'Built an AI loop that detects changes, then asks a human before updating anything — with the source for every claim.',
      result: { n: '22', label: 'sign-ups and 15 workspaces in the last 90 days', source: 'Admin dashboard · 4 Nov 2026' },
    },
    cover: { wide: wide('overview', 2400, 1560, 'Bracket overview: what needs you, separated from what just happened') },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'Freelancers and small teams agree scope, dates and prices in threads. When something changes, nobody can find what was decided — or prove who agreed to it.',
      },
      {
        kind: 'list',
        title: 'My contribution',
        items: [
          'Led product strategy, research and design from concept to launch.',
          'Designed human-in-the-loop AI workflows: every AI claim shows its source and confidence.',
          'Built a tokenised design system (53 components) and 173 screens with clickable prototypes for handoff.',
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decision',
        items: [
          {
            label: 'Decision 01',
            title: 'No auto-apply.',
            context: 'The AI can detect a changed price or date in a thread. The question was whether to apply it automatically.',
            rejected: ['Auto-apply detected changes', 'One silently wrong price poisons every answer that depends on it.'],
            chosen: ['One deliberate click per change', 'Source on the left, AI interpretation on the right, confidence on every claim — nothing changes until a person accepts.'],
            tradeoff: 'More clicks today. The plan is to earn automation category by category, using real accept rates.',
            shots: [wide('review', 2400, 1560, 'Change review screen')],
          },
          {
            label: 'Highlight 02',
            title: 'Only decisions get your attention.',
            context: 'The overview splits “needs you” from “just happened”, so nothing urgent hides in a feed.',
            shots: [wide('attention', 2400, 1560, 'Overview: needs you vs just happened')],
          },
        ],
      },
      {
        kind: 'pairs',
        title: 'Complexity handled',
        items: [
          ['19 scenario areas, 8 principles', '“Humans control change” and “Every claim has evidence” were used to test every layout.'],
          ['Platform, not template', 'A polo manufacturer’s orders ran through the same screens to prove the model generalises.'],
        ],
      },
      {
        kind: 'outcome',
        title: 'Outcome',
        outcome: {
          tag: 'Live since 2026 · v0.4',
          tiles: [
            { n: '22', label: 'sign-ups in 90 days', source: 'Admin dashboard · 90 days' },
            { n: '15', label: 'workspaces created', source: 'Admin dashboard · 90 days' },
            { n: '6', label: 'trials started', source: 'Admin dashboard · 90 days' },
            { n: '90%', label: 'review items accepted', source: 'Admin dashboard · 30 days' },
          ],
          method:
            'Bracket’s admin dashboard, 90 days to 4 Nov 2026, including my own test account. Honest read: 1 of 15 workspaces is active and no trial has converted to paid yet — onboarding is the next problem to solve.',
          callouts: [
            {
              label: 'What I suspect · Hypothesis, not a finding',
              text: '15 workspaces were created, but only 4 Gmail accounts were connected and nobody finished the tour. My suspicion — not yet verified — is that Bracket asks for setup before it shows any value: people have to connect a source before they see a single detected decision.',
            },
            {
              label: 'How I’d investigate, then test · Planned',
              text: 'First, find out where people stop: replay the 14 sandbox sessions to see where the tour is abandoned, and talk to five people who created a workspace but never connected a source. If setup is the blocker, test a Gmail-first start that surfaces one real decision in the first session. Measure: share of new workspaces that review one decision in their first week.',
            },
          ],
        },
      },
    ],
    card: { result: 'Live · v0.4', line: 'An AI memory people can trust.', meta: 'Independent · Live' },
    myCall: 'I ruled out auto-applying AI-detected changes: nothing changes without one deliberate click, until real accept rates earn automation category by category.',
    next: 'harman-kardon',
  },
  {
    slug: 'harman-kardon',
    num: '05',
    tier: 'medium',
    name: 'Harman Kardon',
    title: 'Making sound you can see.',
    accent: 'you can see.',
    summary:
      'One Audio, a connected multi-device audio experience for Harman Kardon, showcased in HARMAN’s AutoOne cockpit at CES 2025 — one app across five in-car display formats.',
    facts: [
      ['Role', 'Associate Experience Designer, HARMAN'],
      ['Year', '2024'],
      ['Scope', '3 cars · 5 display formats · 15-step demo'],
      ['Status', 'Shown at CES 2025'],
    ],
    brief: {
      problem: 'Premium audio hardware is invisible, and CES visitors get about six noisy minutes in the car.',
      did: 'Made seats, moods and light the interface, and wrote rules so one app reflows to five in-car displays.',
      result: { n: '65%', label: 'faster device setup in prototype usability testing', source: 'Prototype validation · ~2,000 US participants' },
    },
    cover: { wide: wide('oa-hero', 1920, 1080, 'One Audio home screen with Seatsonic: seats rendered in 3D with their speakers'), gauge: { n: '65%', label: 'Faster setup', fill: 65 } },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'A 15-step guided demo of 5 minutes 40 seconds, on three cars and five display formats, for visitors who can barely hear the sound they’re meant to judge.',
      },
      {
        kind: 'list',
        title: 'My contribution',
        items: [
          'Treated the guided demo as the user journey, giving each of its 15 steps a 10–30 second time budget.',
          'Designed Home, Media, Mood, Sound and System, and the adaptation rules that let one app reflow to five display formats.',
          'Reviewed every build side by side with the design and logged pixel-level fixes until demo day.',
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decisions',
        items: [
          {
            label: 'Decision 01',
            title: 'Rules, not redesigns.',
            context: 'Three cars, five display formats, one design team and a fixed CES date.',
            rejected: ['A separate layout per car and display', 'Five redesigns to build, QA and keep in sync before the show.'],
            chosen: ['Adaptation rules', 'Background and UI scale separately and anchor to stage positions, so one app reflows to every screen.'],
            tradeoff: 'Less per-car polish, in exchange for one consistent experience that shipped on time.',
            shots: [wide('oa-system', 1920, 1080, 'One app reflowed across display formats')],
          },
          {
            label: 'Decision 02',
            title: 'Light that listens, predictably.',
            context: 'Cabin light had to react to the music on demo hardware, every time, in front of visitors.',
            rejected: ['Real-time generated light', 'Unpredictable on demo hardware.'],
            chosen: ['Pre-rendered light video driven by music data', 'Five themes on two mechanisms: speed follows amplitude, layers follow beats.'],
            tradeoff: 'Less generative, but cinematic and reliable on the show floor.',
            shots: [wide('oa-lighting', 2400, 1625, 'Light themes driven by music data')],
          },
        ],
      },
      {
        kind: 'outcome',
        title: 'Outcome',
        outcome: {
          tag: 'Prototype usability validation (not measured at CES)',
          gauge: [
            { n: '65%', label: 'Faster setup', fill: 65, source: 'Prototype usability validation' },
            { n: '+13%', label: 'Multi-device use', fill: 13, source: 'Prototype usability validation' },
            { n: '4.2', label: 'Satisfaction / 5', fill: 84, source: 'Prototype rating' },
          ],
          method:
            'All three numbers come from prototype usability validation with about 2,000 participants in the US — not production analytics. CES 2025 was a showcase: it is listed as exposure, not as a measured result. The projected support-request reduction is not shown.',
        },
      },
    ],
    card: { result: '', line: '65% faster device setup in prototype usability testing.', meta: 'Shown at CES 2025' },
    next: 'relayos',
  },
  {
    slug: 'relayos',
    num: '06',
    tier: 'concept',
    name: 'RelayOS',
    title: 'One voice note to recover a delayed order.',
    accent: 'delayed order.',
    summary:
      'A concept for Indian manufacturers. When an order slips, the owner sends one WhatsApp voice note. RelayOS calls the supplier, transporter and floor in their own languages, connects what each says, and sends back one recovery plan to approve.',
    facts: [
      ['Type', 'Concept · not shipped'],
      ['Surfaces', 'WhatsApp, phone calls, web app'],
      ['Languages', 'Hindi, Tamil, Telugu, English'],
      ['Scope', '46 screens · 5 prototype flows · full handoff'],
    ],
    brief: {
      problem: 'One late order means twenty phone calls in three languages, and no clear answer.',
      did: 'Designed voice AI that calls everyone in their own language and returns one plan for the owner to approve.',
      result: { n: 'Concept', label: '46 screens, 5 prototype flows and a full engineering handoff', source: 'Not shipped · not validated with users' },
    },
    cover: { wide: wide('relay-run', 1440, 1261, 'Live run view: order map, calls and the decision') },
    sections: [
      {
        kind: 'lede',
        title: 'The problem',
        text: 'The supplier knows the material, the transporter knows the truck, the floor knows the capacity — and they speak Tamil, Hindi and Telugu. Promises are made on calls and forgotten, and the owner translates all day.',
      },
      {
        kind: 'steps',
        title: 'How it works',
        steps: [
          ['Tell it', 'A voice note, or a risk alert from a check-in call'],
          ['It calls', 'Supplier in Tamil, transporter in Hindi, dispatch in Telugu'],
          ['You decide', 'One message: cause, who promised what, one decision'],
          ['It follows through', 'Checks in as each promise comes due; re-plans on a slip'],
        ],
      },
      {
        kind: 'decisions',
        title: 'Key decisions',
        items: [
          {
            label: 'Decision 01',
            title: 'The owner never leaves WhatsApp.',
            context: 'Owners run the business from their phone; their suppliers and transporters won’t install anything.',
            rejected: ['A new app or dashboard to learn', 'Adds forms and data entry; it isn’t a CRM.'],
            chosen: ['WhatsApp voice notes in, one message out', 'A voice note starts a run; the plan comes back with Approve, Reject or Call me.'],
            tradeoff: 'Designed around WhatsApp’s limits: 3 reply buttons of 20 characters, and templates outside the 24-hour window.',
            shots: [phone('relay-voice', 'Owner reports a delay by voice note'), phone('relay-plan', 'Recovery plan and approval')],
          },
          {
            label: 'Decision 02',
            title: 'Money always comes to the owner.',
            context: 'The transporter asks ₹800 extra for a Thursday pickup.',
            rejected: ['Let the AI agree prices', 'An AI committing money on the owner’s behalf breaks trust immediately.'],
            chosen: ['One decision, with the consequence spelled out', '“Approve ₹800 extra? If you reject, the earliest pickup is Monday and the order ships 3 days late.”'],
            tradeoff: 'Every money decision waits for a tap — and no reply means it waits, reminds once, then holds.',
            shots: [wide('relay-run', 1440, 1261, 'Live run view with order map, calls and decision')],
          },
        ],
      },
      {
        kind: 'pairs',
        title: 'Trust rules, designed in',
        items: [
          ['Says it’s an AI on every call', '“I’m RelayOS, an AI assistant calling for Kaveri Fabricators. This call is recorded.”'],
          ['Only calls approved contacts', 'Contacts get a forwarded intro from the owner first, and can opt out with one word.'],
          ['Full record of every call', 'Recordings and transcripts in the original language, with an English translation.'],
        ],
      },
      {
        kind: 'pairs',
        title: 'Built for the real constraints',
        items: [
          ['Indic scripts', 'Tamil and Telugu run up to ~40% longer, so every text box wraps and nothing truncates mid-word.'],
          ['Every state', 'Loading, empty, error and offline specified for every surface, plus 6 branches and 4 error flows.'],
        ],
      },
      {
        kind: 'image',
        title: 'The journey, end to end',
        shot: wide('relay-journey', 2400, 902, 'Journey map across owner, RelayOS, supplier, transporter and dispatch'),
        caption: 'From the owner’s first “hi” to a shipped order and the next morning’s digest — owner, RelayOS, supplier, transporter and dispatch.',
      },
      {
        kind: 'results',
        title: 'Validation',
        status: { label: 'Status', text: 'Concept — not shipped and not yet tested with owners. No outcome numbers are claimed.' },
        listLabel: 'What I will measure',
        items: [
          'Share of delayed orders recovered before the due date',
          'Owner effort per recovery (target: one voice note and one tap)',
          'Calls answered vs. escalated to a person',
          'Opt-outs per 100 contacts',
        ],
      },
    ],
    card: {
      result: '',
      line: 'Voice AI that recovers a delayed order from one WhatsApp voice note — calling suppliers, transporters and the floor in their own languages.',
      meta: 'Concept — not shipped',
    },
    myCall: 'I kept the owner inside WhatsApp and ruled that the AI never agrees a price — every money decision waits for the owner’s tap.',
    next: 'tello',
  },
];

export const getCase = (slug?: string) => cases.find((c) => c.slug === slug);

export const home = {
  meta: [
    ['Role', 'Experience Designer II, Verizon'],
    ['Before', 'HARMAN, 2022–2025'],
    ['Focus', 'AI, conversational, in-car'],
    ['Experience', '4.5+ years'],
  ] as [string, string][],
  sub: 'Experience Designer II at Verizon, previously HARMAN. 4.5+ years connecting design, engineering and business: agentic AI measured in A/B tests, in-car experiences validated in the car, and my own AI products with paying users.',
  stats: [
    { n: '+7%', label: 'conversion on tello.ai', source: 'A/B test · 2,400 users', to: 'tello' },
    { n: '−40%', label: 'in-car audio interaction time', source: 'In-car prototype · 98 participants', to: 'bang-olufsen' },
    { n: 'CES', label: 'Harman Kardon One Audio, AutoOne cockpit', source: 'Shown at CES 2025', to: 'harman-kardon' },
    { n: '0→1', label: 'DarpanAI, live with paying users', source: 'Live since Oct 2026', to: 'darpan' },
  ],
  cards: {
    tello: [tall('tello-plans', ''), tall('tello-phones', ''), tall('tello-scan', ''), tall('tello-pin', '')],
    darpan: [phone('darpan-plan', ''), phone('darpan-report', ''), phone('darpan-ready', '')],
  },
  principles: [
    ['Business', 'I start from the number that matters.', 'Every case study says what moved, and how it was measured.'],
    ['Technology', 'I design inside real constraints.', 'WhatsApp’s button limits, five in-car displays, Indic scripts 40% longer.'],
    ['Execution', 'I take work all the way to ship.', 'Dev-ready specs, every state designed, pixel-level QA against the build.'],
  ] as [string, string, string][],
};

export const about = {
  title: 'I care about why it matters, how it’s built, and whether it ships.',
  accent: 'ships.',
  paragraphs: [
    profile.summary,
    'At Verizon I design agentic AI that is judged by conversion. At HARMAN I designed in-car experiences for Harman Kardon, Hyundai and Bang & Olufsen — work that has to hold up at arm’s length, across five displays, in a moving car.',
    'On my own I build AI products end to end: Bracket is live in v0.4, DarpanAI is an AI video director that 65 creators signed up for in its first two weeks, and RelayOS is a voice-AI concept for Indian manufacturers.',
  ],
  experience: [
    ['2025 – Now', 'Experience Designer II', 'Verizon', 'Hyderabad'],
    ['2024 – 2025', 'Experience Designer', 'HARMAN International', 'Bengaluru'],
    ['2022 – 2024', 'Associate Experience Designer', 'HARMAN International', 'Bengaluru'],
  ] as [string, string, string, string][],
  independent: [
    ['bracket', 'An AI memory people can trust', 'Live · v0.4'],
    ['darpan', 'An AI video director in your pocket', 'Live · 6 paying creators'],
    ['relayos', 'Voice AI that recovers delayed orders', 'Not shipped'],
  ] as [string, string, string][],
  habits: [
    ['One Audio', 'Design for the real moment of use', 'At CES, the demo script was the user journey.'],
    ['tello.ai', 'Write the conversation first', 'Script the turns before drawing a screen.'],
    ['Bracket', 'Humans control change', 'AI proposes; people decide. Always with receipts.'],
    ['One Audio', 'Shipping is a design job', 'Review every build side by side, down to the pixel.'],
  ] as [string, string, string][],
  education: ['2018 – 2022', 'B.Tech, Electrical & Electronics Engineering', 'United College of Engineering & Research, Prayagraj'],
};

export const resume = {
  headline: 'Product Designer | AI, Conversational & Automotive UX',
  roles: [
    {
      role: 'Experience Designer II · Verizon',
      when: '2025 – Present · Hyderabad',
      bullets: [
        'Designer on the tello.ai team (AI conversational assistant for Total Wireless), focused on cutting customer steps; in a 4-week A/B test with 2,400 users, plan selection became 5× faster, conversion rose 7%, CSAT rose 12% and funnel drop-off fell 6%.',
        'Prototyped a conversational phone activation flow that replaces a 12+ screen form with one conversation, using camera scanning for IMEI, SIM number, and plan PIN.',
        'Worked with designers, product managers and engineers from research to high-fidelity UI.',
      ],
    },
    {
      role: 'Experience Designer · HARMAN International',
      when: '2024 – 2025 · Bengaluru',
      bullets: [
        'Redesigned the in-vehicle audio interaction model for a Hyundai × Audio by Bang & Olufsen concept, validated in the car: navigation from 3 layers to 1, interaction time cut by 40%.',
        'Across in-car prototype sessions with 98 participants: 76% user satisfaction and 10% less driver distraction than the 3-layer model.',
        'Tested in the car with live sound and ambient light, and fed six fixes back into the specification.',
      ],
    },
    {
      role: 'Associate Experience Designer · HARMAN International',
      when: '2022 – 2024 · Bengaluru',
      bullets: [
        'Designed One Audio, a connected multi-device audio experience for Harman Kardon, shown in HARMAN’s AutoOne cockpit at CES 2025; prototype validation with about 2,000 US participants measured 65% faster device setup, +13% multi-device use and a 4.2/5 rating.',
        'Wrote adaptation rules so one app reflowed across five in-car display formats on three cars, and reviewed every build against the design until demo day.',
      ],
    },
  ],
  independent: [
    {
      role: 'Product Designer · DarpanAI (independent product)',
      when: '2026 – Present',
      bullets: [
        'Designed and launched an AI video director for everyday creators in India: it plans the shots, coaches out loud in Hindi, scores every take and edits the reel.',
        'Launched in October 2026; within two weeks 65 creators signed up, 6 paid ₹299 for Pro and 32 reels were finished.',
      ],
    },
    {
      role: 'Founder & Product Designer · Bracket (independent product)',
      when: '2026 – Present',
      bullets: [
        'Designed and launched Bracket (live, v0.4), an AI memory for freelancers and small teams: it detects scope, date and price decisions in email and Slack and asks a person before changing anything.',
        'Built a tokenized design system (53 components) and 173 desktop and mobile screens, with clickable prototypes for handoff.',
      ],
    },
  ],
  skills: [
    ['AI & emerging tech', 'AI-assisted design, Conversational UX, Agentic AI, Human-AI interaction, Voice UI, Prompt-driven workflows'],
    ['Product design', 'UX & UI design, Interaction design, Information architecture, User flows, Prototyping, Automotive HMI'],
    ['Product & strategy', 'Product strategy, 0 → 1 development, Roadmapping, Stakeholder alignment, Cross-functional collaboration'],
    ['Design systems', 'Component libraries, Design tokens, Atomic design, Accessibility, Documentation'],
    ['Research', 'User interviews, Usability testing, Journey mapping, Competitive analysis, Design validation'],
    ['Tools', 'Figma, FigJam, ProtoPie, Framer, Photoshop, After Effects, Miro, Notion'],
  ] as [string, string][],
  education: 'B.Tech, Electrical & Electronics Engineering — United College of Engineering & Research, Prayagraj · 2018 – 2022',
};
