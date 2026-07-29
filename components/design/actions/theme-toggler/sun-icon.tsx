import React from 'react';

/**
 * Renders the SVG path for a sun icon, typically used for light mode representation.
 * This component is intended to be used as a child of the Icon component.
 */
export function SunIcon(props: React.SVGProps<SVGPathElement>) {
  return (
    <path
      {...props}
      d="M12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Zm0-8.25a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 4.5a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75v0a.75.75 0 0 1-.75.75h0A.75.75 0 0 1 12 4.5ZM12 20.25a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75v0a.75.75 0 0 1-.75.75h0a.75.75 0 0 1-.75-.75ZM5.25 12.75a.75.75 0 0 1-.75.75h0a.75.75 0 0 1-.75-.75v0a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75ZM20.25 12.75a.75.75 0 0 1-.75.75h0a.75.75 0 0 1-.75-.75v0a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75ZM7.061 7.78a.75.75 0 0 1 .53-.22h0a.75.75 0 0 1 .53 1.28l-.001.001a.75.75 0 0 1-1.06 0l-.001-.001a.75.75 0 0 1 0-1.06ZM17.68 18.399a.75.75 0 0 1 .53-.22h0a.75.75 0 0 1 .53 1.28l-.001.001a.75.75 0 0 1-1.06 0l-.001-.001a.75.75 0 0 1 0-1.06ZM7.06 18.4a.75.75 0 0 1 1.06 0l-.001.001a.75.75 0 0 1-1.06 1.06l-.001-.001a.75.75 0 0 1 0-1.06h0ZM17.68 7.78a.75.75 0 0 1 1.061 0l-.001.001a.75.75 0 0 1-1.06 1.06l-.001-.001a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  );
}