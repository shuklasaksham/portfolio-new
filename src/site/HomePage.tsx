import { useRef } from 'react';
import { scrollToEl } from '../lib/scroll';
import { getZoom } from '../lib/layout';
import { featured, hero, whyMe } from './content';
import { BrandStrip, Burst, DrawnArrow, FeaturedRow, Photo, SiteFooter, SLink, Sparkle, Sunburst, Swoosh } from './parts';
import { useSiteMotion } from './useSiteMotion';

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const work = useRef<HTMLElement>(null);
  useSiteMotion(root);

  return (
    <div className="s-page" ref={root}>
      <section className="s-hero">
        <Sparkle className="s-deco s-deco--sparkle" />
        <h1 className="s-hero__title">
          {hero.lines.map((l) => (
            <span key={l} className="s-line" data-in>{l}</span>
          ))}
          <span className="s-line s-script c-coral" data-in>{hero.script}</span>
          <span className="s-line" data-in>{hero.last}</span>
        </h1>
        <div className="s-hero__copy" data-in>
          {hero.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <SLink to="/resume" className="s-pill s-pill--lg s-hero__cta" data-in>View Résumé</SLink>
        <div className="s-hero__photo" data-in>
          <Photo />
        </div>
        <Sunburst className="s-deco s-deco--sun" />
        <Burst className="s-deco s-deco--burst" />
        <button className="s-down" aria-label="Scroll to featured work" onClick={() => work.current && scrollToEl(work.current, 100 * getZoom())}>
          ↓
        </button>
      </section>

      <section className="s-featured" ref={work} id="work">
        <h2 className="s-h2" data-reveal>
          Featured <span className="c-coral">work</span>
        </h2>
        <div className="s-rows">
          {featured.map((p) => (
            <FeaturedRow key={p.slug} p={p} />
          ))}
        </div>
        <SLink to="/side-projects" className="s-more">
          Side project: Bracket <span aria-hidden>»</span>
        </SLink>
      </section>

      <BrandStrip />

      <section className="s-why">
        <div className="s-why__head">
          <h2 className="s-why__title">
            Why <span className="s-why__me">me?<Swoosh className="s-why__swoosh" /></span>
            <DrawnArrow className="s-why__arrow" />
          </h2>
          <p className="s-why__sub">Five habits, each with proof.</p>
        </div>
        <div className="s-why__cards">
          {whyMe.map((w, i) => (
            <article key={w.title} className="s-card" style={{ background: w.bg }}>
              <span className="s-card__num">0{i + 1}</span>
              <div className="s-card__body">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <SLink to={`/work/${w.proof[1]}`} className="s-card__proof">
                  See it in {w.proof[0]} →
                </SLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
