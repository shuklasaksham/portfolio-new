import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useGo } from '../lib/transition';
import { useSound } from '../lib/sound';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; label?: string; cursor?: string; children: ReactNode };

/** Internal link that plays the layered page transition. */
export function TLink({ to, label, cursor = 'hover', children, onClick, ...rest }: Props) {
  const go = useGo();
  const { tick } = useSound();
  return (
    <a
      href={to}
      data-cursor={cursor}
      onMouseEnter={tick}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        go(to, { label });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
