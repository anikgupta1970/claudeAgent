import React, { type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './flex.module.scss';

// Define the properties specific to the Flex component itself (flexbox layout props)
type FlexLayoutProps = {
  /**
   * Defines the alignment of items along the main axis. Corresponds to the `justify-content` CSS property.
   */
  justifyContent?: CSSProperties['justifyContent'];
  /**
   * Defines the alignment of items along the cross axis. Corresponds to the `align-items` CSS property.
   */
  alignItems?: CSSProperties['alignItems'];
  /**
   * Defines the gap between flex items. Corresponds to the `gap` CSS property. It's recommended to use theme spacing tokens.
   */
  gap?: CSSProperties['gap'];
  /**
   * Specifies whether flex items should wrap. Corresponds to the `flex-wrap` CSS property.
   */
  flexWrap?: CSSProperties['flexWrap'];
  /**
   * Establishes the main-axis, defining the direction flex items are placed. Corresponds to the `flex-direction` CSS property.
   * @default 'row'
   */
  flexDirection?: CSSProperties['flexDirection'];
  /**
   * Defines the ability for a flex item to grow. Corresponds to the `flex-grow` CSS property.
   */
  flexGrow?: CSSProperties['flexGrow'];
  /**
   * Defines the ability for a flex item to shrink. Corresponds to the `flex-shrink` CSS property.
   */
  flexShrink?: CSSProperties['flexShrink'];
  /**
   * Defines the default size of an element before the remaining space is distributed. Corresponds to the `flex-basis` CSS property.
   */
  flexBasis?: CSSProperties['flexBasis'];
};

// Define the common props that Flex handles, including children and its own specific layout props
type FlexOwnProps = FlexLayoutProps & {
  children?: React.ReactNode;
};

// Define the type for the 'as' prop
type AsProp<T extends keyof React.JSX.IntrinsicElements> = {
  /**
   * The element to render as the flex container.
   * @default 'div'
   */
  as?: T;
};

/**
 * Props for the Flex component.
 * Allows polymorphic behavior with the 'as' prop.
 * This type merges Flex's specific layout props and common props with the intrinsic props
 * of the underlying HTML element `T`, omitting any conflicting props already defined by FlexOwnProps or AsProp.
 */
export type FlexProps<T extends keyof React.JSX.IntrinsicElements = 'div'> = FlexOwnProps & AsProp<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof FlexOwnProps | 'as'>;


/**
 * A highly configurable flexbox layout component for arranging elements in rows or columns.
 * It provides props for common flexbox properties and allows rendering as different HTML elements.
 */
export function Flex<T extends keyof React.JSX.IntrinsicElements = 'div'>({
  as,
  children,
  justifyContent,
  alignItems,
  gap,
  flexWrap,
  flexDirection = 'row',
  flexGrow,
  flexShrink,
  flexBasis,
  ...rest // This now correctly contains intrinsic attributes of T like className, style, onClick, id, role, tabIndex, etc.
}: FlexProps<T>) {
  const Component = as || 'div';

  const flexStyles: CSSProperties = {
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
  };

  // Extract className and style from rest to merge them with internal ones.
  // This ensures that user-provided className/style take precedence and are merged correctly.
  const { className: restClassName, style: restStyle, ...restWithoutClassAndStyle } = rest;

  // Cast Component to any to avoid TS2590: complex union type error with polymorphic components
  const ElementComponent = Component as any;

  return (
    <ElementComponent
      className={classNames(styles.flex, restClassName)}
      style={{ ...flexStyles, ...restStyle }}
      {...restWithoutClassAndStyle}
    >
      {children}
    </ElementComponent>
  );
}