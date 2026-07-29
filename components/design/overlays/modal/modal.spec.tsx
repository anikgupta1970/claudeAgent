import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './modal.js';
import styles from './modal.module.scss';

describe('Modal Component', () => {
  afterEach(() => {
    // Clean up any no-scroll class that might remain
    document.body.classList.remove(styles.noScroll);
  });

  describe('rendering', () => {
    it('should render the modal when isOpen is true', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`);
      expect(modalContent).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`);
      expect(modalContent).not.toBeInTheDocument();
    });

    it('should render the modal title as string', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal Title">
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByRole('heading', { name: 'Test Modal Title' })).toBeInTheDocument();
    });

    it('should render the modal title as ReactNode', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title={<span data-testid="custom-title">Custom Title</span>}>
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div data-testid="modal-content">Test Content</div>
        </Modal>
      );
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal" className="custom-class">
          <div>Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`);
      expect(modalContent).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal" style={{ maxWidth: '500px' }}>
          <div>Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`);
      expect(modalContent).toHaveStyle({ maxWidth: '500px' });
    });
  });

  describe('close button', () => {
    it('should render close button by default', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByTitle('Close modal')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      const closeButton = screen.getByTitle('Close modal');
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('should hide close button when closeButton prop is false', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal" closeButton={false}>
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.queryByTitle('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('overlay click', () => {
    it('should call onClose when the overlay is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const overlay = container.querySelector(`.${styles.overlay}`) as HTMLDivElement;
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking inside modal content', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div data-testid="modal-content">Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`) as HTMLDivElement;
      fireEvent.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interactions', () => {
    it('should call onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose on Escape when modal is closed', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={false} onClose={onClose} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('body scroll lock', () => {
    it('should add no-scroll class to body when modal opens', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      expect(document.body.classList.contains(styles.noScroll)).toBe(true);
    });

    it('should remove no-scroll class from body when modal closes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      expect(document.body.classList.contains(styles.noScroll)).toBe(true);

      rerender(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      expect(document.body.classList.contains(styles.noScroll)).toBe(false);
    });

    it('should remove no-scroll class when component unmounts', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      expect(document.body.classList.contains(styles.noScroll)).toBe(true);
      unmount();
      expect(document.body.classList.contains(styles.noScroll)).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have overlay with role="presentation"', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const overlay = container.querySelector(`.${styles.overlay}`);
      expect(overlay).toHaveAttribute('role', 'presentation');
    });

    it('should focus modal on open', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(document.activeElement).toBe(dialog);
      }, { timeout: 200 });
    });
  });

  describe('focus trap', () => {
    it('should handle Tab key within modal', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <button data-testid="btn1">Button 1</button>
          <button data-testid="btn2">Button 2</button>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(document.activeElement).toBe(dialog);
      }, { timeout: 200 });

      // Verify focusable elements are in the modal
      expect(screen.getByTestId('btn1')).toBeInTheDocument();
      expect(screen.getByTestId('btn2')).toBeInTheDocument();

      // Tab keydown event is handled by the modal
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Tab' });
      // Modal handles the event without errors
    });

    it('should handle Shift+Tab key within modal', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <button data-testid="btn1">Button 1</button>
          <button data-testid="btn2">Button 2</button>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(document.activeElement).toBe(dialog);
      }, { timeout: 200 });

      // Shift+Tab keydown event is handled by the modal
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
      // Modal handles the event without errors
    });
  });

  describe('CSS classes', () => {
    it('should apply overlayOpen class when open', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const overlay = container.querySelector(`.${styles.overlay}`);
      expect(overlay).toHaveClass(styles.overlayOpen);
    });

    it('should apply modalOpen class when open', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Test Content</div>
        </Modal>
      );
      const modalContent = container.querySelector(`.${styles.modalContent}`);
      expect(modalContent).toHaveClass(styles.modalOpen);
    });
  });
});
