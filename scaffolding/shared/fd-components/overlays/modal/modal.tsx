import React, { type ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Heading } from '@api-banking/design.typography.heading';
import { Icon } from '@api-banking/design.content.icon';
import styles from './modal.module.scss';

const CloseIconPath = () => <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />;

export type ModalProps = {
  /**
   * Determines if the modal is open and visible.
   */
  isOpen: boolean;
  /**
   * Callback function invoked when the modal is requested to be closed,
   * for example, by clicking the overlay, the close button, or pressing the Escape key.
   */
  onClose: () => void;
  /**
   * The content to be displayed inside the modal's body.
   */
  children?: ReactNode;
  /**
   * The title of the modal, displayed in the header.
   * Can be a simple string or a more complex React node.
   */
  title: string | ReactNode;
  /**
   * If true, displays a close icon button in the modal header.
   * @default true
   */
  closeButton?: boolean;
  /**
   * Additional CSS class name to apply to the modal's main content container.
   */
  className?: string;
  /**
   * Custom inline styles for the modal's main content container.
   */
  style?: React.CSSProperties;
};

/**
 * A versatile and accessible modal component for displaying temporary, interactive content.
 * It features smooth transitions, an overlay backdrop, and handles accessibility aspects
 * like focus trapping and keyboard navigation.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  closeButton = true,
  className,
  style,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.classList.add(styles.noScroll);
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.classList.remove(styles.noScroll);
      previouslyFocusedElement.current?.focus();
    }

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
    };

    const modalElement = modalRef.current;
    modalElement?.addEventListener('keydown', handleFocusTrap);

    return () => {
      modalElement?.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={classNames(styles.overlay, { [styles.overlayOpen]: isOpen })}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={classNames(styles.modalContent, { [styles.modalOpen]: isOpen }, className)}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div id="modal-title" className={styles.title}>
            {typeof title === 'string' ? (
              <Heading level={2} visualLevel="h3">
                {title}
              </Heading>
            ) : (
              title
            )}
          </div>
          {closeButton && (
            <Icon
              className={styles.closeButton}
              onClick={() => onClose()}
              size="24px"
              title="Close modal"
            >
              <CloseIconPath />
            </Icon>
          )}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}