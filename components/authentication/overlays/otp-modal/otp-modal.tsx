import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Flex } from '@api-banking/design.layouts.flex';
import { Modal } from '@api-banking/design.overlays.modal';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import classNames from 'classnames';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './otp-modal.module.scss';

export type ValidationError = {
  field: string;
  message: string;
};

export type OtpModalProps = {
  /**
   * Controls whether the modal is open.
   */
  isOpen: boolean;
  /**
   * Callback function to close the modal.
   */
  onClose: () => void;
  /**
   * The hint message from the API (e.g., "OTP has been sent to xxxx3210").
   * Falls back to phoneNumber-based message if not provided.
   */
  hint?: string;
  /**
   * The masked phone number to display in the message (legacy, use hint instead).
   */
  phoneNumber?: string;
  /**
   * Callback fired when the OTP is submitted.
   * @param otp The complete OTP string.
   */
  onOtpSubmit: (otp: string) => void;
  /**
   * Optional className to apply to the modal container.
   */
  className?: string;
  /**
   * Optional style to apply to the modal container.
   */
  style?: React.CSSProperties;
  /**
   * Server-side validation errors.
   */
  serverErrors?: ValidationError[];
  /**
   * Whether the form is currently submitting.
   */
  isSubmitting?: boolean;
  /**
   * The expected length of the OTP (default: 6).
   */
  otpLength?: number;
};

const DEFAULT_OTP_LENGTH = 6;

/**
 * A modal component for OTP (One-Time Password) verification.
 * It prompts the user to enter a numeric OTP sent to their device.
 */
export function OtpModal({
  isOpen,
  onClose,
  hint,
  phoneNumber,
  onOtpSubmit,
  className,
  style,
  serverErrors,
  isSubmitting,
  otpLength = DEFAULT_OTP_LENGTH,
}: OtpModalProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize OTP array when length changes
  useEffect(() => {
    setOtp(Array(otpLength).fill(''));
    inputRefs.current = Array(otpLength).fill(null);
  }, [otpLength]);

  useEffect(() => {
    if (isOpen) {
      // Focus the first input when the modal opens
      inputRefs.current[0]?.focus();
    } else {
      // Reset OTP when modal closes
      setOtp(Array(otpLength).fill(''));
    }
  }, [isOpen, otpLength]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    // Allow only single digits
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if a digit is entered
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to the previous input on backspace if the current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    startIndex: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const newOtp = [...otp];
    let pastedIndex = 0;
    for (
      let i = startIndex;
      i < otpLength && pastedIndex < pastedData.length;
      i++
    ) {
      newOtp[i] = pastedData[pastedIndex];
      pastedIndex++;
    }
    setOtp(newOtp);

    // Focus the next available input or the last input if all are filled
    const nextFocusIndex = Math.min(
      startIndex + pastedData.length,
      otpLength - 1
    );
    inputRefs.current[nextFocusIndex]?.focus();
    inputRefs.current[nextFocusIndex]?.select(); // Select content for easier overwriting
  };

  const handleSubmit = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length === otpLength) {
      onOtpSubmit(finalOtp);
    }
  };

  const isSubmitDisabled = otp.join('').length !== otpLength || isSubmitting;
  const otpError = serverErrors?.find((e) => e.field === 'otp')?.message;
  const generalError = serverErrors?.find(
    (e) => e.field === 'general'
  )?.message;

  // Display message: prefer hint from API, fall back to phoneNumber
  const displayMessage = useMemo(() => {
    if (hint) return hint;
    if (phoneNumber) return t('otp.sentToPhone', { phoneNumber });
    return t('otp.sentToDevice');
  }, [hint, phoneNumber, t]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<Heading level={3}>{t('otp.title')}</Heading>}
      className={className}
      style={style}
    >
      <div className={styles.content}>
        <Paragraph className={styles.message}>{displayMessage}</Paragraph>
        <Flex className={styles.otpInputContainer}>
          {Array.from({ length: otpLength }).map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              value={otp[index] || ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              type="tel" // Use tel for numeric keyboards on mobile
              name={`otp-${index}`}
              className={styles.otpInput}
              readOnly={!isOpen || isSubmitting}
              maxLength={1} // Restrict input to a single character per box
              onFocus={(e) => e.target.select()} // Select text on focus for easier overwriting
              style={otpError ? { borderColor: '#dc2626' } : undefined}
            />
          ))}
        </Flex>
        {(otpError || generalError) && (
          <Paragraph
            style={{
              color: '#dc2626',
              marginTop: '0.5rem',
              textAlign: 'center',
            }}
          >
            {otpError || generalError}
          </Paragraph>
        )}
        <Paragraph variant="muted" className={styles.hint}>
          {t('otp.testingHint', { otp: '123456' })}
        </Paragraph>
        <CtaButton
          appearance="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={styles.submitButton}
        >
          {isSubmitting ? t('otp.verifying') : t('otp.submit')}
        </CtaButton>
      </div>
    </Modal>
  );
}
