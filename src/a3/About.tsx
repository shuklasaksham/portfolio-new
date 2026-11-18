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

const COMPANIES = [
  { key: 'verizon', name: 'Verizon India', logo: '/img/logos/verizon.svg', w: 2007, h: 450 },
  { key: 'harman', name: 'Harman International India', logo: '/img/logos/harman.svg', w: 750, h: 439 },
] as const;
type CompanyKey = (typeof COMPANIES)[number]['key'];
const rolesAt = (k: CompanyKey) => about.employment.filter((e) => e.logo === k);

/** Big company logos. Hovering, focusing or tapping one slides its roles in below. */
function Employment() {
  const [active, setActive] = useState<CompanyKey | null>(null);
  return (
    <section className="emp" aria-labelledby="emp-title">
      <div className="emp__top">
        <h2 id="emp-title" className="emp__h">Employment history</h2>
        <p className="emp__total"><span suppressHydrationWarning>{fmt(totalMonths(about.employment))}</span> total</p>
      </div>
      <div className="emp__cos" role="tablist" aria-label="Companies">
        {COMPANIES.map((c) => {
          const roles = rolesAt(c.key);
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              id={`emp-tab-${c.key}`}
              aria-selected={active === c.key}
              aria-controls={`emp-panel-${c.key}`}
              className={`emp__co emp__co--${c.key}${active === c.key ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(c.key)}
              onFocus={() => setActive(c.key)}
              onClick={() => setActive(c.key)}
            >
              <img src={c.logo} width={c.w} height={c.h} alt={c.name} />
              <span className="emp__co-meta">
                <span suppressHydrationWarning>{fmt(totalMonths(roles))}</span> · {roles.length} {roles.length > 1 ? 'roles' : 'role'}
              </span>
            </button>
          );
        })}
      </div>
      {!active && <p className="emp__hint">Hover over a company to see my roles there.</p>}
      {COMPANIES.map((c) => (
        <div
          key={c.key}
          id={`emp-panel-${c.key}`}
          role="tabpanel"
          aria-labelledby={`emp-tab-${c.key}`}
          className="emp__panel"
          hidden={active !== c.key}
        >
          {rolesAt(c.key).map((e) => (
            <article key={e.role} className="emp__role">
              <h3>{e.role} <span>· {e.company}</span></h3>
              <p className="emp__dates">
                {e.dates} · <span suppressHydrationWarning>{fmt(months(e))}</span> · {e.place}
              </p>
              <ul className="emp__list">
                {e.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
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
