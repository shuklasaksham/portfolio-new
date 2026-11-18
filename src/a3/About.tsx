import { useState } from 'react';
import { about, resume } from './content';
import { ProfilePage, Socials } from './Profile';
import { TOOL_ICONS } from './brand';
import { useReveal } from './ui';

const SKILLS = resume.skills.filter(([k]) => k !== 'Tools').flatMap(([, v]) => v.split(', '));
const TOOLS = (resume.skills.find(([k]) => k === 'Tools')?.[1] ?? '').split(', ').filter(Boolean);
const SHOWN = 8;

function SideCard() {
  const [all, setAll] = useState(false);
  const shown = all ? SKILLS : SKILLS.slice(0, SHOWN);
  return (
    <aside className="pf__card" aria-label="Skills, tools and details">
      <p className="pf__card-h">Skills</p>
      <p className="pf__chips">
        {shown.map((s) => <span key={s} className="pf__chip">{s}</span>)}
        {!all && SKILLS.length > SHOWN && (
          <button type="button" className="pf__chip pf__chip--more" onClick={() => setAll(true)} aria-label={`Show ${SKILLS.length - SHOWN} more skills`}>
            +{SKILLS.length - SHOWN}
          </button>
        )}
      </p>
      <p className="pf__card-h">Tools</p>
      <p className="pf__chips">
        {TOOLS.map((t) => {
          const Icon = TOOL_ICONS[t];
          return <span key={t} className="pf__chip pf__chip--tool">{Icon && <Icon />}{t}</span>;
        })}
      </p>
      <p className="pf__card-h">Details</p>
      <ul className="pf__details">
        {about.details.map(([k, v]) => <li key={k}><span className="sr-only">{k}: </span>{v}</li>)}
      </ul>
      <Socials />
    </aside>
  );
}

type Employment = (typeof about.employment)[number];

// Months counted the way LinkedIn does: both the first and the last month count.
const toIndex = (ym: string) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const nowIndex = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };
const span = (e: Employment) => [toIndex(e.start), e.end ? toIndex(e.end) : nowIndex()] as const;
function fmt(months: number) {
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}
const months = (e: Employment) => { const [a, b] = span(e); return b - a + 1; };
/** Total time employed, counting a month shared by two roles only once. */
function totalMonths(list: readonly Employment[]) {
  const seen = new Set<number>();
  list.forEach((e) => { const [a, b] = span(e); for (let k = a; k <= b; k++) seen.add(k); });
  return seen.size;
}

const LOGO = {
  verizon: { src: '/img/logos/verizon.svg', w: 2007, h: 450 },
  harman: { src: '/img/logos/harman-white.svg', w: 750, h: 439 },
} as const;

/**
 * Employment history as a career timeline: one bar per role, sized to its real length,
 * that grows in when the section scrolls into view. Hovering, focusing or tapping a role
 * slides its details in, bullets one after another. The current role shows first.
 */
function Employment() {
  const jobs = [...about.employment].reverse(); // oldest first, left to right
  const [active, setActive] = useState(jobs.length - 1);
  const first = toIndex(jobs[0].start);
  const last = nowIndex();
  const length = last - first + 1;
  const years: number[] = [];
  for (let y = Math.floor(first / 12); y * 12 <= last; y++) years.push(y);
  return (
    <section className="cx" aria-labelledby="cx-title" data-rv>
      <div className="cx__head">
        <div>
          <p className="cx__eyebrow">Employment history</p>
          <h2 id="cx-title" className="cx__title">Designing AI and in-car products <em>since 2022.</em></h2>
        </div>
        <p className="cx__total">
          <b suppressHydrationWarning>{fmt(totalMonths(about.employment))}</b>
          <span>Total experience</span>
        </p>
      </div>

      <div className="cx__track" role="tablist" aria-label="Roles">
        {jobs.map((j, i) => (
          <button
            key={j.role}
            type="button"
            role="tab"
            id={`cx-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`cx-panel-${i}`}
            className={`cx__seg${i === active ? ' is-active' : ''}`}
            style={{ flexGrow: months(j), ['--d' as string]: `${i * 140}ms` }}
            suppressHydrationWarning
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="cx__seg-co">{j.logo === 'verizon' ? 'Verizon' : 'HARMAN'}</span>
            <span className="cx__seg-role">{j.role}</span>
            <span className="cx__bar" aria-hidden="true" />
            <span className="cx__seg-time" suppressHydrationWarning>{fmt(months(j))}</span>
          </button>
        ))}
      </div>
      <div className="cx__years" aria-hidden="true">
        {years.map((y) => (
          <span key={y} style={{ left: `${Math.max(0, ((y * 12 - first) / length) * 100)}%` }} suppressHydrationWarning>{y}</span>
        ))}
      </div>

      {jobs.map((j, i) => (
        <div key={j.role} id={`cx-panel-${i}`} role="tabpanel" aria-labelledby={`cx-tab-${i}`} className="cx__panel" hidden={i !== active}>
          <div className="cx__who">
            <img className={`cx__logo cx__logo--${j.logo}`} src={LOGO[j.logo].src} width={LOGO[j.logo].w} height={LOGO[j.logo].h} alt={j.company} />
            <h3>{j.role}</h3>
            <p className="cx__co">{j.company}</p>
            <p className="cx__dates">
              {j.dates} · <span suppressHydrationWarning>{fmt(months(j))}</span> · {j.place}
            </p>
          </div>
          <ul className="cx__list">
            {j.bullets.map((b, k) => <li key={b} style={{ ['--i' as string]: k }}>{b}</li>)}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default function About() {
  useReveal('about');
  return (
    <ProfilePage className="pf--about">
      <div className="pf__about">
        <div className="pf__meet">
          <p className="pf__meet-h">
            <img src="/img/portrait.webp" width={820} height={1025} alt="" />
            <span>Meet Saksham</span>
          </p>
          <h2 className="sr-only">About</h2>
          {about.bio.map((p) => <p key={p} className="pf__bio">{p}</p>)}
        </div>
        <SideCard />
      </div>

      <Employment />

    </ProfilePage>
  );
}
