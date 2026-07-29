import type { ReactNode, CSSProperties, MouseEvent } from 'react';
import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './link.module.scss';

export type LinkProps = {
  /**
   * The URL or path for the link.
   */
  href: string;
  /**
   * The content to be displayed within the link.
   */
  children?: ReactNode;
  /**
   * If true, the link will be treated as an external link and rendered as a standard `<a>` tag.
   * Defaults to false.
   */
  external?: boolean;
  /**
   * If true, removes all default styling from the component.
   * Defaults to false.
   */
  noStyles?: boolean;
  /**
   * The role of the link, for accessibility purposes.
   */
  role?: string;
  /**
   * The tab index of the link.
   */
  tabIndex?: number;
  /**
   * If true, the link will be disabled. A disabled link is non-interactive and rendered as a `span`.
   * Defaults to false.
   */
  disabled?: boolean;
  /**
   * The target attribute for the link, e.g., '_blank'. Only applies to external links.
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * The rel attribute for the link, e.g., 'noopener noreferrer'. Only applies to external links.
   */
  rel?: string;
  /**
   * Callback function to be executed when the link is clicked.
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Custom inline styles to be applied to the link.
   */
  style?: CSSProperties;
  /**
   * Custom class name to be applied to the link.
   */
  className?: string;
};

export function Link({
  href,
  children,
  external = false,
  noStyles = false,
  disabled = false,
  className,
  onClick,
  rel,
  target,
  tabIndex,
  role = 'link',
  style,
  ...rest
}: LinkProps) {
  const linkClassNames = classNames(
    {
      [styles.link]: !noStyles,
      [styles.disabled]: disabled,
    },
    className
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if(onClick) {
        onClick(event);
    }
  };

  // Compute externalRel unconditionally at the top level (hooks must not be called conditionally)
  const externalRel = useMemo(() => {
    if (rel) return rel;
    return target === '_blank' ? 'noopener noreferrer' : undefined;
  }, [rel, target]);

  if (disabled) {
    return (
      <span
        className={linkClassNames}
        style={style}
        aria-disabled="true"
        role={role} // Explicitly pass the role
        tabIndex={tabIndex ?? -1} // Ensure disabled elements are not tabbable by default
        {...rest}
      >
        {children}
      </span>
    );
  }

  const commonProps = {
    className: linkClassNames,
    onClick: handleClick,
    tabIndex,
    role,
    style,
    ...rest,
  };

  if (external) {
    return (
      <a href={href} target={target} rel={externalRel} {...commonProps}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...commonProps}>
      {children}
    </RouterLink>
  );
}