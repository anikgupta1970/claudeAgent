import React, { type CSSProperties, type ReactNode } from 'react';
import classNames from 'classnames';
import { DefaultLogoIcon } from './default-logo-icon.js';
import styles from './logo.module.scss';

export type LogoProps = {
  name?: string;
  slogan?: string;
  href?: string;
  logoSize?: number;
  logo?: ReactNode;
  minimal?: boolean;
  className?: string;
  style?: CSSProperties;
};

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
  const logoStyle = { height: `${logoSize}px` } as React.CSSProperties;

  return (
    <a href={href} className={classNames(styles.logoContainer, className)} style={style}>
      <div className={styles.iconWrapper} style={logoStyle}>
        {logoContent}
      </div>
      {!minimal && (
        <div className={styles.textWrapper}>
          <span className={styles.name}>{name}</span>
          {slogan && <span className={styles.slogan}>{slogan}</span>}
        </div>
      )}
    </a>
  );
}
