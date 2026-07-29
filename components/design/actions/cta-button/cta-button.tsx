import { Button } from '@api-banking/design.actions.button';
import classNames from 'classnames';
import React, {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';

import styles from './cta-button.module.scss';

export type CtaButtonProps = {
  /**
   * A click handler function to be executed when the button is clicked.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /**
   * The content to be displayed inside the button.
   */
  children?: ReactNode;
  /**
   * If provided, the button will be rendered as a link.
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
   * 'primary' uses a vibrant, attention-grabbing style.
   * 'secondary' and 'tertiary' use the standard button styles.
   * @default 'primary'
   */
  appearance?: 'primary' | 'secondary' | 'tertiary';
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
 * A visually compelling Call-to-Action button designed to grab user attention and encourage clicks.
 * It extends the base Button component to provide a distinct primary appearance with a vibrant red color,
 * while seamlessly integrating the standard secondary and tertiary styles.
 */
export function CtaButton({
  className,
  appearance = 'primary',
  ...rest
}: CtaButtonProps) {
  if (appearance === 'primary') {
    // For the custom primary style, we build upon the base 'tertiary' button
    // to avoid style conflicts with the base 'primary' style.
    // Our custom CSS class will then apply the vibrant red theme.
    return (
      <Button
        {...rest}
        appearance="tertiary"
        className={classNames(styles.primary, className)}
      />
    );
  }

  // For 'secondary' and 'tertiary' appearances, we render the base Button as-is.
  return <Button {...rest} appearance={appearance} className={className} />;
}