import { useState, useEffect } from 'react';
import styles from './DepositDetails.module.css';
import { Card } from '@api-banking/design.content.card';
import { Skeleton } from '@api-banking/design.content.skeleton';
import { TextInput } from '@api-banking/design.inputs.text-input';
import { InputGroup } from '@api-banking/design.inputs.input-group';
import { Select } from '@api-banking/design.inputs.select';
import { RadioButton } from '@api-banking/design.inputs.radio-button';
import { Button } from '@api-banking/design.actions.button';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { Flex } from '@api-banking/design.layouts.flex';
import { SectionLayout } from '@api-banking/design.layouts.section-layout';
import { useJourney } from '../../context/JourneyContext';
import { getProductConfig, calculateFD } from '../../api/client';
import type { ProductConfigResponse } from '../../api/client';
import type { InterestPaymentOption, ProductConfig } from '../../types';
import {
  buildTenureISO,
  addTenureToDate,
  formatDisplayDate,
  formatCurrency,
  interestOptionLabel,
  maturityOptionLabel,
} from '../../utils/tenure';

const DEFAULT_CONFIG: ProductConfig = {
  productVariant: 'FD101',
  minDeposit: 5000,
  maxDeposit: 10000000,
  allowedInterestOptions: ['at_maturity', 'monthly', 'quarterly'],
  allowedMaturityOptions: ['close', 'renew'],
  minTenureDays: 7,
  maxTenureDays: 3650,
};

export default function DepositDetails() {
  const { state, dispatch } = useJourney();
  const { customer, productConfig } = state;

  const [configLoading, setConfigLoading] = useState(!productConfig);
  const [configError, setConfigError] = useState('');
  const [fdType, setFdType] = useState(state.fdType);
  const [amount, setAmount] = useState(state.depositAmount);
  const [interestOption, setInterestOption] = useState<InterestPaymentOption | ''>(state.interestPaymentOption);
  const [maturityOpt, setMaturityOpt] = useState(state.maturityOption);
  const [years, setYears] = useState<string>(String(state.tenureYears));
  const [months, setMonths] = useState<string>(String(state.tenureMonths));
  const [days, setDays] = useState<string>(String(state.tenureDays));
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState('');
  const [roi, setRoi] = useState<number | null>(state.roi);
  const [maturityAmount, setMaturityAmount] = useState<string | null>(state.maturityAmount);
  const [interestEarned, setInterestEarned] = useState<string | null>(state.interestEarned);
  const [maturityDate, setMaturityDate] = useState<string | null>(state.maturityDate);
  const [amountError, setAmountError] = useState('');

  const cfg = productConfig ?? DEFAULT_CONFIG;

  useEffect(() => {
    if (productConfig) return;
    setConfigLoading(true);
    getProductConfig('FD101')
      .then((res) => {
        const arr = res as ProductConfigResponse[];
        const item = Array.isArray(arr) ? arr[0] : null;
        if (item?.terms) {
          const t = item.terms;
          const parsed: ProductConfig = {
            productVariant: item.product ?? 'FD101',
            minDeposit: t.initialDeposit?.min?.value?.amount ?? DEFAULT_CONFIG.minDeposit,
            maxDeposit: t.initialDeposit?.max?.value?.amount ?? DEFAULT_CONFIG.maxDeposit,
            allowedInterestOptions: (t.interestPaymentOption?.allow ?? DEFAULT_CONFIG.allowedInterestOptions) as InterestPaymentOption[],
            allowedMaturityOptions: t.maturityOption?.allow ?? DEFAULT_CONFIG.allowedMaturityOptions,
            minTenureDays: DEFAULT_CONFIG.minTenureDays,
            maxTenureDays: DEFAULT_CONFIG.maxTenureDays,
          };
          dispatch({ type: 'SET_PRODUCT_CONFIG', payload: parsed });
        } else {
          dispatch({ type: 'SET_PRODUCT_CONFIG', payload: DEFAULT_CONFIG });
        }
      })
      .catch(() => {
        setConfigError('Unable to load product options. Please refresh.');
        dispatch({ type: 'SET_PRODUCT_CONFIG', payload: DEFAULT_CONFIG });
      })
      .finally(() => setConfigLoading(false));
  }, []);

  async function handleCalculate() {
    setCalcError('');
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt)) { setCalcError('Please enter a valid amount.'); return; }
    if (amt < cfg.minDeposit || amt > cfg.maxDeposit) {
      setAmountError(`Amount must be between ${formatCurrency(cfg.minDeposit)} and ${formatCurrency(cfg.maxDeposit)}`);
      return;
    }
    const tenure = buildTenureISO(Number(years) || '', Number(months) || '', Number(days) || '');
    if (tenure === 'P0D') { setCalcError('Please enter a valid tenure.'); return; }
    const totalDays = (Number(years) || 0) * 365 + (Number(months) || 0) * 30 + (Number(days) || 0);
    if (totalDays < cfg.minTenureDays || totalDays > cfg.maxTenureDays) {
      setCalcError('Tenure must be between 7 days and 10 years'); return;
    }
    setCalcLoading(true);
    try {
      const res = await calculateFD({
        productVariant: cfg.productVariant,
        depositAmount: { amount: amt.toFixed(2), currency: 'INR' },
        tenure,
        openMode: 'solo',
        interestPaymentOption: interestOption || 'at_maturity',
      });
      const mDate = res.maturityDate
        ? formatDisplayDate(res.maturityDate)
        : formatDisplayDate(addTenureToDate(new Date(), Number(years) || '', Number(months) || '', Number(days) || '').toISOString().split('T')[0]);
      const matAmt = Number(res.maturityAmount.amount);
      const earned = res.interestEarned ? String(Number(res.interestEarned.amount)) : String((matAmt - amt).toFixed(2));
      setRoi(res.roi);
      setMaturityAmount(String(matAmt));
      setInterestEarned(earned);
      setMaturityDate(mDate);
    } catch {
      setCalcError('Unable to calculate. Please check your inputs and try again.');
    } finally {
      setCalcLoading(false);
    }
  }

  function validateAndContinue() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < cfg.minDeposit || amt > cfg.maxDeposit) {
      setAmountError(`Amount must be between ${formatCurrency(cfg.minDeposit)} and ${formatCurrency(cfg.maxDeposit)}`);
      return;
    }
    if (!fdType || !interestOption || !maturityOpt) return;
    const tenure = buildTenureISO(Number(years) || '', Number(months) || '', Number(days) || '');
    if (tenure === 'P0D') return;
    dispatch({ type: 'SET_FD_TYPE', payload: fdType as 'withdrawable' | 'non-withdrawable' });
    dispatch({ type: 'SET_DEPOSIT_AMOUNT', payload: amount });
    dispatch({ type: 'SET_INTEREST_OPTION', payload: interestOption });
    dispatch({ type: 'SET_MATURITY_OPTION', payload: maturityOpt });
    dispatch({ type: 'SET_TENURE', payload: { years: Number(years) || '', months: Number(months) || '', days: Number(days) || '' } });
    if (roi !== null && maturityAmount && interestEarned && maturityDate) {
      dispatch({ type: 'SET_CALCULATION_RESULT', payload: { roi, maturityAmount, interestEarned, maturityDate } });
    }
    dispatch({ type: 'SET_STEP', payload: 3 });
  }

  const canCalc = !!amount && !!interestOption && (!!years || !!months || !!days);
  const canContinue = !!fdType && !!amount && !!interestOption && !!maturityOpt && (!!years || !!months || !!days) && !!roi;

  const maturityBannerMsg: Record<string, string> = {
    close: 'The FD will be closed at maturity and proceeds credited to your account.',
    renew: 'The FD will be automatically renewed at maturity.',
    transfer: "The maturity amount will be transferred via manager's cheque.",
  };

  return (
    <div className={styles.body}>
      <Heading level={2} visualLevel="h3">Deposit Details</Heading>

      {customer && (
        <Card variant="outlined" className={styles.customerCard}>
          <Flex gap="16px" flexWrap="wrap">
            <div><Paragraph variant="muted" element="span" className={styles.infoLabel}>Name</Paragraph><Paragraph element="span" className={styles.infoValue}>{customer.name}</Paragraph></div>
            <div><Paragraph variant="muted" element="span" className={styles.infoLabel}>Date of Birth</Paragraph><Paragraph element="span" className={styles.infoValue}>{formatDisplayDate(customer.dob)}</Paragraph></div>
            {customer.pan && <div><Paragraph variant="muted" element="span" className={styles.infoLabel}>PAN</Paragraph><Paragraph element="span" className={styles.infoValue}>{customer.pan}</Paragraph></div>}
          </Flex>
        </Card>
      )}

      {configError && <Paragraph style={{ color: 'var(--colors-status-negative-default)' }}>{configError}</Paragraph>}

      <InputGroup label="FD Type">
        <Flex gap="12px" flexWrap="wrap" className={styles.radioRow}>
          <RadioButton id="fd-withdrawable" name="fdType" value="withdrawable" label={<span><strong>Withdrawable</strong><br /><span className={styles.radioSub}>Premature withdrawal allowed</span></span>} checked={fdType === 'withdrawable'} onChange={() => setFdType('withdrawable')} />
          <RadioButton id="fd-non-withdrawable" name="fdType" value="non-withdrawable" label={<span><strong>Non-Withdrawable</strong><br /><span className={styles.radioSub}>Higher interest rate</span></span>} checked={fdType === 'non-withdrawable'} onChange={() => setFdType('non-withdrawable')} />
        </Flex>
      </InputGroup>

      <InputGroup label="FD Amount (₹)" inputId="amount" errorText={amountError || undefined}>
        <TextInput
          id="amount"
          type="number"
          placeholder={`Min ₹${cfg.minDeposit.toLocaleString('en-IN')}`}
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setAmountError(''); setRoi(null); }}
          error={!!amountError}
        />
      </InputGroup>

      <InputGroup label="Interest Payout">
        {configLoading ? (
          <Skeleton variant="rectangular" height="48px" />
        ) : (
          <Flex gap="12px" flexWrap="wrap" className={styles.radioRow}>
            {cfg.allowedInterestOptions.map((o) => (
              <RadioButton key={o} id={`interest-${o}`} name="interestOption" value={o} label={interestOptionLabel(o)} checked={interestOption === o} onChange={() => { setInterestOption(o as InterestPaymentOption); setRoi(null); }} />
            ))}
          </Flex>
        )}
      </InputGroup>

      <InputGroup label="Maturity Instructions" inputId="maturityOpt">
        {configLoading ? (
          <Skeleton variant="rectangular" height="48px" />
        ) : (
          <>
            <Select
              id="maturityOpt"
              value={maturityOpt}
              onChange={(v) => setMaturityOpt(v)}
              options={[{ value: '', label: 'Select an option' }, ...cfg.allowedMaturityOptions.map((o) => ({ value: o, label: maturityOptionLabel(o) }))]}
              placeholder="Select an option"
            />
            {maturityOpt && maturityBannerMsg[maturityOpt] && (
              <Paragraph variant="muted" style={{ marginTop: 8, padding: '8px 12px', background: 'var(--colors-status-info-subtle)', borderRadius: 'var(--borders-radius-small)', fontSize: '14px' }}>
                ℹ️ {maturityBannerMsg[maturityOpt]}
              </Paragraph>
            )}
            {interestOption !== 'at_maturity' && maturityOpt === 'renew' && (
              <Paragraph variant="muted" style={{ marginTop: 8, padding: '8px 12px', background: 'var(--colors-status-warning-subtle)', borderRadius: 'var(--borders-radius-small)', fontSize: '14px' }}>
                ⚠️ Renewal options are not available with monthly or quarterly interest payout.
              </Paragraph>
            )}
          </>
        )}
      </InputGroup>

      <InputGroup label="Tenure">
        <Flex gap="12px">
          {[{ lbl: 'Years', val: years, set: setYears }, { lbl: 'Months', val: months, set: setMonths }, { lbl: 'Days', val: days, set: setDays }].map(({ lbl, val, set }) => (
            <div key={lbl} className={styles.tenureField}>
              <Paragraph variant="muted" className={styles.tenureLabel}>{lbl}</Paragraph>
              <TextInput id={`tenure-${lbl}`} type="number" placeholder="0" value={val} onChange={(e) => { set(e.target.value); setRoi(null); }} />
            </div>
          ))}
        </Flex>
      </InputGroup>

      {calcError && <Paragraph style={{ color: 'var(--colors-status-negative-default)' }}>{calcError}</Paragraph>}

      <Button appearance="secondary" onClick={handleCalculate} disabled={!canCalc || calcLoading}>
        {calcLoading ? 'Calculating…' : 'Calculate FD Details'}
      </Button>

      {roi !== null && maturityAmount && (
        <Card variant="outlined" className={styles.maturityCard}>
          <SectionLayout title="Calculation Result">
            <Flex flexDirection="column" gap="12px">
              <Flex justifyContent="space-between"><Paragraph variant="muted">Rate of Interest</Paragraph><Paragraph><strong>{roi}% p.a.</strong></Paragraph></Flex>
              <Flex justifyContent="space-between"><Paragraph variant="muted">Interest Earned</Paragraph><Paragraph style={{ color: 'var(--colors-status-positive-default)' }}><strong>{formatCurrency(interestEarned ?? '0')}</strong></Paragraph></Flex>
              <Flex justifyContent="space-between"><Paragraph variant="muted">Maturity Amount</Paragraph><Paragraph style={{ color: 'var(--colors-status-positive-default)' }}><strong>{formatCurrency(maturityAmount)}</strong></Paragraph></Flex>
              <Flex justifyContent="space-between"><Paragraph variant="muted">Maturity Date</Paragraph><Paragraph>{maturityDate}</Paragraph></Flex>
            </Flex>
          </SectionLayout>
        </Card>
      )}

      <Flex justifyContent="space-between" style={{ marginTop: 8 }}>
        <Button appearance="tertiary" onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>Back</Button>
        <CtaButton disabled={!canContinue} onClick={validateAndContinue}>Continue</CtaButton>
      </Flex>
    </div>
  );
}
