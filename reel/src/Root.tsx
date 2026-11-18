import { Composition } from 'remotion';
import { DURATION, Showreel } from './Showreel';

export const Root = () => (
  <Composition id="Showreel" component={Showreel} durationInFrames={DURATION} fps={60} width={1920} height={1080} />
);
