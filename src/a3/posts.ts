// Posts tab: design posts written the way I post on LinkedIn: a hook, short lines,
// bullets and a takeaway. Every fact comes from the case studies (no new numbers or stories).
import SCREENS from './screens.json';
import type { Shot } from './content';

/** body: paragraphs separated by a blank line; lines inside a paragraph by a newline. */
export type Post = { id: string; slug: string; project: string; title: string; body: string; shot: Shot };

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
    title: 'An AI agent still needs structure',
    body: `The brief said “AI assistant”. The risk was an open chat. 🤔

People come to a phone carrier to do one job: pick a plan, pick a phone, activate. Most of them don’t know what to ask an assistant.

So I proposed a guided agent instead:
• One question at a time
• Plans arrive as cards, not paragraphs
• Every choice stays pinned
• “Ask anything” is still there when you need it

In the team’s A/B test, choosing a plan went from about 15 minutes to 2.8. Conversion went up 7%.

The chat isn’t what makes an AI flow feel trustworthy. The structure around it is.`,
    shot: p('/img/p/tello/02-plan-cards.webp'),
  },
  {
    id: 'one-dot',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    title: 'Replace the equaliser with one dot',
    body: `Nobody in a moving car should need to understand audio engineering. 🎛️

The old audio settings: bass, treble and fader, three layers deep. Most drivers never touched them, and the ones who did took their eyes off the road.

Beosonic replaces all of it with one dot on two axes you can feel:
• Bright ↔ Warm
• Relaxed ↔ Energetic

The dot is the sound, with safe presets underneath. Presets don’t autosave (tap to load, long-press to save), so a favourite is never silently overwritten.

In 98 in-car sessions, interaction time fell 40% against the three-layer model. It shipped in Hyundai and Skoda vehicles.

Design for the hand that’s on the wheel, not the spec sheet.`,
    shot: p('/img/p/bang-olufsen/05-beosonic-sound-circle.webp'),
  },
  {
    id: 'no-auto-apply',
    slug: 'bracket',
    project: 'Bracket',
    title: 'Why Bracket never auto-applies a change',
    body: `The hardest design question in AI products: should the AI act on its own?

In Bracket, the AI can spot a changed price or date in an email thread. Applying it automatically would feel magical.

I ruled it out. One silently wrong price poisons every answer that depends on it.

What we do instead:
• Every change waits for one deliberate click
• Source on the left, the AI’s reading on the right
• A confidence level on every claim

Yes, it’s more clicks today. Automation has to be earned, category by category, from real accept rates. Right now 90% of review items get accepted.

Trust isn’t a feature you add later. It’s the interaction model.`,
    shot: p('/img/p/bracket/05-change-review.webp'),
  },
  {
    id: 'rules-not-redesigns',
    slug: 'harman-kardon',
    project: 'Harman Kardon One Audio',
    title: 'Rules, not redesigns',
    body: `3 cars. 5 display formats. 1 design team. A fixed CES date. 🚗

A separate layout per screen would have meant five designs to build, QA and keep in sync.

So I wrote adaptation rules instead:
• Background and UI scale separately
• Everything anchors to stage positions
• One app reflows to every screen

We gave up some per-car polish for one consistent experience that shipped on time. The whole app later shipped in BMW and Subaru vehicles.

When the screens multiply, design the rules, not the screens.`,
    shot: p('/img/p/harman-kardon/11-wide-ivi-seatsonic.webp'),
  },
  {
    id: 'score-the-take',
    slug: 'darpan',
    project: 'DarpanAI',
    title: 'Score the take, not the person',
    body: `First-time creators don’t need to hear that something went wrong. They need to know what to fix next. 🎬

That’s how I designed the take report in DarpanAI:
• A score out of 10 for every take
• A short list of what to try next: filler words, speed (130–150 words a minute), pauses, light
• The best take kept automatically

The report explains every score, so it reads like a note from a director, not a grade.

Feedback design is product design. The tone decides whether people try again.`,
    shot: p('/img/p/darpan/09-take-review.webp'),
  },
  {
    id: 'four-decisions',
    slug: 'plug',
    project: 'Plug',
    title: 'Four decisions, not two',
    body: `Approve / Reject is a lazy pattern for AI findings.

It forces a choice on someone who is only unsure, or who disagrees with the amount. Doubt turns into a rejection, and the reason is lost.

In Plug, every finding gets four options:
• Approve
• Reject, with a reason
• Ask Plug
• Dispute the amount

Each one states its consequence, including the fee, before you commit. Above a threshold ($10,000 by default), an approver decides.

More choices on screen means fewer wrong rejections, and every rejection keeps its reason.`,
    shot: img('plug-finding', 1440, 1347, 'Plug finding detail: two payments for the same invoice side by side, with the evidence and the decision panel'),
  },
  {
    id: 'ai-never-agrees-a-price',
    slug: 'relayos',
    project: 'RelayOS',
    title: 'An AI should never agree a price',
    body: `A transporter asks for ₹800 extra for a Thursday pickup. Should the AI agent say yes?

In RelayOS, never. An AI committing money on the owner’s behalf breaks trust immediately.

So every money decision comes back to the owner on WhatsApp as one question, with the consequence spelled out:

“Approve ₹800 extra? If you reject, the earliest pickup is Monday and the order ships 3 days late.”

• Approve, Reject or Call me
• No reply? It waits, reminds once, then holds

Voice AI can make the calls. The owner keeps the money decisions.

(RelayOS is a concept, not yet tested with owners.)`,
    shot: p('/img/p/relayos/03-whatsapp-plan-approval.webp'),
  },
  {
    id: 'test-both',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    title: 'When a debate stalls, test both',
    body: `An engineer wanted to keep the traditional equaliser. I wanted a gesture.

I could have argued for my idea. Instead I proposed testing both on the same tasks.

What happened:
• The team prototyped one gesture-based control
• The advanced settings stayed within reach, so nobody lost what they cared about
• Interaction time dropped 40%
• It shipped in Hyundai and Skoda vehicles

Evidence ends a design debate faster than opinion does, and the working relationship survives it. 🤝`,
    shot: p('/img/p/bang-olufsen/06-beosonic-sound-modes-custom.webp'),
  },
  {
    id: 'camera-does-the-copying',
    slug: 'tello',
    project: 'tello.ai',
    title: 'Let the camera do the copying',
    body: `Activating a phone used to mean typing:
• A 15-digit IMEI
• A SIM number
• A plan PIN
…across 12+ form screens.

People dropped out at exactly the steps that asked them to copy numbers. 📱

So in the new flow, the agent reads them off the box with the camera.

But scans fail. Every scan offers three ways out, each one tap away:
• Rescan
• Type it in
• Reach a human

Most of the design work was those failure paths: 20+ states across three scan flows.

The happy path is the easy part. Design the way out.`,
    shot: p('/img/p/tello/09-imei-scan.webp'),
  },
  {
    id: 'read-your-numbers',
    slug: 'bracket',
    project: 'Bracket',
    title: 'Read your own numbers honestly',
    body: `Bracket hit #9 on Product Hunt. 🎉

The dashboard tells a quieter story:
• 15 workspaces created
• 4 Gmail accounts connected
• 1 active workspace
• Nobody finished the tour

My hypothesis (not yet verified): Bracket asks for setup before it shows any value.

Before redesigning anything, I’ll replay the 14 sandbox sessions and talk to five people who never connected a source. If setup is the blocker, the next test is a Gmail-first start that shows one real decision in the first session.

A launch is a starting line, not a result.`,
    shot: p('/img/p/bracket/01-onboarding-connect-sources.webp'),
  },
  {
    id: 'coach-then-quiet',
    slug: 'darpan',
    project: 'DarpanAI',
    title: 'Coach out loud, then go quiet',
    body: `Designing a voice coach taught me one thing: knowing when to stop talking is a feature. 🎙️

In DarpanAI:
• Light and framing are easiest to fix before a take, so it speaks its tips first: “Turn toward the window. Your face is dark.”
• Delivery is easiest when nobody interrupts, so during the take it goes silent and shows only small tips on screen

The trade-off: some fixes wait until the take ends.

That’s worth it. A coach who talks over you isn’t coaching.`,
    shot: p('/img/p/darpan/05-live-coaching.webp'),
  },
  {
    id: 'predictable-light',
    slug: 'harman-kardon',
    project: 'Harman Kardon One Audio',
    title: 'On a show floor, predictable beats generative',
    body: `At CES, the cabin light had to react to the music on demo hardware, every time, in front of visitors. ✨

Light generated in real time looked great in theory and was unpredictable on that hardware.

So the light became a pre-rendered video driven by music data:
• 5 themes
• 2 mechanisms: speed follows amplitude, layers follow beats

Less generative, but cinematic and reliable.

Sometimes the right design call is the one that still works the hundredth time.`,
    shot: p('/img/p/harman-kardon/05-mood-pacific-whisper.webp'),
  },
  {
    id: 'ai-teaches-the-control',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    title: 'Let the AI’s answer teach the manual control',
    body: `“I want an AC/DC sound mode.” 🎸

In the B&O app, drivers can ask for a sound in plain words. The answer lands on the same Beosonic circle they’d use by hand, with a note on why it fits.

Why that matters:
• An AI that hides what it changed leaves people stuck the moment they want it slightly different
• An AI that shows its work on the manual control teaches that control
• One tap undoes any AI change

Good AI features make people better at the product, not more dependent on the AI.`,
    shot: p('/img/p/bang-olufsen/07-beosonic-ai-request.webp'),
  },
  {
    id: 'states-are-designed',
    slug: 'plug',
    project: 'Plug',
    title: 'States are designed, not left over',
    body: `In a product that finds money and writes to your vendors, trust is won or lost in the edge cases.

In Plug, I designed each of these as a real screen:
• Loading
• Empty
• Errors
• Partial data
• Disconnected accounts

Each one says what happened and what to do next. Every branch of onboarding has somewhere to go: an unverified email, denied access, invalid files, partial data.

They’re part of the 39 screens, not an afterthought at handoff.

If engineering has to guess a state, the design isn’t finished.`,
    shot: img('plug-f6-disconnected', 1440, 900, 'Plug data sources with a disconnected account, saying what happened and how to reconnect'),
  },
  {
    id: 'test-in-the-car',
    slug: 'bang-olufsen',
    project: 'Bang & Olufsen',
    title: 'Some problems only show up in the car',
    body: `We tested Beosonic in the vehicle, with live sound and ambient light, not just on a desk. 🚘

6 fixes only showed up there.

One example: the cabin light lagged behind the screen. The fix was tying light timing to screen transitions.

After that:
• Light behaviour was specified for every state, from start-up to soundscapes
• Engineering never had to guess

Test where the product is used. The desk lies.`,
    shot: p('/img/p/bang-olufsen/09-beoscapes-adjustment.webp'),
  },
];
