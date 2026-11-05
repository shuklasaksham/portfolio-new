import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { profile } from '../data/profile';
import { CORNERS, DotGrid, Glow, Plane, proj } from '../components/Plane';
import { LabelMono } from '../components/Hud';
import { Button } from '../components/Button';
import { useLayout } from '../lib/layout';
import { useUI } from '../lib/ui';
import { gsap, prefersReducedMotion } from '../lib/motion';

const TYPES = ['Full-time role', 'Contract / 0 → 1 project', 'Just saying hi'];

function useBrief() {
  const [type, setType] = useState(TYPES[0]);
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Hi Saksham,\n\n${f.get('message')}\n\n— ${f.get('name')}${f.get('company') ? `, ${f.get('company')}` : ''}\n${f.get('email')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio enquiry — ${type}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return { type, setType, sent, setSent, submit };
}

function useIntro(ref: React.RefObject<HTMLElement | null>) {
  const { entered } = useUI();
  useEffect(() => {
    const el = ref.current;
    if (!el || !entered || prefersReducedMotion()) return;
    const q = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo('.empty-layer', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: q ? 0.01 : 1.6, ease: 'expoOut', delay: 0.2 });
      gsap.to('.empty-layer', { y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });
      gsap.fromTo('[data-intro]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: q ? 0.01 : 1.1, ease: 'expoOut', stagger: 0.07, delay: 0.3 });
    }, el);
    return () => ctx.revert();
  }, [entered, ref]);
}

function Field({ label, name, type = 'text', placeholder, h = 56, area, mobile }: { label: string; name: string; type?: string; placeholder?: string; h?: number; area?: boolean; mobile?: boolean }) {
  return (
    <label className="field col" style={{ gap: mobile ? 8 : 10, width: '100%' }}>
      <span className="t-label c-muted field-label">{label}</span>
      <span className="field-box" style={{ height: h, alignItems: area ? 'flex-start' : 'center', padding: mobile ? '14px 16px' : undefined }}>
        {area ? (
          <textarea name={name} required placeholder={placeholder} style={{ height: '100%', fontSize: mobile ? 16 : 18 }} />
        ) : (
          <input name={name} type={type} required={name !== 'company'} placeholder={placeholder} style={{ fontSize: mobile ? 16 : 18 }} />
        )}
      </span>
    </label>
  );
}

function EmptyLayer({ cx, cy, s, under, mobile }: { cx: number; cy: number; s: number; under: number; mobile?: boolean }) {
  const corners = CORNERS.map(([x, y]) => proj(s, cx, cy, x, y));
  return (
    <div className="empty-layer abs" style={{ inset: 0 }}>
      {Array.from({ length: under }, (_, i) => (
        <Plane key={i} cx={cx} cy={cy + (mobile ? 60 : 110) + i * (mobile ? 12 : 14)} s={s} className="shadow-lg" style={{ opacity: (mobile ? 0.5 - i * 0.15 : 0.5 - i * 0.12) }}>
          <div className="face" style={{ background: 'var(--bg-2)', border: `${1 / s}px solid var(--line)` }} />
        </Plane>
      ))}
      <Plane cx={cx} cy={cy} s={s}>
        <div className="face" style={{ background: 'var(--glass)', border: `${(mobile ? 1.5 : 2) / s}px dashed var(--accent)` }} />
      </Plane>
      {!mobile && (
        <div className="handles">
          {corners.map(([x, y], i) => <i key={i} style={{ left: x, top: y }} />)}
        </div>
      )}
      <a href="#brief" className="add-layer abs" data-cursor="hover" style={{ left: cx, top: cy, transform: 'translate(-50%,-50%)', padding: mobile ? '12px 18px 12px 14px' : undefined, gap: mobile ? 8 : 10 }}>
        <span className={mobile ? 't-hs' : 't-hm'} style={{ lineHeight: 1 }}>+</span>
        <span className="t-label">Add your project</span>
      </a>
    </div>
  );
}

export default function Contact() {
  return useLayout() === 'mobile' ? <ContactMobile /> : <ContactDesktop />;
}

function ContactDesktop() {
  const hero = useRef<HTMLDivElement>(null);
  const b = useBrief();
  useIntro(hero);
  return (
    <div className="page page--contact">
      <div className="hero-frame" ref={hero}>
        <DotGrid opacity={0.07} />
        <Glow x={460} y={300} w={1000} h={520} a={0.32} />
        <EmptyLayer cx={960} cy={420} s={0.5} under={3} />
        <h1 className="abs col" style={{ left: 120, top: 190 }} data-intro>
          <span className="t-xl">Let’s build</span>
          <span className="t-xl">the next</span>
          <span className="t-serif c-accent">layer.</span>
        </h1>
        <div className="abs col" style={{ left: 120, top: 600, gap: 16 }}>
          <span data-intro><LabelMono text="Fastest reply: email" /></span>
          <a href={`mailto:${profile.email}`} className="row" style={{ gap: 14 }} data-cursor="hover" data-intro>
            <span className="t-hm">{profile.email}</span>
            <span className="t-hm c-accent">↗</span>
          </a>
          <div className="row" style={{ gap: 24 }} data-intro>
            <a className="t-label c-muted" href={profile.linkedin} target="_blank" rel="noreferrer" data-cursor="hover">LinkedIn ↗</a>
            <a className="t-label c-muted" href="/resume" data-cursor="hover">Résumé PDF ↓</a>
            <span className="t-label c-muted">sakshamshukla.com</span>
          </div>
        </div>
        <div className="abs" style={{ left: 120, top: 832 }} data-intro>
          <LabelMono text="Or scroll for the form" dot={false} />
        </div>
      </div>

      <section className="sec sec--alt" id="brief" style={{ padding: '110px 120px' }}>
        <div className="row" style={{ gap: 64, alignItems: 'flex-start' }}>
          <div className="col" style={{ width: 420, flex: 'none', gap: 20 }}>
            <span className="t-label c-muted">Send a brief</span>
            <h2 className="t-l">Tell me about your next layer.</h2>
            <p className="t-bl c-muted">A few lines is plenty. I reply within two working days.</p>
            {[['Email', profile.email], ['LinkedIn', 'linkedin.com/in/saksham-shuklaa'], ['Based in', 'India · works remote']].map(([k, v]) => (
              <div key={k} className="col" style={{ gap: 6, paddingTop: 16, borderTop: '1px solid var(--line)', width: '100%' }}>
                <span className="t-label c-accent">{k}</span>
                <span className="t-bl">{v}</span>
              </div>
            ))}
          </div>
          <form onSubmit={b.submit} className="col" style={{ flex: 1, gap: 24, padding: 40, borderRadius: 28, background: 'var(--bg)', border: '1px solid var(--line)' }}>
            {b.sent ? (
              <div className="col" style={{ gap: 16 }}>
                <span className="t-hm" style={{ width: 56, height: 56, borderRadius: 28, background: 'var(--accent)', color: 'var(--bg)', display: 'grid', placeItems: 'center' }}>✓</span>
                <h3 className="t-hm">Your email app should be open.</h3>
                <p className="t-bl c-muted">If nothing happened, write to {profile.email} directly.</p>
                <Button variant="ghost" onClick={() => b.setSent(false)} arrow="↺">Write another</Button>
              </div>
            ) : (
              <>
                <div className="row" style={{ gap: 20, width: '100%' }}>
                  <Field label="Your name" name="name" placeholder="Ada Lovelace" />
                  <Field label="Email" name="email" type="email" placeholder="you@company.com" />
                </div>
                <Field label="Company" name="company" placeholder="Where you work" />
                <div className="col" style={{ gap: 10 }}>
                  <span className="t-label c-muted">What’s this about?</span>
                  <div className="row" style={{ gap: 8 }}>
                    {TYPES.map((t) => (
                      <button type="button" key={t} className={`chip chip--toggle t-label ${b.type === t ? 'is-on' : ''}`} style={{ padding: '10px 16px' }} onClick={() => b.setType(t)} aria-pressed={b.type === t} data-cursor="hover">{t}</button>
                    ))}
                  </div>
                </div>
                <Field label="Message" name="message" placeholder="A couple of lines about the team, the product and the problem…" h={140} area />
                <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <span className="t-data c-faint">No spam. Your details are only used to reply.</span>
                  <Button type="submit">Send brief</Button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
      <footer className="row" style={{ padding: '48px 120px', justifyContent: 'space-between' }}>
        <span className="t-label c-faint">© 2026 Saksham Shukla</span>
        <span className="t-label c-faint">Built layer by layer</span>
      </footer>
    </div>
  );
}

function ContactMobile() {
  const hero = useRef<HTMLDivElement>(null);
  const b = useBrief();
  useIntro(hero);
  return (
    <div className="page page--contact-m">
      <div className="hero-frame" ref={hero} style={{ height: 760 }}>
        <DotGrid step={20} opacity={0.07} size={1} />
        <Glow x={-60} y={140} w={520} h={300} a={0.32} />
        <EmptyLayer cx={195} cy={240} s={0.3} under={2} mobile />
        <h1 className="abs col" style={{ left: 20, top: 430 }} data-intro>
          <span className="t-l" style={{ fontSize: 40 }}>Let’s build the next</span>
          <span className="t-serif c-accent" style={{ fontSize: 56 }}>layer.</span>
        </h1>
        <div className="abs col" style={{ left: 20, top: 600, gap: 12 }}>
          <span data-intro><LabelMono text="Fastest reply: email" /></span>
          <a href={`mailto:${profile.email}`} className="t-hs" data-intro>{profile.email}</a>
          <div className="row" style={{ gap: 18 }} data-intro>
            <a className="t-label c-muted" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="t-label c-muted" href="/resume">Résumé PDF ↓</a>
          </div>
        </div>
      </div>
      <section className="sec sec--alt" id="brief" style={{ padding: '44px 20px 80px', gap: 18 } as CSSProperties}>
        <h2 className="t-hm" style={{ fontSize: 28 }}>Tell me about your next layer.</h2>
        {b.sent ? (
          <div className="col" style={{ gap: 12 }}>
            <h3 className="t-hs">Your email app should be open.</h3>
            <Button variant="ghost" onClick={() => b.setSent(false)} arrow="↺">Write another</Button>
          </div>
        ) : (
          <form onSubmit={b.submit} className="col" style={{ gap: 18, width: '100%' }}>
            <Field label="Your name" name="name" placeholder="Ada Lovelace" h={52} mobile />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" h={52} mobile />
            <div className="col" style={{ gap: 8 }}>
              <span className="t-label c-muted">What’s this about?</span>
              <div className="row wrap" style={{ gap: 8 }}>
                {['Full-time role', 'Contract / 0 → 1', 'Just saying hi'].map((t, i) => (
                  <button type="button" key={t} className={`chip chip--toggle t-label ${b.type === TYPES[i] ? 'is-on' : ''}`} style={{ padding: '9px 14px' }} onClick={() => b.setType(TYPES[i])}>{t}</button>
                ))}
              </div>
            </div>
            <Field label="Message" name="message" placeholder="A couple of lines about the team and the problem…" h={120} area mobile />
            <Button type="submit">Send brief</Button>
          </form>
        )}
      </section>
    </div>
  );
}
