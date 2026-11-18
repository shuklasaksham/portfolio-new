// Design notes for the Posts tab: one idea and one image each, drawn only from
// what the case studies already state (no new numbers or stories).
import SCREENS from './screens.json';
import type { Shot } from './content';

export type Post = { id: string; slug: string; project: string; topic: string; title: string; body: string[]; shot: Shot };

const all = Object.values(SCREENS as Record<string, Shot[]>).flat();
const p = (src: string): Shot => {
  const s = all.find((x) => x.src === src);
  if (!s) throw new Error(`Post image not found: ${src}`);
  return s;
};
const img = (name: string, w: number, h: number, alt: string): Shot => ({ src: `/img/${name}.webp`, w, h, alt });

export const posts: Post[] = [
  {
    id: 'agents-need-structure',
    slug: 'tello',
    project: 'tello.ai',
    topic: 'Conversational AI',
    title: 'An AI agent still needs structure',
    body: [
      'The brief for tello was an AI assistant. The risk was an open chat. Customers arrive to do one job (pick a plan, pick a phone, activate), and most don’t know what to ask.',
      'I proposed a guided agent instead: one question at a time, plans arrive as cards, and every choice stays pinned. “Ask anything” is still there when you need it.',
      'The chat isn’t what makes an AI flow feel trustworthy. The stepper, the pinned facts and the cards are. In the team’s A/B test, choosing a plan went from about 15 minutes to 2.8.',
    ],
    shot: p('/img/p/tello/02-plan-cards.webp'),
  },
  {
    id: 'one-dot',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    topic: 'Interaction design',
    title: 'Replace the equaliser with one dot',
    body: [
      'Bass, treble and fader sat three layers deep. Most drivers never touched them, and the ones who did took their eyes off the road.',
      'Beosonic replaces them with one dot on two axes people can feel: Bright–Warm and Relaxed–Energetic. The dot is the sound, with safe presets underneath. Presets don’t autosave (tap to load, long-press to save), so a favourite is never silently overwritten.',
      'In 98 in-car sessions, interaction time fell 40% against the three-layer model.',
    ],
    shot: p('/img/p/bang-olufsen/05-beosonic-sound-circle.webp'),
  },
  {
    id: 'no-auto-apply',
    slug: 'bracket',
    project: 'Bracket',
    topic: 'AI trust',
    title: 'Why Bracket never auto-applies a change',
    body: [
      'Bracket’s AI can spot a changed price or date in an email thread. The obvious move is to apply it automatically. I ruled that out, because one silently wrong price poisons every answer that depends on it.',
      'Every change waits for one deliberate click. The source sits on the left, the AI’s reading on the right, and every claim shows its confidence.',
      'That’s more clicks today. Automation has to be earned, category by category, from real accept rates. Right now 90% of review items are accepted.',
    ],
    shot: p('/img/p/bracket/05-change-review.webp'),
  },
  {
    id: 'rules-not-redesigns',
    slug: 'harman-kardon',
    project: 'Harman Kardon One Audio',
    topic: 'Design systems',
    title: 'Rules, not redesigns',
    body: [
      'We had three cars, five display formats, one design team and a fixed CES date. A separate layout per screen meant five designs to build, QA and keep in sync.',
      'I wrote adaptation rules instead. Background and UI scale separately and anchor to stage positions, so one app reflows to every screen.',
      'We gave up some per-car polish for one consistent experience that shipped on time. The whole app later shipped in BMW and Subaru vehicles.',
    ],
    shot: p('/img/p/harman-kardon/11-wide-ivi-seatsonic.webp'),
  },
  {
    id: 'score-the-take',
    slug: 'darpan',
    project: 'DarpanAI',
    topic: 'Feedback design',
    title: 'Score the take, not the person',
    body: [
      'First-time creators need to know what to fix next, not just that something went wrong.',
      'Each take in DarpanAI gets a score out of 10 and a short list of what to try: filler words, speed (130–150 words a minute), pauses and light. The best take is kept automatically.',
      'The report explains every score, so it reads like a director’s note rather than a grade.',
    ],
    shot: p('/img/p/darpan/09-take-review.webp'),
  },
  {
    id: 'four-decisions',
    slug: 'plug',
    project: 'Plug',
    topic: 'Decision design',
    title: 'Four decisions, not two',
    body: [
      'Approve or reject forces a choice on someone who is only unsure, or who disagrees with the amount. Doubt turns into a rejection, and the reason is lost.',
      'Plug offers four: approve, reject with a reason, ask Plug, or dispute. Each one states its consequence, including the fee, before you commit. Above a threshold (by default $10,000), an approver decides.',
      'More choices on screen means fewer wrong rejections, and every rejection keeps its reason.',
    ],
    shot: img('plug-finding', 1440, 1347, 'Plug finding detail: two payments for the same invoice side by side, with the evidence and the decision panel'),
  },
  {
    id: 'ai-never-agrees-a-price',
    slug: 'relayos',
    project: 'RelayOS',
    topic: 'Voice AI',
    title: 'An AI should never agree a price',
    body: [
      'Say the transporter asks for ₹800 extra for a Thursday pickup. RelayOS could negotiate, but an AI committing money on the owner’s behalf breaks trust immediately.',
      'So every money decision comes back as one question, with the consequence spelled out: “Approve ₹800 extra? If you reject, the earliest pickup is Monday and the order ships 3 days late.” If the owner doesn’t reply, it waits, reminds once, then holds.',
      'RelayOS is a concept, not yet tested with owners.',
    ],
    shot: p('/img/p/relayos/03-whatsapp-plan-approval.webp'),
  },
  {
    id: 'test-both',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    topic: 'Collaboration',
    title: 'When a debate stalls, test both',
    body: [
      'An engineer wanted to keep the traditional equaliser. Instead of arguing for the gesture model, I proposed testing both on the same tasks.',
      'The team prototyped one gesture-based control and kept the advanced settings within reach, so nobody lost what they cared about.',
      'The test settled it: 40% less interaction time. The gesture control shipped in Hyundai and Skoda vehicles. Evidence ends a design debate faster than opinion does, and the working relationship survives.',
    ],
    shot: p('/img/p/bang-olufsen/06-beosonic-sound-modes-custom.webp'),
  },
  {
    id: 'camera-does-the-copying',
    slug: 'tello',
    project: 'tello.ai',
    topic: 'Failure states',
    title: 'Let the camera do the copying',
    body: [
      'Activating a phone meant finding a 15-digit IMEI, a SIM number and a plan PIN, then typing them across 12+ form screens. People dropped out at exactly the steps that asked them to copy numbers.',
      'In the new flow, the agent reads the numbers off the box with the camera. Scans fail, so every scan offers three ways out, each one tap away: rescan, type it in, or reach a human.',
      'Most of the design work was those failure paths: 20+ states across three scan flows. Activation is still a prototype.',
    ],
    shot: p('/img/p/tello/09-imei-scan.webp'),
  },
  {
    id: 'read-your-numbers',
    slug: 'bracket',
    project: 'Bracket',
    topic: 'Product metrics',
    title: 'Read your own numbers honestly',
    body: [
      'Bracket reached #9 on Product Hunt. The dashboard tells a quieter story: 15 workspaces were created, 4 Gmail accounts connected and 1 workspace is active. Nobody finished the tour.',
      'My hypothesis, not yet verified, is that Bracket asks for setup before it shows any value.',
      'Before redesigning anything, I’ll replay the 14 sandbox sessions and talk to five people who never connected a source. If setup is the blocker, the next test is a Gmail-first start that shows one real decision in the first session.',
    ],
    shot: p('/img/p/bracket/01-onboarding-connect-sources.webp'),
  },
  {
    id: 'coach-then-quiet',
    slug: 'darpan',
    project: 'DarpanAI',
    topic: 'Voice UX',
    title: 'Coach out loud, then go quiet',
    body: [
      'Light and framing are easiest to fix before a take. Delivery is easiest when nobody interrupts.',
      'So DarpanAI speaks its tips before recording (“Turn toward the window. Your face is dark.”), then stays silent while the creator talks, showing only small tips on screen.',
      'The trade-off is that some fixes wait until the take ends. A good coach knows when to stop talking.',
    ],
    shot: p('/img/p/darpan/05-live-coaching.webp'),
  },
  {
    id: 'predictable-light',
    slug: 'harman-kardon',
    project: 'Harman Kardon One Audio',
    topic: 'Motion and light',
    title: 'On a show floor, predictable beats generative',
    body: [
      'At CES, the cabin light had to react to the music on demo hardware, every time, in front of visitors. Light generated in real time was unpredictable on that hardware.',
      'So the light is a pre-rendered video driven by music data: five themes on two mechanisms. Speed follows amplitude, and layers follow beats.',
      'It’s less generative, but cinematic and reliable. Sometimes the right call is the one that still works the hundredth time.',
    ],
    shot: p('/img/p/harman-kardon/05-mood-pacific-whisper.webp'),
  },
  {
    id: 'ai-teaches-the-control',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    topic: 'AI interaction',
    title: 'Let the AI’s answer teach the manual control',
    body: [
      'Drivers can ask for a sound in plain words: “I want an AC/DC sound mode.” The answer lands on the same Beosonic circle they would use by hand, with a note on why it fits.',
      'An AI that hides what it changed leaves people stuck the moment they want it slightly different. An AI that shows its work on the manual control teaches people that control.',
      'And one tap undoes any AI change.',
    ],
    shot: p('/img/p/bang-olufsen/07-beosonic-ai-request.webp'),
  },
  {
    id: 'states-are-designed',
    slug: 'plug',
    project: 'Plug',
    topic: 'Failure states',
    title: 'States are designed, not left over',
    body: [
      'In a product that finds money and writes to your vendors, the edge cases are where trust is won or lost: loading, empty, errors, partial data, disconnected accounts.',
      'In Plug, each state says what happened and what to do next. Every branch of onboarding has somewhere to go: an unverified email, denied access, invalid files, partial data.',
      'They’re part of the 39 screens, not an afterthought at handoff.',
    ],
    shot: img('plug-f6-disconnected', 1440, 900, 'Plug data sources with a disconnected account, saying what happened and how to reconnect'),
  },
  {
    id: 'test-in-the-car',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    topic: 'Research',
    title: 'Some problems only show up in the car',
    body: [
      'We tested Beosonic in the vehicle, with live sound and ambient light, not just on a desk. Six fixes only appeared there.',
      'In one, the cabin light lagged behind the screen, so we tied light timing to screen transitions.',
      'After that, light behaviour was specified for every state, from start-up to soundscapes, so engineering never had to guess.',
    ],
    shot: p('/img/p/bang-olufsen/09-beoscapes-adjustment.webp'),
  },
];
