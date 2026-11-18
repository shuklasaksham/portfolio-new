import { useState } from 'react';
import { about, resume } from './content';
import { ProfilePage, Socials } from './Profile';
import { HarmanLogo, TOOL_ICONS, VerizonLogo } from './brand';
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

/** One role: logo, title, dates with duration, and every bullet. */
function Job({ e }: { e: Employment }) {
  return (
    <article className="emp__job" data-rv>
      <span className={`emp__logo emp__logo--${e.logo}`} aria-hidden="true">
        {e.logo === 'verizon' ? <VerizonLogo /> : <HarmanLogo />}
      </span>
      <div className="emp__main">
        <h3>{e.role} | {e.company}</h3>
        <p className="emp__dates">
          {e.dates} · <span suppressHydrationWarning>{fmt(months(e))}</span> · {e.place}
        </p>
        <ul className="emp__list">
          {e.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>
    </article>
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

      <section className="emp" aria-labelledby="emp-title">
        <div className="emp__top">
          <h2 id="emp-title" className="emp__h">Employment history</h2>
          <p className="emp__total"><span suppressHydrationWarning>{fmt(totalMonths(about.employment))}</span> total</p>
        </div>
        {about.employment.map((e) => <Job key={e.role} e={e} />)}
      </section>

    </ProfilePage>
  );
}
