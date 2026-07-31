import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Flex } from '@api-banking/design.layouts.flex';
import { Modal } from '@api-banking/design.overlays.modal';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { useEffect, useRef, useState } from 'react';
import styles from './otp-modal.module.scss';

export type OtpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  hint?: string;
  phoneNumber?: string;
  onOtpSubmit: (otp: string) => void;
  className?: string;
  style?: React.CSSProperties;
  serverErrors?: { field: string; message: string }[];
  isSubmitting?: boolean;
  otpLength?: number;
};

const DEFAULT_OTP_LENGTH = 6;

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
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(otpLength).fill(null));

  useEffect(() => {
    setOtp(Array(otpLength).fill(''));
    inputRefs.current = Array(otpLength).fill(null);
  }, [otpLength]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      setOtp(Array(otpLength).fill(''));
    }
  }, [isOpen, otpLength]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otpLength - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (!pastedData) return;
    const newOtp = [...otp];
    let pi = 0;
    for (let i = startIndex; i < otpLength && pi < pastedData.length; i++, pi++) newOtp[i] = pastedData[pi];
    setOtp(newOtp);
    const nextFocus = Math.min(startIndex + pastedData.length, otpLength - 1);
    inputRefs.current[nextFocus]?.focus();
    inputRefs.current[nextFocus]?.select();
  };

  const handleSubmit = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length === otpLength) onOtpSubmit(finalOtp);
  };

  const isSubmitDisabled = otp.join('').length !== otpLength || isSubmitting;
  const otpError = serverErrors?.find((e) => e.field === 'otp')?.message;
  const generalError = serverErrors?.find((e) => e.field === 'general')?.message;
  const displayMessage = hint ?? (phoneNumber ? `OTP has been sent to ${phoneNumber}` : 'OTP has been sent to your registered device');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<Heading level={3}>Verify OTP</Heading>} className={className} style={style}>
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
              ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
              type="tel"
              name={`otp-${index}`}
              className={styles.otpInput}
              readOnly={!isOpen || isSubmitting}
              maxLength={1}
              onFocus={(e) => e.target.select()}
              style={otpError ? { borderColor: '#dc2626' } : undefined}
            />
          ))}
        </Flex>
        {(otpError || generalError) && (
          <Paragraph style={{ color: '#dc2626', marginTop: '0.5rem', textAlign: 'center' }}>
            {otpError || generalError}
          </Paragraph>
        )}
        <Paragraph variant="muted" className={styles.hint}>
          For testing, use OTP: 123456
        </Paragraph>
        <CtaButton appearance="primary" onClick={handleSubmit} disabled={isSubmitDisabled} className={styles.submitButton}>
          {isSubmitting ? 'Verifying…' : 'Verify OTP'}
        </CtaButton>
      </div>
    </Modal>
  );
}
