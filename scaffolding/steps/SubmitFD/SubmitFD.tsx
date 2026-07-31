import { useEffect, useState } from 'react';
import styles from './SubmitFD.module.css';
import { Card } from '@api-banking/design.content.card';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { Flex } from '@api-banking/design.layouts.flex';
import { SectionLayout } from '@api-banking/design.layouts.section-layout';
import { useJourney } from '../../context/JourneyContext';
import { getFormDetailedStatus } from '../../api/client';
import { formatCurrency, maskAccountNo, interestOptionLabel, maturityOptionLabel } from '../../utils/tenure';

type PollState = 'polling' | 'completed' | 'rejected' | 'timeout';

function SRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justifyContent="space-between" className={styles.summaryRow}>
      <Paragraph variant="muted">{label}</Paragraph>
      <Paragraph><strong>{value}</strong></Paragraph>
    </Flex>
  );
}

export default function SubmitFD() {
  const { state, dispatch } = useJourney();
  const { applicationId, customer, account, nominee,
    fdType, depositAmount, interestPaymentOption, maturityOption,
    tenureYears, tenureMonths, tenureDays, roi, maturityAmount, maturityDate, branch } = state;

  const [pollState, setPollState] = useState<PollState>('polling');
  const [fdAccountNo, setFdAccountNo] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!applicationId) { setPollState('timeout'); return; }
    let cancelled = false;
    let attempt = 0;
    let failures = 0;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await getFormDetailedStatus(applicationId!, state.bearerToken);
        failures = 0;
        attempt++;
        const status = res.status?.toUpperCase();
        if (status === 'COMPLETED') {
          const fdInstruction = res.instructions?.find((i) => i.instructionType === 'open_fd') ?? res.instructions?.find((i) => !!i.accountNo);
          if (fdInstruction?.accountNo) {
            setFdAccountNo(fdInstruction.accountNo);
            dispatch({ type: 'SET_FD_ACCOUNT_NO', payload: fdInstruction.accountNo });
          }
          setPollState('completed');
        } else if (status === 'REJECTED' || status === 'FAILED') {
          setPollState('rejected');
        } else if (attempt >= 10) {
          setPollState('timeout');
        } else {
          setAttempts(attempt);
          setTimeout(poll, 2000);
        }
      } catch {
        failures++;
        if (failures >= 3) setPollState('timeout');
        else setTimeout(poll, 2000);
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [applicationId]);

  function buildTenureDisplay() {
    const parts = [];
    if (tenureYears) parts.push(`${tenureYears} Yr`);
    if (tenureMonths) parts.push(`${tenureMonths} Mo`);
    if (tenureDays) parts.push(`${tenureDays} Day`);
    return parts.join(' ') || '—';
  }

  if (pollState === 'polling') {
    return (
      <div className={styles.body}>
        <Flex flexDirection="column" alignItems="center" gap="16px" className={styles.centerContent}>
          <div className={styles.spinner} />
          <Paragraph>Processing your application…</Paragraph>
          {attempts > 0 && <Paragraph variant="muted">Checking status…</Paragraph>}
        </Flex>
      </div>
    );
  }

  if (pollState === 'rejected') {
    return (
      <div className={styles.body}>
        <Card variant="outlined" className={styles.statusCard}>
          <Heading level={3} visualLevel="h4" style={{ color: 'var(--colors-status-negative-default)' }}>Application Not Processed</Heading>
          <Paragraph>Your application could not be processed. Please contact support.</Paragraph>
          {applicationId && <Paragraph variant="muted">Ref: {applicationId}</Paragraph>}
        </Card>
        <CtaButton onClick={() => dispatch({ type: 'RESET' })}>Back to Home</CtaButton>
      </div>
    );
  }

  if (pollState === 'timeout') {
    return (
      <div className={styles.body}>
        <Card variant="outlined" className={styles.statusCard}>
          <Paragraph>Your application has been submitted and is being processed.</Paragraph>
          {applicationId && <Paragraph><strong>Reference ID: {applicationId}</strong></Paragraph>}
          <Paragraph variant="muted">You will receive a confirmation shortly.</Paragraph>
        </Card>
        <CtaButton onClick={() => dispatch({ type: 'RESET' })}>Back to Home</CtaButton>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <Flex flexDirection="column" alignItems="center" gap="12px">
        <div className={styles.successIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l7 7 13-13" stroke="var(--colors-status-positive-default)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <Heading level={2} visualLevel="h3" style={{ textAlign: 'center' }}>Application Submitted!</Heading>
        <Paragraph variant="muted" style={{ textAlign: 'center' }}>Your Fixed Deposit has been successfully opened.</Paragraph>
      </Flex>

      <Card variant="outlined">
        <SectionLayout title="Application Summary">
          <Flex flexDirection="column" gap="8px">
            {applicationId && <SRow label="Reference No." value={applicationId} />}
            {fdAccountNo && <SRow label="FD Account No." value={maskAccountNo(fdAccountNo)} />}
            {customer && <SRow label="Customer Name" value={customer.name} />}
            <SRow label="FD Type" value={fdType === 'withdrawable' ? 'Withdrawable' : 'Non-Withdrawable'} />
            <SRow label="Deposit Amount" value={depositAmount ? formatCurrency(depositAmount) : '—'} />
            <SRow label="Tenure" value={buildTenureDisplay()} />
            {interestPaymentOption && <SRow label="Interest Payout" value={interestOptionLabel(interestPaymentOption)} />}
            {maturityOption && <SRow label="Maturity Instruction" value={maturityOptionLabel(maturityOption)} />}
            {roi !== null && <SRow label="Rate of Interest" value={`${roi}% p.a.`} />}
            {maturityAmount && <SRow label="Maturity Amount" value={formatCurrency(maturityAmount)} />}
            {maturityDate && <SRow label="Maturity Date" value={maturityDate} />}
            {account && <SRow label="Linked Account" value={maskAccountNo(account.accountNo)} />}
            {branch && <SRow label="Branch" value={branch.name} />}
            {branch && <SRow label="IFSC" value={branch.ifsc} />}
          </Flex>
        </SectionLayout>
      </Card>

      {nominee && (
        <Card variant="outlined">
          <SectionLayout title="Nominee Details">
            <Flex flexDirection="column" gap="8px">
              <SRow label="Name" value={nominee.name} />
              <SRow label="Relationship" value={nominee.relationship} />
              <SRow label="Date of Birth" value={nominee.dob} />
              {nominee.guardian && <SRow label="Guardian" value={`${nominee.guardian.name} (${nominee.guardian.relationship})`} />}
            </Flex>
          </SectionLayout>
        </Card>
      )}

      <Flex justifyContent="center">
        <CtaButton onClick={() => dispatch({ type: 'RESET' })}>Back to Home</CtaButton>
      </Flex>
    </div>
  );
}
