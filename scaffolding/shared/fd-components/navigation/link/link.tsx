import type { ReactNode, CSSProperties, MouseEvent } from 'react';
import classNames from 'classnames';
import styles from './link.module.scss';

export type LinkProps = {
  href: string;
  children?: ReactNode;
  external?: boolean;
  noStyles?: boolean;
  role?: string;
  tabIndex?: number;
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  style?: CSSProperties;
  className?: string;
};

export function Link({
  href,
  children,
  external: _external = false,
  noStyles = false,
  disabled = false,
  className,
  onClick,
  rel,
  target,
  tabIndex,
  role = 'link',
  style,
}: LinkProps) {
  const linkClassNames = classNames(
    {
      [styles.link]: !noStyles,
      [styles.disabled]: disabled,
    },
    className
  );

  if (disabled) {
    return (
      <span className={linkClassNames} style={style} aria-disabled="true" role={role} tabIndex={tabIndex ?? -1}>
        {children}
      </span>
    );
  }

  const resolvedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);

  return (
    <a
      href={href}
      target={target}
      rel={resolvedRel}
      className={linkClassNames}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      style={style}
    >
      {children}
    </a>
  );
}
