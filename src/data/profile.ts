// Source: "05 — Resume (ATS)" page in the Figma file.

export const profile = {
  name: 'Saksham Shukla',
  role: 'Product Designer',
  headline: 'Product Designer | AI, Conversational & Automotive UX',
  email: 'shuklasaksham01@gmail.com',
  linkedin: 'https://linkedin.com/in/saksham-shuklaa',
  linkedinLabel: 'linkedin.com/in/saksham-shuklaa',
  site: 'sakshamshukla.com',
  location: 'India · works remote',
  summary:
    'Product designer with 4.5+ years leading end-to-end design for AI-powered, conversational and in-vehicle products at Verizon and HARMAN, and founder of Bracket, an AI-native decision OS.',
  glance: [
    ['4.5+', 'years designing products'],
    ['4', 'products shipped or validated'],
    ['3', 'companies: HARMAN, Verizon, Bracket'],
    ['CES', '2025 — work shown on the show floor'],
  ] as [string, string][],
  pillars: [
    {
      title: 'AI & conversational UX',
      text: 'Agents and AI features people actually trust — with evidence, confidence and an easy way back.',
      proof: [['tello.ai', 'tello'], ['Bracket 2.0', 'bracket']],
    },
    {
      title: 'Automotive & multi-screen HMI',
      text: 'Experiences that work at arm’s length, across five displays and a moving car.',
      proof: [['One Audio', 'one-audio'], ['Hyundai × B&O', 'hyundai-bo']],
    },
    {
      title: 'Systems & craft',
      text: 'Token-based systems, dev-ready specs and pixel-level QA through to launch.',
      proof: [['53 components', 'bracket'], ['UI QA', 'one-audio']],
    },
  ],
  habits: [
    ['Design for the real moment of use', 'At CES, the demo script was the user journey.', 'One Audio'],
    ['Write the conversation first', 'Script the turns before drawing a screen.', 'tello.ai'],
    ['Humans control change', 'AI proposes; people decide. Always with receipts.', 'Bracket 2.0'],
    ['Shipping is a design job', 'Review every build side by side, down to the pixel.', 'One Audio'],
  ] as [string, string, string][],
  brands: ['HARMAN', 'Harman Kardon', 'Hyundai', 'Bang & Olufsen', 'Verizon', 'Total Wireless', 'Bracket'],
  tools: ['Figma', 'FigJam', 'ProtoPie', 'Framer', 'After Effects', 'Photoshop', 'Miro', 'Notion', 'Cursor', 'Design tokens', 'Usability testing', 'Journey mapping', 'Conversation design', 'Voice UI'],
  experience: [
    {
      years: '2026 – Present',
      role: 'Founder & Product Designer',
      company: 'Bracket · side venture',
      place: 'Remote',
      slug: 'bracket',
      bullets: [
        'Built an AI decision OS for freelancers and small teams, adopted by 148 users who created 115 projects and generated 90 client-ready questions automatically from raw briefs.',
        'Led product strategy, research and design from concept to launch; 18 projects completed through the platform.',
        'Designed human-in-the-loop AI workflows that turn unstructured client conversations into structured decisions, with evidence and confidence shown for every AI claim.',
        'Built a tokenized design system (53 components) and 170+ desktop and mobile screens, with clickable prototypes for developer handoff.',
      ],
    },
    {
      years: '2025 – Present',
      role: 'Experience Designer II',
      company: 'Verizon',
      place: 'Remote, India',
      slug: 'tello',
      bullets: [
        'Designed tello.ai, an AI conversational assistant for Total Wireless; in a 4-week A/B test with 2,400 users, plan selection became 5× faster, conversion rose 7%, CSAT rose 12% and funnel drop-off fell 6%.',
        'Extended tello.ai into an agentic phone-activation flow that replaces a 12+ screen form with one conversation, using camera scanning for IMEI, SIM and plan PIN.',
        'Led end-to-end design from research to high-fidelity UI with product managers and engineers.',
      ],
    },
    {
      years: '2024 – 2025',
      role: 'Experience Designer',
      company: 'HARMAN International',
      place: 'Bengaluru',
      slug: 'hyundai-bo',
      bullets: [
        'Redesigned the in-vehicle audio interaction model for a Hyundai × Audio by Bang & Olufsen concept, validated in the car: navigation from 3 layers to 1, interaction time cut by 40%.',
        'Achieved 76% user satisfaction while reducing driver distraction by 10%.',
        'Partnered with engineering to ship production-ready experiences across global vehicle platforms.',
      ],
    },
    {
      years: '2022 – 2024',
      role: 'Associate Experience Designer',
      company: 'HARMAN International',
      place: 'Bengaluru',
      slug: 'one-audio',
      bullets: [
        'Designed One Audio, a connected multi-device experience for Harman Kardon: 65% faster device setup, +13% multi-device usage; showcased in HARMAN’s AutoOne cockpit at CES 2025.',
        'Achieved a 4.2 prototype satisfaction rating, with a projected 55% reduction in support requests.',
        'Supported end-to-end design from research through developer handoff on the connected-audio design system.',
      ],
    },
  ],
  skills: [
    ['AI & emerging tech', ['AI-assisted design', 'Conversational UX', 'Agentic AI', 'Human-AI interaction', 'Voice UI', 'Prompt-driven workflows']],
    ['Product design', ['UX & UI design', 'Interaction design', 'Information architecture', 'User flows', 'Prototyping', 'Automotive HMI']],
    ['Product & strategy', ['Product strategy', '0 → 1 development', 'Roadmapping', 'Stakeholder alignment', 'Cross-functional collaboration']],
    ['Design systems', ['Component libraries', 'Design tokens', 'Atomic design', 'Accessibility', 'Documentation']],
    ['Research', ['User interviews', 'Usability testing', 'Journey mapping', 'Competitive analysis', 'Design validation']],
    ['Tools', ['Figma', 'FigJam', 'ProtoPie', 'Framer', 'Photoshop', 'After Effects', 'Miro', 'Notion']],
  ] as [string, string[]][],
  education: {
    years: '2018 – 2022',
    degree: 'B.Tech, Electrical & Electronics Engineering',
    school: 'United College of Engineering & Research, Prayagraj',
  },
  career: [
    ['2022', 'HARMAN'],
    ['2024', 'HARMAN'],
    ['2025', 'Verizon'],
    ['2026', 'Bracket'],
  ] as [string, string][],
};
