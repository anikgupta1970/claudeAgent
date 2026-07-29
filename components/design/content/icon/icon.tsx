import type { SVGProps, ReactNode, CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './icon.module.scss';

/**
 * Properties for the generic Icon component.
 * It extends standard SVG element properties to allow for full customization.
 */
export type IconComponentProps = {
  /**
   * The SVG path(s) or other elements to render inside the icon.
   * This should be a valid SVG child element, like `<path>` or `<circle>`.
   */
  children: ReactNode;

  /**
   * Defines the width and height of the icon. Can be any valid CSS size string.
   * @default 'var(--typography-sizes-body-large)'
   */
  size?: string;

  /**
   * Sets the color of the icon. It controls the SVG's `fill` property via `currentColor`.
   * Accepts any valid CSS color string, including theme variables.
   * @default 'currentColor'
   */
  color?: string;

  /**
   * A callback function to be executed when the icon is clicked.
   * If provided, the icon becomes interactive with hover effects.
   */
  onClick?: () => void;

  /**
   * Additional class names to apply to the SVG element for custom styling.
   */
  className?: string;

  /**
   * Inline styles to apply to the SVG element. Note that `width`, `height`,
   * and `color` are primarily controlled by their respective props.
   */
  style?: CSSProperties;

  /**
   * An accessible title for the icon. This will be rendered inside an SVG `<title>` element.
   */
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, 'onClick' | 'color' | 'style' | 'title'>;

/**
 * A generic and reusable Icon component for rendering SVG icons.
 *
 * It serves as a flexible base for a consistent icon system, accepting any SVG path as children.
 * It can be easily scaled and tinted via `size` and `color` props.
 * Interactive states with smooth transitions are automatically enabled when an `onClick` handler is provided.
 */
export function Icon({
  children,
  size = 'var(--typography-sizes-body-large)',
  color = 'currentColor',
  onClick,
  className,
  style,
  title,
  ...rest
}: IconComponentProps) {
  const iconStyle: CSSProperties = {
    ...style,
    width: size,
    height: size,
    color,
  };

  return (
    <svg
      {...rest}
      viewBox={rest.viewBox || '0 0 24 24'}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        styles.icon,
        { [styles.interactive]: !!onClick },
        className
      )}
      style={iconStyle}
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}