import { useState } from 'react';
import styles from './Login.module.css';
import { Modal } from '@api-banking/design.overlays.modal';
import { OtpModal } from '../../fd-components/authentication/otp-modal';
import { TextInput } from '@api-banking/design.inputs.text-input';
import { Checkbox } from '@api-banking/design.inputs.checkbox';
import { RadioButton } from '@api-banking/design.inputs.radio-button';
import { InputGroup } from '@api-banking/design.inputs.input-group';
import { Button } from '@api-banking/design.actions.button';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { Flex } from '@api-banking/design.layouts.flex';
import { useJourney } from '../../context/JourneyContext';
import { findCustomer, getCustomerAccounts } from '../../api/client';
import type { CustomerInfo, AccountInfo } from '../../types';

const CONSENTS = [
  {
    id: 'c1',
    label: 'I agree to the Terms & Conditions',
    summary: 'I authorize API Banking to access my account details and open a Fixed Deposit on my behalf.',
    full: 'By accepting these terms, you authorize API Banking and its partners to access your KYC details, account information, and transaction history solely for the purpose of opening and managing a Fixed Deposit account. This authorization is valid for the duration of the FD tenure.',
  },
  {
    id: 'c2',
    label: 'I agree to receive communications',
    summary: 'I consent to receive updates, alerts, and notifications related to my Fixed Deposit via SMS and email.',
    full: 'You consent to receive service notifications, transaction alerts, and promotional communications from API Banking via SMS, email, and push notifications. You may opt out of promotional communications at any time.',
  },
];

export default function Login() {
  const { dispatch } = useJourney();

  const [mobile, setMobile] = useState('');
  const [verifyMode, setVerifyMode] = useState<'dob' | 'pan'>('dob');
  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [consents, setConsents] = useState({ c1: false, c2: false });
  const [activeConsent, setActiveConsent] = useState<(typeof CONSENTS)[0] | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');

  const MOBILE_RE = /^[0-9]{10}$/;
  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const mobileValid = MOBILE_RE.test(mobile);
  const secondaryValid = verifyMode === 'dob' ? dob.length === 10 : PAN_RE.test(pan);
  const canContinue = mobileValid && secondaryValid && consents.c1 && consents.c2;

  async function handleOtpSubmit(_otp: string) {
    setOtpLoading(true);
    setError('');
    try {
      const findParams: { mobile: string; dob?: string; pan?: string } = { mobile };
      if (verifyMode === 'dob') findParams.dob = dob;
      else findParams.pan = pan.toUpperCase();

      const found = await findCustomer(findParams);
      if (!found?.customerId) {
        setError('We could not find an account linked to this mobile number. Please check and try again.');
        setShowOtp(false);
        return;
      }

      const accounts = await getCustomerAccounts(found.customerId);
      const saAccount = (Array.isArray(accounts) ? accounts : []).find((a) => a.productCategory === 'sa') ?? accounts?.[0];
      if (!saAccount) {
        setError('No linked savings account found. Please contact your branch.');
        setShowOtp(false);
        return;
      }

      const customer: CustomerInfo = {
        customerId: found.customerId,
        name: found.name,
        dob: found.dob ?? dob,
        pan: found.pan ?? (verifyMode === 'pan' ? pan.toUpperCase() : ''),
        mobile,
      };
      const account: AccountInfo = {
        accountId: saAccount.accountId ?? saAccount.accountNo,
        accountNo: saAccount.accountNo,
        currentBalance: String(saAccount.currentBalance?.amount ?? '0.00'),
      };

      dispatch({ type: 'SET_AUTH', payload: { bearerToken: 'DEMO_TOKEN', customer, account } });
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e.status === 404) setError('We could not find an account linked to this mobile number. Please check and try again.');
      else if (e.status === 400) setError('The details entered do not match our records. Please try again.');
      else setError('Something went wrong. Please try again in a moment.');
      setShowOtp(false);
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      <Heading level={2} visualLevel="h3" className={styles.heading}>Open Fixed Deposit</Heading>
      <Paragraph variant="muted" className={styles.sub}>Existing customers only. Enter your details to get started.</Paragraph>

      <InputGroup label="Mobile Number" inputId="mobile" errorText={mobile && !mobileValid ? 'Enter a valid 10-digit mobile number' : undefined}>
        <TextInput
          id="mobile"
          type="tel"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
          error={!!(mobile && !mobileValid)}
          leftAdornment={<span className={styles.prefix}>+91</span>}
        />
      </InputGroup>

      <div className={styles.field}>
        <Paragraph element="span" variant="muted" className={styles.fieldLabel}>Verify Using</Paragraph>
        <Flex gap="16px" className={styles.radioGroup}>
          <RadioButton
            id="verify-dob"
            name="verifyMode"
            value="dob"
            label="Date of Birth"
            checked={verifyMode === 'dob'}
            onChange={() => setVerifyMode('dob')}
          />
          <RadioButton
            id="verify-pan"
            name="verifyMode"
            value="pan"
            label="PAN Number"
            checked={verifyMode === 'pan'}
            onChange={() => setVerifyMode('pan')}
          />
        </Flex>
      </div>

      {verifyMode === 'dob' ? (
        <InputGroup label="Date of Birth" inputId="dob">
          <TextInput
            id="dob"
            type="text"
            placeholder="YYYY-MM-DD"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </InputGroup>
      ) : (
        <InputGroup
          label="PAN Number"
          inputId="pan"
          errorText={pan && !PAN_RE.test(pan) ? 'PAN must be in format ABCDE1234F' : undefined}
        >
          <TextInput
            id="pan"
            type="text"
            maxLength={10}
            placeholder="ABCDE1234F"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            error={!!(pan && !PAN_RE.test(pan))}
          />
        </InputGroup>
      )}

      <div className={styles.consents}>
        {CONSENTS.map((c) => (
          <div key={c.id} className={styles.consentRow}>
            <Checkbox
              id={c.id}
              checked={consents[c.id as keyof typeof consents]}
              onChange={(e) => setConsents((prev) => ({ ...prev, [c.id]: e.target.checked }))}
              label={
                <button className={styles.consentLink} onClick={() => setActiveConsent(c)}>
                  {c.label}
                </button>
              }
            />
          </div>
        ))}
      </div>

      {error && <Paragraph style={{ color: 'var(--colors-status-negative-default)', marginTop: 8 }}>{error}</Paragraph>}

      <div className={styles.footer}>
        <CtaButton disabled={!canContinue} onClick={() => { setError(''); setShowOtp(true); }}>
          Continue
        </CtaButton>
      </div>

      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onOtpSubmit={handleOtpSubmit}
        isSubmitting={otpLoading}
        phoneNumber={mobile ? `XXXXXX${mobile.slice(-4)}` : undefined}
      />

      {activeConsent && (
        <Modal
          isOpen={!!activeConsent}
          onClose={() => setActiveConsent(null)}
          title="Consent Details"
        >
          <div className={styles.consentModalBody}>
            <Paragraph className={styles.consentSummary}>{activeConsent.summary}</Paragraph>
            <Paragraph variant="muted" className={styles.consentFull}>{activeConsent.full}</Paragraph>
            <Flex gap="12px" justifyContent="flex-end" style={{ marginTop: 24 }}>
              <Button appearance="tertiary" onClick={() => setActiveConsent(null)}>Cancel</Button>
              <CtaButton
                onClick={() => {
                  setConsents((prev) => ({ ...prev, [activeConsent.id]: true }));
                  setActiveConsent(null);
                }}
              >
                Accept
              </CtaButton>
            </Flex>
          </div>
        </Modal>
      )}
    </div>
  );
}
