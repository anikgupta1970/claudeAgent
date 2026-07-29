import React from 'react';

/**
 * Renders the SVG path for a moon icon, typically used for dark mode representation.
 * This component is intended to be used as a child of the Icon component.
 */
export function MoonIcon(props: React.SVGProps<SVGPathElement>) {
  return (
    <path
      {...props}
      d="M12.014 4.022a.75.75 0 0 1 .91-.532 8.25 8.25 0 0 0 7.91 7.91.75.75 0 0 1-.532.91 8.25 8.25 0 0 1-9.423-9.288Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  );
}