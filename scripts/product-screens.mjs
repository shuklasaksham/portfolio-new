// Converts the final product screens exported from each project's Figma file
// (assets-src/figma2/<slug>/ preferred, else assets-src/figma/<slug>/) into web images
// at public/img/p/<slug>/<name>.webp, and writes src/a3/screens.json with sizes and captions.
// Run: node scripts/product-screens.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const CAPTIONS = {
  tello: [
    ['01-home-landing', 'Home: one question, quick replies and four clear starting points'],
    ['02-plan-cards', 'Plans arrive as cards inside the conversation'],
    ['03-plan-lines-stepper', 'Choose lines with a stepper; the plan stays pinned'],
    ['04-phone-selection', 'Phones that come with the plan, as cards'],
    ['05-bring-number-keypad', 'Bring your number with a keypad in the chat'],
    ['06-cart-review', 'Review the cart without leaving the conversation'],
    ['07-checkout', 'Checkout: log in or continue as a guest'],
    ['08-activation-start', 'Activation: five steps, one question at a time'],
    ['09-imei-scan', 'Scan the IMEI off the box'],
    ['10-sim-card-scan', 'Scan the SIM card number'],
    ['11-pin-entry', 'Enter the plan PIN'],
    ['12-configure-steps', 'Set up the eSIM, step by step'],
    ['13-welcome', 'Activated: welcome to Total Wireless'],
  ],
  'bang-olufsen': [
    ['05-beosonic-sound-circle', 'Beosonic: one dot on two feel-based axes'],
    ['06-beosonic-sound-modes-custom', 'Sound modes, with Custom as soon as you move the dot'],
    ['07-beosonic-ai-request', 'Ask for a sound in plain words'],
    ['08-beosonic-ai-result', 'The AI answer lands on the same circle, with why it fits'],
    ['04-sound-focus-seats', 'Sound Focus: tune for the driver, the front row or every seat'],
    ['03-system-overview', 'System overview: the car’s speakers in 3D, with a gestures guide'],
    ['01-qr-sign-in', 'Sign in with one QR code: benefits first, then scan to pair'],
    ['02-home-personalized', 'Signed-in home: stories, recently played and radio near you'],
    ['09-beoscapes-adjustment', 'Beoscapes: an illustrated soundscape with its own dial'],
    ['10-media-featured', 'Media: featured releases and playlists'],
    ['11-media-jukebox', 'Jukebox: a shared queue for the road trip'],
    ['12-bo-radio', 'B&O Radio: stations near you and for you'],
  ],
  'harman-kardon': [
    ['01-home', 'Home: the car’s seats and speakers in 3D'],
    ['02-now-playing', 'Now playing'],
    ['03-media-qobuz-home', 'Media: Qobuz, with a Harman Kardon curated playlist'],
    ['04-media-album-details', 'Album details'],
    ['05-mood-pacific-whisper', 'Mood: the Pacific Whisper scene'],
    ['06-seatsonic-seat-audio', 'Seatsonic: audio for each seat'],
    ['07-seatsonic-bass-impact', 'Seatsonic: bass impact, made visible'],
    ['08-seatsonic-personi-fi', 'Personi-Fi: tune the sound to your ears'],
    ['09-system-overview', 'System overview: every speaker in the cabin'],
    ['10-system-ambient-light-custom', 'Ambient light in your own colour'],
  ],
  'harman-kardon-formats': [
    ['11-wide-ivi-seatsonic', 'Seatsonic reflowed to a wide, short display'],
    ['12-wide-ivi-mood', 'Mood on the wide display'],
    ['13-passenger-screen-home', 'Home on the passenger display'],
    ['14-tablet-home', 'Home reflowed to a taller tablet display'],
  ],
  bracket: [
    ['01-onboarding-connect-sources', 'Onboarding: connect Gmail and Slack, with a clear retry when one fails'],
    ['02-onboarding-choose-what-bracket-reads', 'Choose exactly which threads Bracket reads'],
    ['03-onboarding-learning', 'Learning live: what it has found so far, by category'],
    ['04-overview', 'Overview: what needs you, split from what just happened'],
    ['05-change-review', 'Change review: the source on the left, the proposed update on the right'],
    ['06-resolve-conflict', 'Resolve a conflict between two sources'],
    ['07-memory-commitments', 'Memory: every commitment with its evidence and history'],
    ['08-memory-source-evidence', 'Open the original message a memory came from'],
    ['09-conversations-draft-reply', 'Conversations: an AI-drafted reply that cites its sources'],
    ['10-timeline', 'Timeline: every change, with restore'],
    ['11-source-detail-gmail', 'Source settings: what Bracket reads, and how to stop it'],
    ['12-empty-new-workspace', 'Empty state: nothing to remember yet, and how to start'],
    ['13-mobile-overview', 'Mobile overview'],
    ['14-mobile-change-review', 'Mobile change review'],
  ],
  darpan: [
    ['01-welcome', 'Welcome: shoot your first reel'],
    ['02-home-idea', 'Say or type the idea, in Hinglish, Hindi or English'],
    ['03-home-listening', 'Or speak it'],
    ['04-shot-plan', 'The script: shots, lines and framing, ready to shoot'],
    ['05-live-coaching', 'Live coaching: teleprompter, framing guide and a light tip'],
    ['06-countdown', 'A countdown before the take'],
    ['07-recording', 'Recording, with the line highlighted as you speak'],
    ['08-checking-take', 'Checking the take: words first, then director’s notes'],
    ['09-take-review', 'Take report: a score, sub-scores and three things to try'],
    ['10-your-shots', 'Your shots: the best takes, kept in order'],
    ['11-making-reel', 'Making the reel: captions, trims and joins'],
    ['12-reel-ready', 'Your reel is ready to share'],
    ['14-colour-tokens', 'Semantic colour tokens from the Darpan design system'],
  ],
  relayos: [
    ['02-whatsapp-voice-note', 'The owner reports a delay with one WhatsApp voice note'],
    ['03-whatsapp-plan-approval', 'The plan comes back with one decision: approve ₹800?'],
    ['06-whatsapp-confirmed-checkins', 'Approved: pickup locked, check-in calls scheduled'],
    ['07-whatsapp-slip-replan', 'A slip breaks the plan: a new plan and one new decision'],
    ['08-whatsapp-run-closed', 'Shipped on time: the run summary'],
    ['09-whatsapp-morning-digest', 'Morning digest: every open order and what needs you'],
    ['13-whatsapp-contact-opts-out', 'A contact opts out of AI calls with one word'],
    ['04-web-run-decision', 'Live run: plan, calls with transcripts, and what RelayOS did'],
    ['05-web-run-mobile', 'The same run on mobile web'],
    ['10-web-home', 'Workspace home: what needs you, coming due, recent recoveries'],
    ['11-web-contacts', 'Contacts with languages and promises kept; opt-outs respected'],
    ['12-web-settings', 'Settings: calling hours, languages and the daily check'],
  ],
};

const out = {};
for (const [key, list] of Object.entries(CAPTIONS)) {
  const slug = key.replace('-formats', '');
  const dir = ['figma2', 'figma'].map((d) => resolve('assets-src', d, slug)).find((d) => list.every(([n]) => existsSync(resolve(d, `${n}.png`))))
    ?? resolve('assets-src', 'figma', slug);
  const dest = resolve('public/img/p', slug);
  mkdirSync(dest, { recursive: true });
  out[key] = [];
  for (const [name, caption] of list) {
    let src = resolve(dir, `${name}.png`);
    if (!existsSync(src)) src = resolve('assets-src/figma2', slug, `${name}.png`);
    if (!existsSync(src)) src = resolve('assets-src/figma', slug, `${name}.png`);
    if (!existsSync(src)) { console.warn(`missing ${slug}/${name}`); continue; }
    // Buffers, not paths: these paths can exceed Windows' 260-character limit.
    const input = readFileSync(src);
    const meta = await sharp(input).metadata();
    const tall = meta.height > meta.width * 1.4;
    const maxW = tall ? 1125 : 2400;
    const { data, info: r } = await sharp(input).resize({ width: Math.min(meta.width, maxW), withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toBuffer({ resolveWithObject: true });
    writeFileSync(resolve(dest, `${name}.webp`), data);
    out[key].push({ src: `/img/p/${slug}/${name}.webp`, w: r.width, h: r.height, alt: caption });
  }
  console.log(`${key}: ${out[key].length} screens`);
}
writeFileSync(resolve('src/a3/screens.json'), JSON.stringify(out, null, 2) + '\n');
