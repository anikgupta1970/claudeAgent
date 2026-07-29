/**
 * Defines the shared properties for specific icon components.
 * This allows for consistent styling and sizing across different icons.
 */
export type IconProps = {
  /**
   * Overrides the default size of the icon.
   * e.g., '24px', '1.5em'.
   */
  size?: string;

  /**
   * Adds custom CSS class names to the icon component.
   */
  className?: string;

  /**
   * Overrides the default color of the icon.
   * Can be a theme color name or a CSS variable.
   * e.g., 'primary', 'var(--colors-text-secondary)'.
   */
  color?: string;
};