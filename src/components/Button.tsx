import type { ReactNode } from 'react';
import { Magnetic } from './Magnetic';
import { TLink } from './Link';
import { useSound } from '../lib/sound';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'dark';
  to?: string;
  href?: string;
  onClick?: () => void;
  arrow?: string;
  label?: string;
  type?: 'button' | 'submit';
};

/** Pill button: label rolls up on hover, arrow nudges, magnetic pull. */
export function Button({ children, variant = 'primary', to, href, onClick, arrow = '→', label, type = 'button' }: Props) {
  const { tick } = useSound();
  const inner = (
    <>
      <span className="btn__roll">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="btn__arrow">{arrow}</span>
    </>
  );
  const cls = `btn btn--${variant}`;
  return (
    <Magnetic>
      {to ? (
        <TLink to={to} label={label} className={cls}>
          {inner}
        </TLink>
      ) : href ? (
        <a
          href={href}
          className={cls}
          data-cursor="hover"
          onMouseEnter={tick}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
        >
          {inner}
        </a>
      ) : (
        <button type={type} className={cls} data-cursor="hover" onMouseEnter={tick} onClick={onClick}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
