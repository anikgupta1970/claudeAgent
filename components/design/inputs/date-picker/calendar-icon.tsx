import React from 'react';

/**
 * Renders the SVG path for a calendar icon.
 * This is meant to be used as a child of the Icon component.
 */
export function CalendarIconPath() {
  return (
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
  );
}

/**
 * Renders the SVG path for a chevron left icon.
 * This is meant to be used as a child of the Icon component.
 */
export function ChevronLeftIconPath() {
  return (
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  );
}

/**
 * Renders the SVG path for a chevron right icon.
 * This is meant to be used as a child of the Icon component.
 */
export function ChevronRightIconPath() {
  return (
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  );
}