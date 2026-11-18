// Posts tab: UI/UX and product design posts, the way I post on LinkedIn, with project
// updates in between. Project facts and their dates come from the case studies.
import SCREENS from './screens.json';
import type { Shot } from './content';

/** body: paragraphs separated by a blank line; lines inside a paragraph by a newline. */
export type Post = {
  id: string;
  date: string; // ISO date
  title: string;
  body: string;
  shot: Shot;
  video?: string;
  /** Project updates link to their case study. */
  slug?: string;
};

const all = Object.values(SCREENS as Record<string, Shot[]>).flat();
const p = (src: string): Shot => {
  const s = all.find((x) => x.src === src);
  if (!s) throw new Error(`Post image not found: ${src}`);
  return s;
};
const art = (name: string, alt: string): Shot => ({ src: `/img/posts/${name}.webp`, w: 1600, h: 1000, alt });
const img = (name: string, w: number, h: number, alt: string): Shot => ({ src: `/img/${name}.webp`, w, h, alt });

export const posts: Post[] = [
  {
    id: 'showreel',
    date: '2026-11-16',
    title: 'My showreel',
    body: `Made a reel of everything I’ve designed and shipped so far 🎬

• tello.ai: agentic AI for plan selection at Verizon, +7% conversion
• Bang & Olufsen: in-car audio, shipped in Hyundai and Skoda
• Harman Kardon One Audio: shipped in BMW and Subaru
• Bracket: #9 on Product Hunt
• DarpanAI: an AI video director with paying creators
• Plug and RelayOS: AI products for finance teams and manufacturers

Have a look and tell me which one you’d want the full story on 👇`,
    shot: { src: '/video/showreel-poster.webp', w: 1280, h: 720, alt: 'Saksham Shukla showreel' },
    video: '/video/showreel-2.mp4',
  },
  {
    id: 'plug-in-design',
    date: '2026-11-12',
    slug: 'plug',
    title: 'Plug: launching 14 Jan 2027',
    body: `Something new I’ve been designing: Plug 💸

Plug is an AI recovery platform for finance teams. It checks every payment for duplicates and unused vendor credits, explains each finding with its evidence, and recovers the money only after a person approves.

The pricing model shaped the whole UX: Plug charges 15% of what comes back, and nothing if nothing does.

So far:
• 39 desktop screens across 7 flows
• Loading, empty, error and partial-data states for all of them
• A full design system

Launching 14 Jan 2027.`,
    shot: img('plug-overview', 1440, 900, 'Plug overview: found, waiting for your decision, with vendors and recovered'),
  },
  {
    id: 'microcopy',
    date: '2026-11-09',
    title: 'A button should say what happens next',
    body: `“Submit” is the laziest word in UI. ✍️

Users shouldn’t have to read the whole screen to know what a button does. The label is the promise.

Instead of:
• Submit → Send invoice
• OK → Delete 3 files
• Cancel → Keep editing

Verb + object. Every time.

Bonus: when the action is destructive, put the number in the label. “Delete 3 files” makes people pause in a way “Delete” never does.`,
    shot: art('microcopy', 'Vague buttons (Submit, OK, Yes) next to specific ones (Send invoice, Delete 3 files, Keep editing)'),
  },
  {
    id: 'darpan-live',
    date: '2026-11-05',
    slug: 'darpan',
    title: 'DarpanAI: two weeks live',
    body: `DarpanAI has been live for two weeks. Here’s the honest dashboard 📊

• 65 creators signed up (after removing developer accounts)
• 6 subscribed to Pro
• 152 scripts → 266 takes → 32 finished reels, none failed
• Only 2 creators recorded a take this week

That last line is the real story. Sign-ups aren’t the problem. Retention is.

My hypothesis: the loop ends at export, and nothing guides creators to their next reel. Next I’ll test a guided second reel: every finished reel ends with the next idea already planned.

Building in public means sharing this part too.`,
    shot: p('/img/p/darpan/12-reel-ready.webp'),
  },
  {
    id: 'ai-trust',
    date: '2026-10-27',
    title: 'Five patterns that make AI trustworthy',
    body: `The hardest problem in AI products isn’t the model. It’s this:

How does a user trust what the AI just did? 🤔

5 patterns I keep coming back to:
• Confidence: say how sure the AI is
• Source: show where it got the answer
• “Why this?”: one tap to the reasoning
• Undo: every AI action is reversible
• Approval gates: the AI asks before it acts on anything that matters

None of these are flashy. All of them decide whether people come back.

Which one do you see missing most often?`,
    shot: art('trust', 'AI trust patterns: confidence, source, why this, undo and approve before it acts, around an AI suggestion card'),
  },
  {
    id: 'error-messages',
    date: '2026-10-14',
    title: 'Every error answers three questions',
    body: `“Something went wrong.” 🙃

That message tells users nothing. A good error answers three questions:

1. What happened? “Couldn’t upload invoices.csv”
2. Why? “Row 14 is missing an amount”
3. What now? [Fix row 14] [Upload again]

And a few rules I follow:
• Never blame the user
• Keep what they already typed
• Put the fix right next to the message

Errors are part of the flow, not an interruption to it.`,
    shot: art('errors', 'An error card annotated with what happened, why, and what now'),
  },
  {
    id: 'bracket-ph',
    date: '2026-10-01',
    slug: 'bracket',
    title: 'Bracket is live on Product Hunt',
    body: `Bracket is live on Product Hunt today, and it finished #9 🚀

Bracket is an AI memory for freelancers and small teams. It detects decisions (scope, dates, prices) inside email and Slack threads, then asks a human before updating anything.

The design rule I didn’t compromise on: the AI never changes anything on its own. Source on the left, the AI’s reading on the right, one click to accept.

Built it end to end:
• 53-component design system
• 173 screens with clickable prototypes

Thank you to everyone who upvoted and left feedback 🙏`,
    shot: p('/img/p/bracket/04-overview.webp'),
  },
  {
    id: 'empty-states',
    date: '2026-09-18',
    title: 'An empty state is an onboarding screen',
    body: `“No data.” Two words, and a dead end. 😶

The empty state is often the first screen a new user sees. That makes it your onboarding.

A good empty state has:
• What will appear here
• Why it’s empty right now
• One clear action to fill it

“No invoices yet. Connect your accounting tool and every payment gets checked automatically. [Connect a source]”

Design the empty state first. If you can’t explain the screen when it’s empty, the screen isn’t clear yet.`,
    shot: art('empty', 'A blank “No data” state next to a helpful empty state with a clear next step'),
  },
  {
    id: 'button-states',
    date: '2026-09-02',
    title: 'A button has six states, not one',
    body: `Most handoffs show one button. Engineering needs six. 👇

• Default
• Hover
• Pressed
• Focus (a visible ring, for keyboard users)
• Disabled
• Loading

Loading is the one teams forget most often. Without it, people click twice and you get two payments, two emails, two orders.

If a state isn’t in the file, someone will guess it in code.`,
    shot: art('states', 'One button shown in six states: default, hover, pressed, focus, disabled and loading'),
  },
  {
    id: 'tokens',
    date: '2026-08-19',
    title: 'Name design tokens by role, not by colour',
    body: `green-500 is a colour. status.success is a decision. 🎨

When tokens are named after colours:
• Rebrands mean find-and-replace across the whole product
• Dark mode becomes a second design system
• Nobody knows if blue-600 is a link, a button or a chart

Name them by role instead:
• action.primary
• border.subtle
• status.success
• status.error

The colour can change. The role never does.`,
    shot: art('tokens', 'Colour-named tokens crossed out, next to role-named tokens'),
  },
  {
    id: 'touch-targets',
    date: '2026-07-30',
    title: 'The icon is 24px. The target isn’t.',
    body: `Your icon can be small. The tap area can’t. 👆

The numbers worth remembering:
• Apple HIG: 44 × 44 pt
• Material Design: 48 × 48 dp
• WCAG 2.2 minimum: 24 × 24 CSS px

Pad the hit area, not the icon. And keep enough space between targets that a thumb can’t hit two at once.

This matters even more in a car, where people tap at arm’s length on a moving road.`,
    shot: art('targets', 'Touch target sizes: 44 by 44 points, 48 by 48 dp and the 24 by 24 pixel minimum'),
  },
  {
    id: 'contrast',
    date: '2026-07-12',
    title: 'Light grey text is a readability bug',
    body: `That elegant light grey caption? A lot of people can’t read it. 👀

WCAG AA asks for:
• 4.5:1 for body text
• 3:1 for large text and UI components

Some quick checks on white:
• #AAAAAA → 2.32:1 ✕
• #8A8A8A → 3.45:1 ✕
• #767676 → 4.54:1 ✓

Low contrast doesn’t look minimal. It looks unfinished to anyone in sunlight, on a cheap screen, or over 40.

Check it in the file, before it ships.`,
    shot: art('contrast', 'Grey text samples on white with their contrast ratios'),
  },
  {
    id: 'loading',
    date: '2026-06-24',
    title: 'Skeletons vs spinners',
    body: `A spinner says “wait”. A skeleton says “here’s what’s coming”. ⏳

When to use which:
• Under about a second: show nothing, or the content just appears
• Loading content with a known layout: skeleton
• A single action like saving or sending: spinner or progress on the button
• Long waits: real progress, and let people do something else

Skeletons make waits feel shorter because the layout is already there. Nothing jumps when the content lands.`,
    shot: art('loading', 'A spinner card next to a skeleton card showing the shape of the content'),
  },
  {
    id: 'type-scale',
    date: '2026-06-06',
    title: 'Fewer type sizes, clearer hierarchy',
    body: `If your file has 14 font sizes, you don’t have a hierarchy. You have a mood board. 🔤

Most product UIs need five:
• Display
• Title
• Heading
• Body
• Caption

Then build hierarchy with weight, colour and spacing before reaching for another size.

Fewer sizes = faster decisions, cleaner handoff, and a UI that feels designed instead of assembled.`,
    shot: art('type', 'A five-step type scale: display, title, heading, body and caption'),
  },
  {
    id: 'spacing',
    date: '2026-05-21',
    title: 'Spacing is rhythm, not a number',
    body: `Everyone talks about the 8pt grid. The grid isn’t the point. Rhythm is. 📐

What actually makes a layout feel calm:
• One base unit (4 or 8)
• A short scale: 4, 8, 12, 16, 24, 32, 48, 64
• Related things closer together, unrelated things further apart
• The same gap for the same relationship, everywhere

When spacing is consistent, users read structure before they read words.

Bad spacing is the most common reason a “clean” UI still feels off.`,
    shot: art('spacing', 'A spacing scale from 4 to 64'),
  },
];
