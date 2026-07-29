import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ConsentModal } from './consent-modal.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          common: {
            consentDetails: 'Consent Details',
            summary: 'Summary',
            viewDocument: 'View document',
            cancel: 'Cancel',
            accept: 'Accept',
          },
        },
      },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ApiBankingTheme>{ui}</ApiBankingTheme>
    </MemoryRouter>
  );
};

describe('ConsentModal', () => {
  describe('rendering', () => {
    it('should render the title and summary', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          title="Test Title"
          summary="Test Summary"
          documentLink="https://example.com"
          onClose={() => {}}
          onAgree={() => {}}
          onDisagree={() => {}}
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Summary')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={false}
          title="Test Title"
          summary="Test Summary"
        />
      );

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render with default title', () => {
      renderWithProviders(
        <ConsentModal isOpen={true} />
      );

      expect(screen.getByText('Consent Details')).toBeInTheDocument();
    });

    it('should render with default summary', () => {
      renderWithProviders(
        <ConsentModal isOpen={true} />
      );

      expect(screen.getByText(/I\/we have read, understood, and hereby accept the Privacy Policy/)).toBeInTheDocument();
    });

    it('should render summary section title', () => {
      renderWithProviders(
        <ConsentModal isOpen={true} />
      );

      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    it('should render summary as ReactNode', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          summary={<span data-testid="custom-summary">Custom Summary Node</span>}
        />
      );

      expect(screen.getByTestId('custom-summary')).toBeInTheDocument();
    });

    it('should render Accept and Cancel buttons', () => {
      renderWithProviders(
        <ConsentModal isOpen={true} />
      );

      expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('document link', () => {
    it('should render View document link', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          documentLink="https://example.com/document"
        />
      );

      const link = screen.getByRole('link', { name: 'View document' });
      expect(link).toBeInTheDocument();
    });

    it('should open document in new tab', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          documentLink="https://example.com/document"
        />
      );

      const link = screen.getByRole('link', { name: 'View document' });
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should have correct href', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          documentLink="https://example.com/document.pdf"
        />
      );

      const link = screen.getByRole('link', { name: 'View document' });
      expect(link).toHaveAttribute('href', 'https://example.com/document.pdf');
    });

    it('should have rel="noopener noreferrer" for security', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          documentLink="https://example.com/document"
        />
      );

      const link = screen.getByRole('link', { name: 'View document' });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('callbacks', () => {
    it('should call onAgree when Accept button is clicked', () => {
      const onAgree = vi.fn();
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          onAgree={onAgree}
        />
      );

      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      fireEvent.click(acceptButton);

      expect(onAgree).toHaveBeenCalled();
    });

    it('should call onDisagree when Cancel button is clicked', () => {
      const onDisagree = vi.fn();
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          onDisagree={onDisagree}
        />
      );

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      expect(onDisagree).toHaveBeenCalled();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          onClose={onClose}
        />
      );

      const closeButton = screen.getByTitle('Close modal');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should work without callbacks (default empty functions)', () => {
      renderWithProviders(
        <ConsentModal isOpen={true} />
      );

      const acceptButton = screen.getByRole('button', { name: 'Accept' });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      // Should not throw
      expect(() => fireEvent.click(acceptButton)).not.toThrow();
      expect(() => fireEvent.click(cancelButton)).not.toThrow();
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          className="custom-class"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      renderWithProviders(
        <ConsentModal
          isOpen={true}
          style={{ maxWidth: '600px' }}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveStyle({ maxWidth: '600px' });
    });
  });
});
