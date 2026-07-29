import React, { type CSSProperties, type ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from '@api-banking/design.navigation.link';
import { DefaultLogoIcon } from './default-logo-icon.js';
import styles from './logo.module.scss';

export type LogoProps = {
  /**
   * The name of the brand to display alongside the logo icon.
   * @default 'API Banking'
   */
  name?: string;

  /**
   * An optional slogan to display beneath the brand name.
   */
  slogan?: string;

  /**
   * The URL to navigate to when the logo is clicked.
   * @default '/'
   */
  href?: string;

  /**
   * The size of the logo icon in pixels. The icon maintains its aspect ratio.
   * @default 40
   */
  logoSize?: number;

  /**
   * A custom logo element to override the default. Can be an SVG, an img tag, or any other React node.
   */
  logo?: ReactNode;

  /**
   * If true, displays only the logo icon without the name or slogan for a compact look.
   * @default false
   */
  minimal?: boolean;

  /**
   * Custom class name to be applied to the root logo container.
   */
  className?: string;

  /**
   * Custom inline styles to be applied to the root logo container.
   */
  style?: CSSProperties;
};

/**
 * A versatile and brand-conscious logo component tailored for 'API Banking'.
 * It displays the brand's visual identity and can be adapted to diverse presentation needs
 * with props for customization, including a minimal mode and custom logo support.
 */
export function Logo({
  name = 'API Banking',
  slogan,
  href = '/',
  logoSize = 40,
  logo,
  minimal = false,
  className,
  style,
}: LogoProps) {
  const logoContent = logo ?? <DefaultLogoIcon />;
  const logoStyle = {
    height: `${logoSize}px`,
  } as React.CSSProperties;

  return (
    <Link
      href={href}
      className={classNames(styles.logoContainer, className)}
      style={style}
      noStyles
    >
      <div className={styles.iconWrapper} style={logoStyle}>
        {logoContent}
      </div>
      {!minimal && (
        <div className={styles.textWrapper}>
          <span className={styles.name}>{name}</span>
          {slogan && <span className={styles.slogan}>{slogan}</span>}
        </div>
      )}
    </Link>
  );
}