// Saksham Shukla — showreel. 1920×1080, 60 fps. Every claim matches sakshamshukla.com.
import type { ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { C, Em, Eyebrow, Headline, MONO, Note, Reveal, Shot, Stage, Stat, useIn } from './ui';

const L = 120; // left margin

/** Text column used by every project scene. */
function Copy({ eyebrow, lines, notes, size = 84 }: { eyebrow: string; lines: ReactNode[]; notes: ReactNode[]; size?: number }) {
  return (
    <div style={{ position: 'absolute', left: L, top: 150, width: 720 }}>
      <Eyebrow at={6}>{eyebrow}</Eyebrow>
      <div style={{ marginTop: 28 }}>
        <Headline at={14} lines={lines} size={size} />
      </div>
      <div style={{ marginTop: 44, display: 'grid', gap: 18 }}>
        {notes.map((n, i) => <Note key={i} at={58 + i * 12}>{n}</Note>)}
      </div>
    </div>
  );
}

const StatAt = (p: Parameters<typeof Stat>[0]) => (
  <div style={{ position: 'absolute', left: L, bottom: 110 }}>
    <Stat align="left" {...p} />
  </div>
);

/* ---------- intro, chapters, outro ---------- */

function Intro() {
  const f = useCurrentFrame();
  const line = interpolate(f, [70, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage glowX={50} glowY={110}>
      <AbsoluteFill style={{ justifyContent: 'center', padding: `0 ${L}px` }}>
        <Eyebrow at={10}>Showreel · Product design</Eyebrow>
        <div style={{ marginTop: 30, fontWeight: 500, fontSize: 190, lineHeight: 0.98, letterSpacing: '-0.05em' }}>
          <Reveal at={18} dur={48}>Saksham</Reveal>
          <Reveal at={30} dur={48}>Shukla<span style={{ color: C.lime }}>.</span></Reveal>
        </div>
        <div style={{ marginTop: 48, height: 2, width: 820 * line, background: `linear-gradient(90deg, ${C.mint}, ${C.lime})`, borderRadius: 2 }} />
        <div style={{ marginTop: 36, fontSize: 40, color: 'rgba(243,246,244,.86)' }}>
          <Reveal at={96}>Product designer · AI, conversational and in-car products</Reveal>
        </div>
        <div style={{ marginTop: 18, font: `400 24px/1.4 ${MONO}`, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>
          <Reveal at={120}>4.5+ years · Verizon · previously HARMAN</Reveal>
        </div>
      </AbsoluteFill>
    </Stage>
  );
}

function Chapter({ kicker, title }: { kicker: string; title: ReactNode }) {
  return (
    <Stage glowX={20} glowY={100}>
      <AbsoluteFill style={{ justifyContent: 'center', padding: `0 ${L}px` }}>
        <Eyebrow at={6}>{kicker}</Eyebrow>
        <div style={{ marginTop: 26, fontWeight: 500, fontSize: 120, lineHeight: 1.02, letterSpacing: '-0.045em' }}>
          <Reveal at={12} dur={44}>{title}</Reveal>
        </div>
      </AbsoluteFill>
    </Stage>
  );
}

function Outro() {
  const p = useIn(90, 40);
  return (
    <Stage glowX={50} glowY={105}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Img src={staticFile('shots/portrait.webp')} style={{ width: 150, height: 150, borderRadius: 999, objectFit: 'cover', objectPosition: '50% 15%', opacity: useIn(4, 30), boxShadow: `0 0 0 4px rgba(158,240,198,.25)` }} />
        <div style={{ marginTop: 40, fontWeight: 500, fontSize: 130, lineHeight: 1, letterSpacing: '-0.05em' }}>
          <Reveal at={12} dur={44}>Saksham Shukla<span style={{ color: C.lime }}>.</span></Reveal>
        </div>
        <div style={{ marginTop: 28, fontSize: 38, color: 'rgba(243,246,244,.86)' }}>
          <Reveal at={40}>Experience Designer II at Verizon · previously HARMAN</Reveal>
        </div>
        <div style={{ marginTop: 56, fontSize: 52, fontWeight: 500, letterSpacing: '-0.02em', color: C.lime, opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
          sakshamshukla.com
        </div>
      </AbsoluteFill>
    </Stage>
  );
}

/* ---------- projects ---------- */

function Tello() {
  return (
    <Stage>
      <Copy eyebrow="Verizon · tello.ai · Experience Designer II" lines={['A plan in', <Em>2.8 minutes,</Em>, 'not 15.']}
        notes={['Proposed a guided agent, not an open chat', 'Live on Total Wireless']} />
      <StatAt at={110} prefix="+" value={7} suffix="%" label="Conversion · A/B test, 2,400 users" />
      <Shot src="tello-plans.png" at={40} style={{ left: 900, top: 250, width: 300 }} radius={40} />
      <Shot src="tello-phones.png" at={52} style={{ left: 1230, top: 180, width: 300 }} radius={40} />
      <Shot src="tello-scan.png" at={64} style={{ left: 1560, top: 290, width: 300 }} radius={40} />
    </Stage>
  );
}

function BangOlufsen() {
  return (
    <Stage>
      <Copy eyebrow="HARMAN · Audio by Bang & Olufsen · Experience Designer" lines={['Shaping sound', <><Em>by feel,</Em> not by</>, 'equaliser.']}
        notes={['Shipped in Hyundai and Skoda vehicles', 'Tested in the car with 98 participants']} />
      <StatAt at={110} prefix="−" value={40} suffix="%" label="Interaction time" />
      <Shot src="bo-beosonic.png" at={40} from="right" style={{ left: 840, top: 230, width: 1000 }} />
      <Shot src="bo-signin.png" at={120} from="right" style={{ left: 1160, top: 600, width: 660 }} />
    </Stage>
  );
}

function OneAudio() {
  return (
    <Stage>
      <Copy eyebrow="HARMAN · Harman Kardon · Associate Experience Designer" lines={['Making sound', <>you can <Em>see.</Em></>]}
        notes={['Shown at CES 2024', 'Shipped in BMW and Subaru vehicles']} />
      <StatAt at={110} value={65} suffix="%" label="Faster device setup · ~2,000 participants" />
      <Shot src="oa-hero.png" at={40} from="right" style={{ left: 820, top: 210, width: 1040 }} />
      <Shot src="oa-seatsonic.png" at={120} from="right" style={{ left: 1180, top: 600, width: 660 }} />
    </Stage>
  );
}

function Plug() {
  return (
    <Stage>
      <Copy eyebrow="Plug · Senior Product Designer" lines={['Every overpayment,', <Em>recovered.</Em>]}
        notes={['AI that finds and recovers vendor overpayments', 'Every finding shows its evidence', 'In design · launching December 2026']} />
      <StatAt at={120} value={39} label="Screens · 7 flows" />
      <Shot src="plug-overview.png" at={40} from="right" style={{ left: 860, top: 190, width: 960 }} />
      <Shot src="plug-finding.png" at={130} from="right" style={{ left: 1300, top: 430, width: 560 }} />
      <Shot src="plug-statement.png" at={200} from="right" style={{ left: 980, top: 600, width: 520 }} />
    </Stage>
  );
}

function Bracket() {
  return (
    <Stage>
      <Copy eyebrow="Bracket · Founder and product designer" lines={['An AI memory', <>people can <Em>trust.</Em></>]}
        notes={['Live · v0.4', 'Nothing changes without a person’s approval']} />
      <StatAt at={110} prefix="#" value={9} from={1} label="On Product Hunt" />
      <Shot src="overview.png" at={40} from="right" style={{ left: 840, top: 210, width: 1000 }} />
      <Shot src="review.png" at={120} from="right" style={{ left: 1160, top: 560, width: 680 }} />
    </Stage>
  );
}

function Darpan() {
  return (
    <Stage>
      <Copy eyebrow="DarpanAI · Product, flows and UI, end to end" lines={['From an idea to', 'a finished reel,', <>with <Em>no editing.</Em></>]}
        notes={['Live with paying creators', '32 reels finished in two weeks']} />
      <StatAt at={110} value={65} label="Creators in 2 weeks" />
      <Shot src="darpan-plan.png" at={40} style={{ left: 980, top: 260, width: 280 }} radius={34} />
      <Shot src="darpan-report.png" at={52} style={{ left: 1290, top: 190, width: 280 }} radius={34} />
      <Shot src="darpan-ready.png" at={64} style={{ left: 1600, top: 290, width: 280 }} radius={34} />
    </Stage>
  );
}

function RelayOS() {
  return (
    <Stage>
      <Copy eyebrow="RelayOS · Voice AI for manufacturers" lines={['One voice note', 'to recover a', <Em>delayed order.</Em>]}
        notes={['Calls in Hindi, Tamil and Telugu', 'Concept · full engineering handoff']} />
      <StatAt at={110} value={46} label="Screens · 5 prototype flows" />
      <Shot src="relay-run.png" at={40} from="right" style={{ left: 860, top: 200, width: 820 }} />
      <Shot src="relay-plan.png" at={110} style={{ left: 1560, top: 330, width: 290 }} radius={34} />
    </Stage>
  );
}

/* ---------- sequence ---------- */

const FADE = 24; // frames
const SLIDE = 30;
const isChapter = (i: number) => i === 1 || i === 5;

export const SCENES: [number, () => ReactNode][] = [
  [300, Intro],
  [150, () => <Chapter kicker="Part one" title={<>Shipped at <Em>Verizon</Em> and <Em>HARMAN.</Em></>} />],
  [420, Tello],
  [420, BangOlufsen],
  [420, OneAudio],
  [150, () => <Chapter kicker="Part two" title={<>Products I design <Em>and build.</Em></>} />],
  [480, Plug],
  [420, Bracket],
  [420, Darpan],
  [420, RelayOS],
  [360, Outro],
];

export const DURATION =
  SCENES.reduce((s, [d]) => s + d, 0) - SCENES.slice(1).reduce((s, _, k) => s + (isChapter(k + 1) ? SLIDE : FADE), 0);

export function Showreel() {
  const items: ReactNode[] = [];
  SCENES.forEach(([d, Scene], i) => {
    if (i > 0) {
      items.push(
        isChapter(i) ? (
          <TransitionSeries.Transition key={`t${i}`} presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: SLIDE })} />
        ) : (
          <TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />
        ),
      );
    }
    items.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
        <Scene />
      </TransitionSeries.Sequence>,
    );
  });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
}
