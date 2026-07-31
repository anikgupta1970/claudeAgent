import { useState } from 'react';
import styles from './BankDetails.module.css';
import { Card } from '@api-banking/design.content.card';
import { RadioButton } from '@api-banking/design.inputs.radio-button';
import { InputGroup } from '@api-banking/design.inputs.input-group';
import { Select } from '@api-banking/design.inputs.select';
import { Button } from '@api-banking/design.actions.button';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { Modal } from '@api-banking/design.overlays.modal';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { Flex } from '@api-banking/design.layouts.flex';
import { Skeleton } from '@api-banking/design.content.skeleton';
import { Checkbox } from '@api-banking/design.inputs.checkbox';
import { TextInput } from '@api-banking/design.inputs.text-input';
import { useJourney } from '../../context/JourneyContext';
import { getBranches, getNomineeRelationships } from '../../api/client';
import type { Branch, Nominee } from '../../types';
import { formatCurrency, maskAccountNo } from '../../utils/tenure';

function isMinor(dob: string) {
  if (!dob) return false;
  const birth = new Date(dob);
  const age = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return age < 18;
}

export default function BankDetails() {
  const { state, dispatch } = useJourney();
  const { account, depositAmount } = state;

  const [fundingMethod, setFundingMethod] = useState<'' | 'hdfc' | 'other_bank' | 'combined'>(state.fundingMethod);
  const [showBranch, setShowBranch] = useState(false);
  const [showNominee, setShowNominee] = useState(!!state.nominee);
  const [showNomineeModal, setShowNomineeModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(state.branch);
  const [nominee, setNominee] = useState<Nominee | null>(state.nominee);
  const [branchError, setBranchError] = useState('');
  const [continueError, setContinueError] = useState('');

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchLoadError, setBranchLoadError] = useState('');
  const [searchMode, setSearchMode] = useState<'location' | 'pincode'>('location');
  const [pinSearch, setPinSearch] = useState('');
  const [selState, setSelState] = useState('');
  const [selCity, setSelCity] = useState('');
  const [selBranch, setSelBranch] = useState<Branch | null>(null);

  const [relationships, setRelationships] = useState<string[]>([]);
  const [relLoading, setRelLoading] = useState(false);
  const [nomRelationship, setNomRelationship] = useState(nominee?.relationship ?? '');
  const [nomName, setNomName] = useState(nominee?.name ?? '');
  const [nomDob, setNomDob] = useState(nominee?.dob ?? '');
  const [guardianName, setGuardianName] = useState(nominee?.guardian?.name ?? '');
  const [guardianRel, setGuardianRel] = useState(nominee?.guardian?.relationship ?? '');
  const [guardianDob, setGuardianDob] = useState(nominee?.guardian?.dob ?? '');

  async function openBranchModal() {
    setShowBranch(true);
    setSelBranch(null);
    if (branches.length) return;
    setBranchLoading(true);
    setBranchLoadError('');
    try {
      const res = await getBranches();
      const arr: Branch[] = Array.isArray(res)
        ? (res as Branch[])
        : ((res as { content?: Branch[]; branches?: Branch[] }).content ?? (res as { branches?: Branch[] }).branches ?? []);
      setBranches(arr);
    } catch {
      setBranchLoadError('Unable to load branch list. Please try again.');
    } finally {
      setBranchLoading(false);
    }
  }

  async function openNomineeModal() {
    setShowNomineeModal(true);
    if (relationships.length) return;
    setRelLoading(true);
    try {
      const res = await getNomineeRelationships();
      const arr: string[] = Array.isArray(res) ? (res[0]?.choices ?? []) : ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];
      setRelationships(arr);
    } catch {
      setRelationships(['Spouse', 'Child', 'Parent', 'Sibling', 'Other']);
    } finally {
      setRelLoading(false);
    }
  }

  const states = [...new Set(branches.map((b) => b.state))].sort();
  const cities = [...new Set(branches.filter((b) => b.state === selState).map((b) => b.city))].sort();
  const filteredBranches = branches.filter((b) => b.state === selState && b.city === selCity);
  const pinFilteredBranches = branches.filter((b) => pinSearch.length === 6 && b.postalCode === pinSearch);

  function confirmBranch() {
    if (!selBranch) return;
    setSelectedBranch(selBranch);
    setBranchError('');
    setShowBranch(false);
  }

  function saveNominee() {
    const nom: Nominee = { relationship: nomRelationship, name: nomName, dob: nomDob };
    if (isMinor(nomDob)) nom.guardian = { name: guardianName, relationship: guardianRel, dob: guardianDob };
    setNominee(nom);
    setShowNomineeModal(false);
  }

  function handleContinue() {
    if (!selectedBranch) { setContinueError('Please select a branch before continuing.'); return; }
    if (!fundingMethod) { setContinueError('Please select a funding method.'); return; }
    dispatch({ type: 'SET_FUNDING_METHOD', payload: fundingMethod as 'hdfc' | 'other_bank' });
    dispatch({ type: 'SET_BRANCH', payload: selectedBranch });
    dispatch({ type: 'SET_NOMINEE', payload: nominee });
    dispatch({ type: 'SET_STEP', payload: 4 });
  }

  const relOptions = relLoading ? [] : [{ value: '', label: 'Select Relationship' }, ...relationships.map((r) => ({ value: r, label: r }))];

  return (
    <div className={styles.body}>
      <Heading level={2} visualLevel="h3">Bank Details</Heading>

      <Card variant="outlined" className={styles.fundingAmountCard}>
        <Paragraph variant="muted" className={styles.fundingLabel}>FD Funding Amount</Paragraph>
        <Heading level={3} visualLevel="h4">{depositAmount ? formatCurrency(depositAmount) : '—'}</Heading>
        <Paragraph variant="muted">Total amount to be debited</Paragraph>
      </Card>

      <InputGroup label="Fund via">
        <Flex flexDirection="column" gap="10px">
          <RadioButton
            id="fund-hdfc"
            name="fundingMethod"
            value="hdfc"
            label={<span><strong>HDFC Bank</strong><br /><span className={styles.radioSub}>{account ? `${maskAccountNo(account.accountNo)} · Bal: ${formatCurrency(account.currentBalance)}` : 'Linked savings account'}</span></span>}
            checked={fundingMethod === 'hdfc'}
            onChange={() => setFundingMethod('hdfc')}
          />
          <RadioButton
            id="fund-other"
            name="fundingMethod"
            value="other_bank"
            label={<span><strong>Other Bank</strong><br /><span className={styles.radioSub}>Via payment gateway</span></span>}
            checked={fundingMethod === 'other_bank'}
            onChange={() => setFundingMethod('other_bank')}
          />
          <RadioButton
            id="fund-combined"
            name="fundingMethod"
            value="combined"
            label={<span><strong style={{ opacity: 0.5 }}>Combined Funds</strong><br /><span className={styles.radioSub}>Not available</span></span>}
            checked={fundingMethod === 'combined'}
            onChange={() => setFundingMethod('combined')}
            disabled
          />
        </Flex>
        {fundingMethod === 'hdfc' && account && (
          <Card variant="outlined" className={styles.hdfcCard}>
            <Flex justifyContent="space-between" alignItems="center">
              <div>
                <Paragraph><strong>{maskAccountNo(account.accountNo)}</strong></Paragraph>
                <Paragraph variant="muted">Available Balance: {formatCurrency(account.currentBalance)}</Paragraph>
              </div>
              <span className={styles.checkMark}>✓</span>
            </Flex>
          </Card>
        )}
      </InputGroup>

      <InputGroup label="Branch" errorText={branchError || undefined}>
        {selectedBranch ? (
          <Card variant="outlined" className={styles.branchCard}>
            <Flex justifyContent="space-between" alignItems="flex-start">
              <div>
                <Paragraph><strong>{selectedBranch.name}</strong></Paragraph>
                <Paragraph variant="muted">{selectedBranch.address} · IFSC: {selectedBranch.ifsc}</Paragraph>
              </div>
              <Button appearance="tertiary" onClick={openBranchModal} style={{ fontSize: 13, padding: '4px 12px' }}>Change</Button>
            </Flex>
          </Card>
        ) : (
          <Button appearance="tertiary" onClick={openBranchModal}>🏦 Search Branch</Button>
        )}
      </InputGroup>

      <div>
        <Checkbox
          id="show-nominee"
          checked={showNominee}
          onChange={(e) => {
            setShowNominee(e.target.checked);
            if (!e.target.checked) setNominee(null);
            else openNomineeModal();
          }}
          label="Add Nominee (Optional)"
        />
        {showNominee && nominee && (
          <Card variant="outlined" className={styles.nomineeCard}>
            <Flex justifyContent="space-between" alignItems="flex-start">
              <div>
                <Paragraph><strong>{nominee.name}</strong></Paragraph>
                <Paragraph variant="muted">{nominee.relationship} · {nominee.dob}</Paragraph>
                {nominee.guardian && <Paragraph variant="muted">Guardian: {nominee.guardian.name}</Paragraph>}
              </div>
              <Button appearance="tertiary" onClick={() => openNomineeModal()} style={{ fontSize: 13, padding: '4px 12px' }}>Edit</Button>
            </Flex>
          </Card>
        )}
        {showNominee && !nominee && (
          <Button appearance="tertiary" onClick={() => { setShowNomineeModal(true); openNomineeModal(); }} style={{ marginTop: 8 }}>
            Enter Nominee Details
          </Button>
        )}
      </div>

      {continueError && <Paragraph style={{ color: 'var(--colors-status-negative-default)' }}>{continueError}</Paragraph>}

      <Flex justifyContent="space-between">
        <Button appearance="tertiary" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</Button>
        <CtaButton disabled={!fundingMethod || !selectedBranch} onClick={handleContinue}>Continue</CtaButton>
      </Flex>

      {/* Branch Modal */}
      <Modal isOpen={showBranch} onClose={() => setShowBranch(false)} title="Search Branch">
        {branchLoading ? (
          <Flex flexDirection="column" gap="8px">
            <Skeleton variant="rectangular" height="40px" />
            <Skeleton variant="rectangular" height="40px" />
            <Skeleton variant="rectangular" height="40px" />
          </Flex>
        ) : branchLoadError ? (
          <Paragraph style={{ color: 'var(--colors-status-negative-default)' }}>{branchLoadError}</Paragraph>
        ) : (
          <Flex flexDirection="column" gap="16px">
            <Flex gap="8px">
              <Button appearance={searchMode === 'location' ? 'primary' : 'tertiary'} onClick={() => setSearchMode('location')}>By Location</Button>
              <Button appearance={searchMode === 'pincode' ? 'primary' : 'tertiary'} onClick={() => setSearchMode('pincode')}>By PIN Code</Button>
            </Flex>

            {searchMode === 'location' ? (
              <>
                <InputGroup label="State" inputId="sel-state">
                  <Select id="sel-state" value={selState} onChange={(v) => { setSelState(v); setSelCity(''); setSelBranch(null); }} options={[{ value: '', label: 'Select State' }, ...states.map((s) => ({ value: s, label: s }))]} />
                </InputGroup>
                <InputGroup label="City" inputId="sel-city">
                  <Select id="sel-city" value={selCity} onChange={(v) => { setSelCity(v); setSelBranch(null); }} options={[{ value: '', label: 'Select City' }, ...cities.map((c) => ({ value: c, label: c }))]} disabled={!selState} />
                </InputGroup>
                <InputGroup label="Branch" inputId="sel-branch">
                  <Select id="sel-branch" value={selBranch?.code ?? ''} onChange={(v) => setSelBranch(filteredBranches.find((b) => b.code === v) ?? null)} options={[{ value: '', label: 'Select Branch' }, ...filteredBranches.map((b) => ({ value: b.code, label: b.name }))]} disabled={!selCity} />
                </InputGroup>
              </>
            ) : (
              <InputGroup label="PIN Code" inputId="pin-search">
                <TextInput id="pin-search" type="text" maxLength={6} placeholder="Enter 6-digit PIN code" value={pinSearch} onChange={(e) => { setPinSearch(e.target.value.replace(/\D/g, '')); setSelBranch(null); }} />
                {pinFilteredBranches.length > 0 && (
                  <Select id="pin-branch" value={selBranch?.code ?? ''} onChange={(v) => setSelBranch(pinFilteredBranches.find((b) => b.code === v) ?? null)} options={[{ value: '', label: 'Select Branch' }, ...pinFilteredBranches.map((b) => ({ value: b.code, label: b.name }))]} style={{ marginTop: 8 }} />
                )}
              </InputGroup>
            )}

            {selBranch && (
              <Card variant="outlined">
                <Paragraph><strong>{selBranch.name}</strong></Paragraph>
                <Paragraph variant="muted">{selBranch.address}</Paragraph>
                <Paragraph variant="muted">IFSC: <strong>{selBranch.ifsc}</strong></Paragraph>
              </Card>
            )}

            <Flex justifyContent="flex-end" gap="12px">
              <Button appearance="tertiary" onClick={() => setShowBranch(false)}>Cancel</Button>
              <CtaButton disabled={!selBranch} onClick={confirmBranch}>Select Branch</CtaButton>
            </Flex>
          </Flex>
        )}
      </Modal>

      {/* Nominee Modal */}
      <Modal isOpen={showNomineeModal} onClose={() => { setShowNomineeModal(false); if (!nominee) setShowNominee(false); }} title="Add Nominee">
        <Flex flexDirection="column" gap="16px">
          <InputGroup label="Relationship" inputId="nom-rel">
            {relLoading ? <Skeleton variant="rectangular" height="40px" /> : (
              <Select id="nom-rel" value={nomRelationship} onChange={setNomRelationship} options={relOptions} />
            )}
          </InputGroup>
          <InputGroup label="Full Name" inputId="nom-name">
            <TextInput id="nom-name" type="text" value={nomName} onChange={(e) => setNomName(e.target.value)} placeholder="Enter nominee's full name" />
          </InputGroup>
          <InputGroup label="Date of Birth" inputId="nom-dob">
            <TextInput id="nom-dob" type="text" placeholder="YYYY-MM-DD" value={nomDob} onChange={(e) => setNomDob(e.target.value)} />
          </InputGroup>

          {isMinor(nomDob) && (
            <>
              <Heading level={4} visualLevel="h5">Guardian Details</Heading>
              <InputGroup label="Guardian Name" inputId="guard-name">
                <TextInput id="guard-name" type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Guardian's full name" />
              </InputGroup>
              <InputGroup label="Guardian Relationship" inputId="guard-rel">
                <Select id="guard-rel" value={guardianRel} onChange={setGuardianRel} options={relOptions} />
              </InputGroup>
              <InputGroup label="Guardian Date of Birth" inputId="guard-dob">
                <TextInput id="guard-dob" type="text" placeholder="YYYY-MM-DD" value={guardianDob} onChange={(e) => setGuardianDob(e.target.value)} />
              </InputGroup>
            </>
          )}

          <Flex justifyContent="flex-end" gap="12px">
            <Button appearance="tertiary" onClick={() => { setShowNomineeModal(false); setShowNominee(false); }}>Cancel</Button>
            <CtaButton disabled={!nomRelationship || !nomName || !nomDob} onClick={saveNominee}>Save Nominee</CtaButton>
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
}
