import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { OtpModal } from './otp-modal.js';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          otp: {
            title: 'Enter OTP',
            sentToPhone: 'OTP has been sent to {{phoneNumber}}',
            sentToDevice: 'OTP has been sent to your registered device',
            testingHint: 'For testing purposes, please use OTP: {{otp}}',
            submit: 'Submit',
            verifying: 'Verifying...',
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

describe('OtpModal', () => {
  describe('rendering', () => {
    it('should render OTP inputs when open', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByRole('heading', { name: 'Enter OTP' })).toBeInTheDocument();
      const inputs = document.querySelectorAll('input');
      expect(inputs).toHaveLength(6);
    });

    it('should not render when closed', () => {
      renderWithProviders(
        <OtpModal
          isOpen={false}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.queryByRole('heading', { name: 'Enter OTP' })).not.toBeInTheDocument();
    });

    it('should display hint message when provided', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          hint="OTP sent to your registered email"
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByText('OTP sent to your registered email')).toBeInTheDocument();
    });

    it('should display phoneNumber-based message when hint not provided', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByText('OTP has been sent to xxxx3210')).toBeInTheDocument();
    });

    it('should display default message when neither hint nor phoneNumber provided', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByText('OTP has been sent to your registered device')).toBeInTheDocument();
    });

    it('should prefer hint over phoneNumber', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          hint="Custom hint message"
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByText('Custom hint message')).toBeInTheDocument();
      expect(screen.queryByText('OTP has been sent to xxxx3210')).not.toBeInTheDocument();
    });

    it('should display testing hint', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      expect(screen.getByText('For testing purposes, please use OTP: 123456')).toBeInTheDocument();
    });
  });

  describe('custom OTP length', () => {
    it('should render custom number of inputs', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          otpLength={4}
        />
      );

      const inputs = document.querySelectorAll('input');
      expect(inputs).toHaveLength(4);
    });

    it('should display testing hint with correct OTP length', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          otpLength={4}
        />
      );

      // The component shows a fixed test OTP regardless of length
      expect(screen.getByText('For testing purposes, please use OTP: 123456')).toBeInTheDocument();
    });
  });

  describe('OTP input behavior', () => {
    it('should only accept digits', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      fireEvent.change(inputs[0], { target: { value: 'a' } });
      expect(inputs[0]).toHaveValue('');

      fireEvent.change(inputs[0], { target: { value: '5' } });
      expect(inputs[0]).toHaveValue('5');
    });

    it('should move focus to next input on digit entry', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      fireEvent.change(inputs[0], { target: { value: '1' } });

      expect(document.activeElement).toBe(inputs[1]);
    });

    it('should move focus to previous input on backspace', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      // Fill first input and move to second
      fireEvent.change(inputs[0], { target: { value: '1' } });
      expect(document.activeElement).toBe(inputs[1]);

      // Press backspace on empty second input
      fireEvent.keyDown(inputs[1], { key: 'Backspace' });
      expect(document.activeElement).toBe(inputs[0]);
    });

    it('should not move focus on backspace when not empty', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      fireEvent.change(inputs[0], { target: { value: '1' } });
      fireEvent.change(inputs[1], { target: { value: '2' } });

      inputs[1].focus();
      fireEvent.keyDown(inputs[1], { key: 'Backspace' });
      // Should stay on current input since it has a value
      expect(document.activeElement).toBe(inputs[1]);
    });

    it('should not move focus on backspace at first input', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      inputs[0].focus();
      fireEvent.keyDown(inputs[0], { key: 'Backspace' });

      expect(document.activeElement).toBe(inputs[0]);
    });
  });

  describe('paste handling', () => {
    it('should handle pasting complete OTP', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      const clipboardData = { getData: () => '123456' };

      fireEvent.paste(inputs[0], { clipboardData });

      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });

    it('should handle pasting partial OTP', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      const clipboardData = { getData: () => '123' };

      fireEvent.paste(inputs[0], { clipboardData });

      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('');
    });

    it('should filter non-numeric characters from paste', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      const clipboardData = { getData: () => '1a2b3c4d5e6f' };

      fireEvent.paste(inputs[0], { clipboardData });

      expect(inputs[0]).toHaveValue('1');
      expect(inputs[1]).toHaveValue('2');
      expect(inputs[2]).toHaveValue('3');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });

    it('should handle paste starting from middle input', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      const clipboardData = { getData: () => '456' };

      fireEvent.paste(inputs[3], { clipboardData });

      expect(inputs[0]).toHaveValue('');
      expect(inputs[3]).toHaveValue('4');
      expect(inputs[4]).toHaveValue('5');
      expect(inputs[5]).toHaveValue('6');
    });

    it('should ignore empty paste', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      const clipboardData = { getData: () => '' };

      fireEvent.paste(inputs[0], { clipboardData });

      inputs.forEach((input) => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('submit behavior', () => {
    it('should call onOtpSubmit with the correct OTP when submitted', () => {
      const onOtpSubmit = vi.fn();
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={onOtpSubmit}
        />
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach((input) => {
        fireEvent.change(input, { target: { value: '1' } });
      });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      fireEvent.click(submitButton);

      expect(onOtpSubmit).toHaveBeenCalledWith('111111');
      expect(onOtpSubmit).toHaveBeenCalledTimes(1);
    });

    it('should disable the submit button when the OTP is not complete', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeDisabled();
    });

    it('should enable the submit button when the OTP is complete', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: `${index + 1}` } });
      });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).not.toBeDisabled();
    });

    it('should not call onOtpSubmit when OTP is incomplete', () => {
      const onOtpSubmit = vi.fn();
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={onOtpSubmit}
        />
      );

      const inputs = container.querySelectorAll('input');
      // Only fill 3 inputs
      for (let i = 0; i < 3; i++) {
        fireEvent.change(inputs[i], { target: { value: '1' } });
      }

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      fireEvent.click(submitButton);

      expect(onOtpSubmit).not.toHaveBeenCalled();
    });
  });

  describe('submitting state', () => {
    it('should show Verifying text when submitting', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          isSubmitting={true}
        />
      );

      expect(screen.getByRole('button', { name: 'Verifying...' })).toBeInTheDocument();
    });

    it('should disable submit button when submitting', () => {
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          isSubmitting={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Verifying...' });
      expect(submitButton).toBeDisabled();
    });

    it('should make inputs readonly when submitting', () => {
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          isSubmitting={true}
        />
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('readonly');
      });
    });
  });

  describe('error handling', () => {
    it('should display OTP error', () => {
      const serverErrors = [{ field: 'otp', message: 'Invalid OTP' }];
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          serverErrors={serverErrors}
        />
      );

      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });

    it('should display general error', () => {
      const serverErrors = [{ field: 'general', message: 'Server error occurred' }];
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          serverErrors={serverErrors}
        />
      );

      expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });

    it('should prefer OTP error over general error', () => {
      const serverErrors = [
        { field: 'otp', message: 'Invalid OTP' },
        { field: 'general', message: 'Server error' },
      ];
      renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          serverErrors={serverErrors}
        />
      );

      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
      expect(screen.queryByText('Server error')).not.toBeInTheDocument();
    });

    it('should apply error styling to inputs when OTP error exists', () => {
      const serverErrors = [{ field: 'otp', message: 'Invalid OTP' }];
      const { container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          onOtpSubmit={() => {}}
          serverErrors={serverErrors}
        />
      );

      const inputs = container.querySelectorAll('input');
      inputs.forEach((input) => {
        expect(input).toHaveStyle({ borderColor: '#dc2626' });
      });
    });
  });

  describe('modal reset', () => {
    it('should clear OTP when modal closes and reopens', () => {
      const { rerender, container } = renderWithProviders(
        <OtpModal
          isOpen={true}
          onClose={() => {}}
          phoneNumber="xxxx3210"
          onOtpSubmit={() => {}}
        />
      );

      let inputs = container.querySelectorAll('input');
      fireEvent.change(inputs[0], { target: { value: '1' } });
      expect(inputs[0]).toHaveValue('1');

      // Close the modal
      rerender(
        <MemoryRouter>
          <ApiBankingTheme>
            <OtpModal
              isOpen={false}
              onClose={() => {}}
              phoneNumber="xxxx3210"
              onOtpSubmit={() => {}}
            />
          </ApiBankingTheme>
        </MemoryRouter>
      );

      // Reopen the modal
      rerender(
        <MemoryRouter>
          <ApiBankingTheme>
            <OtpModal
              isOpen={true}
              onClose={() => {}}
              phoneNumber="xxxx3210"
              onOtpSubmit={() => {}}
            />
          </ApiBankingTheme>
        </MemoryRouter>
      );

      inputs = container.querySelectorAll('input');
      inputs.forEach((input) => {
        expect(input).toHaveValue('');
      });
    });
  });

});
