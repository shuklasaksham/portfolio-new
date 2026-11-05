// Copy for the hero "layer focus" state (Figma frame 03 — Home / Drag + layer focus).
export type LayerDetail = { title: string; text: string; facts: [string, string][] };

export const layerDetails: Record<string, LayerDetail[]> = {
  bracket: [
    { title: 'Research', text: '19 scenario areas mapped and 8 principles set before a single screen was drawn.', facts: [['Project', 'Bracket 2.0'], ['Method', 'Scenario map'], ['Output', '8 principles']] },
    { title: 'Tokens', text: 'Primitives → semantic colour with measured contrast. Neutral surfaces; colour reserved for status.', facts: [['Project', 'Bracket 2.0'], ['Type', 'Urbanist · JetBrains Mono'], ['Access', 'AA · 44px targets']] },
    { title: 'Components', text: '53 components across nav, memory, attention, change review and auth — every state designed as a real screen, not a footnote.', facts: [['Project', 'Bracket 2.0'], ['Grid', '4px'], ['Access', 'AA · 44px targets']] },
    { title: 'Screens', text: '173 product screens across desktop and mobile, from first sign-in to change review and billing.', facts: [['Project', 'Bracket 2.0'], ['Desktop', '90 screens'], ['Mobile', '83 screens']] },
    { title: 'Prototype', text: 'Two clickable prototypes — 227 screens and 11 end-to-end flows — handed off dev-ready.', facts: [['Project', 'Bracket 2.0'], ['Flows', '11 end-to-end'], ['Status', 'Live · v0.4']] },
  ],
  'one-audio': [
    { title: 'Define', text: 'Car matrix, requirements and the 15-step CES demo script — which became the journey to design for.', facts: [['Project', 'One Audio'], ['Demo', '5:40 · 15 steps'], ['Cars', '3']] },
    { title: 'Design', text: 'UX flows and UI for Home, Media, Mood, Sound and System, then the variants for each car.', facts: [['Project', 'One Audio'], ['Displays', '5 formats'], ['Client', 'Harman Kardon']] },
    { title: 'Bring to life', text: '3D seat renders, mood scenes, light themes and micro-animations, handed off for motion.', facts: [['Project', 'One Audio'], ['Light', '5 themes'], ['Moods', 'Nature scenes']] },
    { title: 'Ship', text: 'Adaptation rules for every display and a design-vs-build review for every version up to demo day.', facts: [['Project', 'One Audio'], ['Shown', 'CES 2025'], ['Setup', '65% faster']] },
  ],
  'hyundai-bo': [
    { title: 'Align', text: 'A two-day workshop with B&O set the feature map and priorities for every section.', facts: [['Project', 'Hyundai × B&O'], ['Audio', '18 speakers'], ['Car', 'Tucson']] },
    { title: 'Explore', text: 'Wireframes for the gesture model and both tiers — signed out and signed in.', facts: [['Project', 'Hyundai × B&O'], ['Tiers', '2'], ['Sign-in', '1 QR code']] },
    { title: 'Design', text: 'Visual design per section, each reviewed and approved with B&O before production.', facts: [['Project', 'Hyundai × B&O'], ['Modes', '6 + custom'], ['AI', 'Beosonic AI']] },
    { title: 'Test & refine', text: 'In-car sessions testing screen and ambient light together, then UI and light fixes.', facts: [['Project', 'Hyundai × B&O'], ['Faster', '40%'], ['Satisfaction', '76%']] },
  ],
  tello: [
    { title: 'Audit', text: 'Mapped the existing activation and purchase flows: 12+ form screens across web and app.', facts: [['Project', 'tello.ai'], ['Client', 'Total Wireless'], ['Flows', '2 use cases']] },
    { title: 'Script', text: 'Wrote the conversation first — turns, branches, help text and failure paths — before any UI.', facts: [['Project', 'tello.ai'], ['Steps', '5 visible'], ['Scans', 'IMEI · SIM · PIN']] },
    { title: 'Design', text: 'A dark, focused agent UI with scanning states, a stepper, rich cards and keypads.', facts: [['Project', 'tello.ai'], ['States', '20+'], ['Fallback', 'Manual entry']] },
    { title: 'Tell the story', text: 'Storyboard and interactive prototype for leadership — then an A/B test with 2,400 users.', facts: [['Project', 'tello.ai'], ['Speed', '5× faster'], ['Conversion', '+7%']] },
  ],
};
