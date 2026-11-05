import { useRef } from 'react';
import { side } from './content';
import { FeaturedRow, SiteFooter, Sparkle } from './parts';
import { useSiteMotion } from './useSiteMotion';

export default function SideProjectsPage() {
  const root = useRef<HTMLDivElement>(null);
  useSiteMotion(root);
  return (
    <div className="s-page" ref={root}>
      <section className="s-side">
        <Sparkle className="s-deco s-deco--sparkle s-side__sparkle" />
        <h1 className="s-side__title" data-in>
          Side <span className="c-coral">projects</span>
        </h1>
        <p className="s-side__sub" data-in>What I build when nobody is asking — currently, an AI product of my own, from research to live beta.</p>
        <div className="s-rows">
          <FeaturedRow p={side} />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
