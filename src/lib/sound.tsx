import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

// Generated ambient drone + UI ticks with WebAudio — no audio files to download.
type Sound = { on: boolean; toggle: (v?: boolean) => void; tick: () => void };
const Ctx = createContext<Sound>({ on: false, toggle: () => {}, tick: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);

  const ensure = () => {
    if (ctxRef.current) return ctxRef.current;
    const ac = new AudioContext();
    const gain = ac.createGain();
    gain.gain.value = 0;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 6;
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    for (const [f, type, det] of [[55, 'sine', 0], [82.4, 'sine', 4], [110, 'triangle', -6], [164.8, 'sine', 3]] as const) {
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = det;
      const g = ac.createGain();
      g.gain.value = f > 150 ? 0.18 : 0.35;
      o.connect(g).connect(filter);
      o.start();
    }
    filter.connect(gain).connect(ac.destination);
    ctxRef.current = ac;
    master.current = gain;
    return ac;
  };

  const toggle = useCallback((v?: boolean) => {
    const next = v ?? !on;
    const ac = ensure();
    if (ac.state === 'suspended') ac.resume();
    const g = master.current!.gain;
    g.cancelScheduledValues(ac.currentTime);
    g.setTargetAtTime(next ? 0.06 : 0, ac.currentTime, next ? 1.2 : 0.25);
    setOn(next);
  }, [on]);

  const tick = useCallback(() => {
    if (!on || !ctxRef.current) return;
    const ac = ctxRef.current;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = 1320;
    g.gain.setValueAtTime(0.018, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08);
    o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + 0.09);
  }, [on]);

  return <Ctx.Provider value={{ on, toggle, tick }}>{children}</Ctx.Provider>;
}

export const useSound = () => useContext(Ctx);
