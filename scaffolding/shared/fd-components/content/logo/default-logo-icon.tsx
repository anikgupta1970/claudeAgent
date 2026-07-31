import { type SVGProps } from 'react';

/**
 * The default SVG logo for API Banking.
 * It is a sleek and modern design, representing connectivity and stability through abstract shapes and a vibrant gradient.
 */
export function DefaultLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--colors-primary-default)" />
          <stop offset="1" stopColor="var(--colors-secondary-default)" />
        </linearGradient>
      </defs>
      <path
        d="M20 0L27.0711 7.07107L34.1421 14.1421L40 20L34.1421 25.8579L27.0711 32.9289L20 40L12.9289 32.9289L5.85786 25.8579L0 20L5.85786 14.1421L12.9289 7.07107L20 0Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M20 7.5L24.6944 12.1944L29.3889 16.8889L32.5 20L29.3889 23.1111L24.6944 27.8056L20 32.5L15.3056 27.8056L10.6111 23.1111L7.5 20L10.6111 16.8889L15.3056 12.1944L20 7.5Z"
        fill="var(--colors-surface-background)"
      />
    </svg>
  );
}