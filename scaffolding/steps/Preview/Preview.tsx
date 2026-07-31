import { useState } from 'react';
import styles from './Preview.module.css';
import { Card } from '@api-banking/design.content.card';
import { Button } from '@api-banking/design.actions.button';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { Flex } from '@api-banking/design.layouts.flex';
import { SectionLayout } from '@api-banking/design.layouts.section-layout';
import { useJourney } from '../../context/JourneyContext';
import { submitForm, initiatePayment, getPaymentStatus } from '../../api/client';
import {
  buildTenureISO,
  formatCurrency,
  maskAccountNo,
  generateUUID,
  interestOptionLabel,
  maturityOptionLabel,
  todayISO,
} from '../../utils/tenure';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Flex justifyContent="space-between" className={styles.row}>
      <Paragraph variant="muted">{label}</Paragraph>
      <Paragraph><strong>{value}</strong></Paragraph>
    </Flex>
  );
}

export default function Preview() {
  const { state, dispatch } = useJourney();
  const { customer, account, fdType, depositAmount, interestPaymentOption, maturityOption,
    tenureYears, tenureMonths, tenureDays, roi, maturityAmount, interestEarned, maturityDate,
    branch, nominee, fundingMethod } = state;

  const [submitting, setSubmitting] = useState(false);
  const [overlayMsg, setOverlayMsg] = useState('');
  const [error, setError] = useState('');

  const tenure = buildTenureISO(tenureYears, tenureMonths, tenureDays);

  function buildTenureDisplay() {
    const parts = [];
    if (tenureYears) parts.push(`${tenureYears} Yr`);
    if (tenureMonths) parts.push(`${tenureMonths} Mo`);
    if (tenureDays) parts.push(`${tenureDays} Day`);
    return parts.join(' ') || '—';
  }

  function buildFormBody(paymentTxnId: string, paymentDate: string) {
    const instruction: Record<string, unknown> = {
      instruction: 'open_fd',
      id: 'i-1',
      productVariant: state.productConfig?.productVariant ?? 'FD101',
      depositAmount: { amount: parseFloat(depositAmount).toFixed(2), currency: 'INR' },
      tenure,
      interestPaymentInstruction: {
        option: interestPaymentOption,
        ...(interestPaymentOption !== 'at_maturity' && account ? { payoutAccount: { type: 'account_id', accountId: account.accountId } } : {}),
      },
      maturityInstruction: {
        option: maturityOption,
        ...(account ? { payoutAccount: { type: 'account_id', accountId: account.accountId } } : {}),
        ...(maturityOption === 'renew' ? { renewalOption: 'full' } : {}),
        ...(maturityOption === 'transfer' ? { managersCheque: true } : {}),
      },
      branchCode: branch?.code ?? '',
      openMode: 'solo',
      holder: { customerId: customer?.customerId },
      ...(account ? { debitAccount: { accountId: account.accountId } } : {}),
    };
    if (nominee) {
      instruction.nomination = {
        nominees: [{ ref: 'inline', nominee: { name: { firstName: nominee.name }, dob: nominee.dob, relationship: nominee.relationship, address: { lines: ['N/A'], city: 'N/A', state: 'IN-MH', pin: '400001', country: 'IN' }, sharePct: 100 } }],
      };
    }
    const sections: Record<string, unknown>[] = [{
      section: 'payment', id: 's-1', method: 'net_banking',
      amount: { amount: parseFloat(depositAmount).toFixed(2), currency: 'INR' },
      status: 'paid', accountId: account?.accountId ?? '', ifsc: branch?.ifsc ?? '',
      paymentDate, paymentTxnId, pg: { name: 'ccAvenue' },
    }];
    return { instructions: [instruction], sections };
  }

  async function handleConfirmHDFC() {
    setSubmitting(true);
    setError('');
    setOverlayMsg('Submitting your application…');
    const idempotencyKey = generateUUID();
    try {
      const body = buildFormBody(generateUUID(), todayISO());
      const res = await submitForm(body, idempotencyKey, state.bearerToken);
      dispatch({ type: 'SET_APPLICATION_ID', payload: res.applicationId });
    } catch (err: unknown) {
      const e = err as { status?: number; data?: { violations?: Array<{ message: string }>; applicationId?: string } };
      if (e.status === 409 && e.data?.applicationId) {
        dispatch({ type: 'SET_APPLICATION_ID', payload: e.data.applicationId });
        return;
      }
      const violations = e.data?.violations?.map((v) => v.message).join(', ');
      setError(violations || (e.status && e.status >= 500 ? 'Submission failed due to a server error. Please try again.' : 'Unable to submit. Please check your details.'));
      setSubmitting(false);
      setOverlayMsg('');
    }
  }

  async function handleConfirmOtherBank() {
    setSubmitting(true);
    setError('');
    setOverlayMsg('Initiating payment…');
    const clientRef = `FD${Date.now()}`;
    const idempotencyKey = generateUUID();
    try {
      const paymentBody = {
        customer: { customerId: customer?.customerId },
        productCategory: ['fd'],
        clientReferenceNumber: clientRef,
        clientSuccessUrl: `${window.location.origin}?payment=success&ref=${clientRef}`,
        clientFailureUrl: `${window.location.origin}?payment=failure&ref=${clientRef}`,
        method: 'net_banking',
        instrument: { accountId: account?.accountId, ifsc: branch?.ifsc },
        amount: { amount: parseFloat(depositAmount).toFixed(2), currency: 'INR' },
      };
      const payRes = await initiatePayment(paymentBody, idempotencyKey, state.bearerToken);
      if (payRes.paymentLink?.url) { window.location.href = payRes.paymentLink.url; return; }
      setOverlayMsg('Waiting for payment confirmation…');
      const statusRes = await getPaymentStatus(clientRef, state.bearerToken);
      if (statusRes.status === 'failed') {
        setError('Payment could not be confirmed. Please try again.');
        setSubmitting(false); setOverlayMsg(''); return;
      }
      setOverlayMsg('Submitting your application…');
      const formBody = buildFormBody(payRes.paymentTxnId, todayISO());
      const formRes = await submitForm(formBody, generateUUID(), state.bearerToken);
      dispatch({ type: 'SET_APPLICATION_ID', payload: formRes.applicationId });
    } catch {
      setError('Payment was not completed. Please try again.');
      setSubmitting(false); setOverlayMsg('');
    }
  }

  return (
    <>
      <div className={styles.body}>
        <Heading level={2} visualLevel="h3">Review Your Application</Heading>
        <Paragraph variant="muted">Please review all details before confirming. To change anything, go back to the relevant step.</Paragraph>

        {error && <Paragraph style={{ color: 'var(--colors-status-negative-default)', padding: '10px', background: 'var(--colors-status-negative-subtle)', borderRadius: 'var(--borders-radius-small)' }}>{error}</Paragraph>}

        <Card variant="outlined">
          <SectionLayout title="Customer Details">
            <Flex flexDirection="column" gap="8px">
              <Row label="Name" value={customer?.name ?? '—'} />
              <Row label="Date of Birth" value={customer?.dob ?? '—'} />
              {customer?.pan && <Row label="PAN" value={customer.pan} />}
            </Flex>
          </SectionLayout>
        </Card>

        <Card variant="outlined">
          <SectionLayout title="FD Details">
            <Flex flexDirection="column" gap="8px">
              <Row label="FD Type" value={fdType === 'withdrawable' ? 'Withdrawable' : 'Non-Withdrawable'} />
              <Row label="Deposit Amount" value={depositAmount ? formatCurrency(depositAmount) : '—'} />
              <Row label="Tenure" value={buildTenureDisplay()} />
              <Row label="Interest Payout" value={interestPaymentOption ? interestOptionLabel(interestPaymentOption) : '—'} />
              <Row label="Maturity Instruction" value={maturityOption ? maturityOptionLabel(maturityOption) : '—'} />
              {roi !== null && <Row label="Rate of Interest" value={`${roi}% p.a.`} />}
              {interestEarned && <Row label="Interest Earned" value={formatCurrency(interestEarned)} />}
              {maturityAmount && <Row label="Maturity Amount" value={formatCurrency(maturityAmount)} />}
              {maturityDate && <Row label="Maturity Date" value={maturityDate} />}
            </Flex>
          </SectionLayout>
        </Card>

        <Card variant="outlined">
          <SectionLayout title="Bank Account Details">
            <Flex flexDirection="column" gap="8px">
              <Row label="Linked Account" value={account ? maskAccountNo(account.accountNo) : '—'} />
              <Row label="Branch" value={branch?.name ?? '—'} />
              <Row label="IFSC" value={branch?.ifsc ?? '—'} />
              <Row label="Funding Method" value={fundingMethod === 'hdfc' ? 'HDFC Bank (Direct)' : 'Other Bank (Gateway)'} />
            </Flex>
          </SectionLayout>
        </Card>

        {nominee && (
          <Card variant="outlined">
            <SectionLayout title="Nominee Details">
              <Flex flexDirection="column" gap="8px">
                <Row label="Name" value={nominee.name} />
                <Row label="Relationship" value={nominee.relationship} />
                <Row label="Date of Birth" value={nominee.dob} />
                {nominee.guardian && <Row label="Guardian" value={`${nominee.guardian.name} (${nominee.guardian.relationship})`} />}
              </Flex>
            </SectionLayout>
          </Card>
        )}

        <Flex justifyContent="space-between" style={{ marginTop: 8 }}>
          <Button appearance="tertiary" onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>Back</Button>
          <CtaButton disabled={submitting} onClick={fundingMethod === 'hdfc' ? handleConfirmHDFC : handleConfirmOtherBank}>
            {submitting ? overlayMsg || 'Processing…' : 'Confirm & Submit'}
          </CtaButton>
        </Flex>
      </div>

      {submitting && (
        <div className={styles.overlay}>
          <div className={styles.overlaySpinner} />
          <Paragraph className={styles.overlayText}>{overlayMsg}</Paragraph>
        </div>
      )}
    </>
  );
}
