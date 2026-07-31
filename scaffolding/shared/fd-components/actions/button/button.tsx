import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from 'react';
import classNames from 'classnames';
import { Link } from '@api-banking/design.navigation.link';
import styles from './button.module.scss';

/**
 * Defines the visual appearance of the button.
 * 'primary': For the main call-to-action on a page.
 * 'secondary': For secondary actions.
 * 'tertiary': For less prominent actions, like 'Cancel'.
 */
export type ButtonAppearance = 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = {
  /**
   * A click handler function to be executed when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /**
   * The content to be displayed inside the button.
   */
  children?: ReactNode;
  /**
   * If provided, the button will be rendered as a link using the Link component.
   */
  href?: string;
  /**
   * If true, the button will be disabled and non-interactive.
   */
  disabled?: boolean;
  /**
   * When 'href' is provided, this property makes the link open in a new tab (_blank).
   */
  external?: boolean;
  /**
   * Additional CSS class names to apply to the button for custom styling.
   */
  className?: string;
  /**
   * The visual style of the button, determining its color and emphasis.
   * @default 'primary'
   */
  appearance?: ButtonAppearance;
  /**
   * The native HTML 'type' attribute for the button element.
   * @default 'button'
   */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /**
   * Custom inline styles to be applied to the button element.
   */
  style?: CSSProperties;
};

/**
 * A versatile and accessible button component that serves as a call-to-action or navigation element.
 * It supports primary, secondary, and tertiary visual styles, disabled states, and can render as a standard button or a link.
 * Animations on hover and active states provide modern user feedback.
 */
export function Button({
  children,
  onClick,
  href,
  disabled = false,
  external = false,
  className,
  appearance = 'primary',
  type = 'button',
  style,
}: ButtonProps) {
  const buttonClassNames = classNames(
    styles.button,
    styles[appearance],
    { [styles.disabled]: disabled },
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        external={external}
        disabled={disabled}
        className={buttonClassNames}
        onClick={onClick}
        style={style}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassNames}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}