import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@api-banking/design.inputs.checkbox";
import { InputGroup } from "@api-banking/design.inputs.input-group";
import { Select } from "@api-banking/design.inputs.select";
import { DatePicker } from "@api-banking/design.inputs.date-picker";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { Button } from "@api-banking/design.actions.button";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { Label } from "@api-banking/design.typography.label";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Card } from "@api-banking/design.content.card";
import { Modal } from "@api-banking/design.overlays.modal";
import styles from "./nomination.module.scss";

export type GuardianData = {
    name: string;
    dateOfBirth: string;
};

export type NomineeData = {
    fullName: string;
    dateOfBirth: string;
    relationship: string;
    guardian?: GuardianData;
};

function isMinor(dob: string): boolean {
    if (!dob) return false;
    const [day, month, year] = dob.split('/').map(Number);
    if (!day || !month || !year) return false;
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age < 18;
}

export type NominationProps = {
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    nomineeData: NomineeData | null;
    onNomineeChange: (nominee: NomineeData | null) => void;
    onFetchNominee?: () => Promise<NomineeData | null>;
    disabled?: boolean;
    className?: string;
};

const RELATIONSHIP_OPTIONS = ['Daughter', 'Partner', 'Sibling', 'Son', 'Spouse'];

export function Nomination({
    enabled,
    onEnabledChange,
    nomineeData,
    onNomineeChange,
    onFetchNominee,
    disabled = false,
    className,
}: NominationProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isFetchingNominee, setIsFetchingNominee] = useState<boolean>(false);
    const [tempNominee, setTempNominee] = useState<NomineeData>({ fullName: '', dateOfBirth: '', relationship: '' });
    const [tempGuardian, setTempGuardian] = useState<GuardianData>({ name: '', dateOfBirth: '' });
    const { t } = useTranslation();

    const openModal = useCallback(async () => {
        setTempNominee(nomineeData || { fullName: '', dateOfBirth: '', relationship: '' });
        setTempGuardian(nomineeData?.guardian || { name: '', dateOfBirth: '' });
        setIsModalOpen(true);

        if (!nomineeData && onFetchNominee) {
            setIsFetchingNominee(true);
            try {
                const fetched = await onFetchNominee();
                if (fetched) {
                    setTempNominee(fetched);
                    setTempGuardian(fetched.guardian || { name: '', dateOfBirth: '' });
                }
            } finally {
                setIsFetchingNominee(false);
            }
        }
    }, [nomineeData, onFetchNominee]);

    const closeModal = () => {
        setIsModalOpen(false);
        if (!nomineeData) {
            onEnabledChange(false);
        }
    };

    const nomineeIsMinor = isMinor(tempNominee.dateOfBirth);

    const confirmNominee = () => {
        if (tempNominee.fullName && tempNominee.relationship) {
            onNomineeChange({
                ...tempNominee,
                guardian: nomineeIsMinor ? tempGuardian : undefined,
            });
            setIsModalOpen(false);
        }
    };

    const deleteNominee = () => {
        onNomineeChange(null);
    };

    const handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        onEnabledChange(isChecked);
        if (isChecked && !nomineeData) {
            openModal();
        }
    };

    return (
        <div className={`${styles.nomineeSection} ${className || ''}`}>
            <Checkbox
                id="addNominee"
                checked={enabled}
                onChange={handleEnabledChange}
                label={t('step3.addNomineeLabel')}
                className={styles.nomineeCheckbox}
                disabled={disabled}
            />

            {enabled && nomineeData && (
                <Card variant="outlined" className={styles.nomineeCard}>
                    <div className={styles.nomineeCardContent}>
                        <div className={styles.nomineeCardRow}>
                            <div className={styles.nomineeCardField}>
                                <Label className={styles.nomineeCardLabel}>{t('nominee.fullName')}</Label>
                                <Paragraph element="span" className={styles.nomineeCardValue}>{nomineeData.fullName}</Paragraph>
                            </div>
                            <div className={styles.nomineeCardField}>
                                <Label className={styles.nomineeCardLabel}>{t('nominee.dateOfBirth')}</Label>
                                <Paragraph element="span" className={styles.nomineeCardValue}>{nomineeData.dateOfBirth || '-'}</Paragraph>
                            </div>
                        </div>
                        <div className={styles.nomineeCardField}>
                            <Label className={styles.nomineeCardLabel}>{t('nominee.relationship')}</Label>
                            <Paragraph element="span" className={styles.nomineeCardValue}>{nomineeData.relationship.toLowerCase()}</Paragraph>
                        </div>
                        {nomineeData.guardian && (
                            <div className={styles.nomineeCardRow}>
                                <div className={styles.nomineeCardField}>
                                    <Label className={styles.nomineeCardLabel}>{t('nominee.guardianDetails')}</Label>
                                    <Paragraph element="span" className={styles.nomineeCardValue}>{nomineeData.guardian.name}</Paragraph>
                                </div>
                                <div className={styles.nomineeCardField}>
                                    <Label className={styles.nomineeCardLabel}>{t('nominee.dateOfBirth')}</Label>
                                    <Paragraph element="span" className={styles.nomineeCardValue}>{nomineeData.guardian.dateOfBirth}</Paragraph>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.nomineeCardActions}>
                        <Button
                            appearance="tertiary"
                            className={styles.nomineeEditButton}
                            onClick={openModal}
                            disabled={disabled}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                        </Button>
                        <Button
                            appearance="tertiary"
                            className={styles.nomineeDeleteButton}
                            onClick={deleteNominee}
                            disabled={disabled}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </Button>
                    </div>
                </Card>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={t('nominee.addNominee')}
                className={styles.nomineeModal}
            >
                <div className={styles.modalContent}>
                    <InputGroup label={t('nominee.relationship')} inputId="nomineeRelationship">
                        <Select
                            id="nomineeRelationship"
                            value={tempNominee.relationship}
                            onChange={(value) => setTempNominee({ ...tempNominee, relationship: value })}
                            placeholder={t('nominee.selectRelationship')}
                            options={RELATIONSHIP_OPTIONS.map((option) => ({ value: option, label: option }))}
                            usePortal
                        />
                    </InputGroup>

                    <InputGroup label={t('nominee.nomineeName')} inputId="nomineeName">
                        <TextInput
                            id="nomineeName"
                            value={tempNominee.fullName}
                            onChange={(e) => setTempNominee({ ...tempNominee, fullName: e.target.value })}
                            placeholder={t('nominee.nomineeName')}
                        />
                    </InputGroup>

                    <div className={styles.formField}>
                        <Label className={styles.formLabel}>{t('nominee.dateOfBirth')}</Label>
                        <DatePicker
                            value={tempNominee.dateOfBirth ? new Date(tempNominee.dateOfBirth.split('/').reverse().join('-')) : null}
                            onChange={(date) => {
                                if (date) {
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    setTempNominee({ ...tempNominee, dateOfBirth: `${day}/${month}/${year}` });
                                } else {
                                    setTempNominee({ ...tempNominee, dateOfBirth: '' });
                                }
                            }}
                            placeholder="DD/MM/YYYY"
                            usePortal
                            disableFutureDates
                        />
                    </div>
                    {nomineeIsMinor && (
                        <div className={styles.guardianSection}>
                            <Label className={styles.guardianHeading}>{t('nominee.guardianDetails')}</Label>
                            <Paragraph className={styles.guardianNote}>{t('nominee.guardianNote')}</Paragraph>
                            <InputGroup label={t('nominee.fullName')} inputId="guardianName">
                                <TextInput
                                    id="guardianName"
                                    value={tempGuardian.name}
                                    onChange={(e) => setTempGuardian({ ...tempGuardian, name: e.target.value })}
                                    placeholder={t('nominee.fullName')}
                                />
                            </InputGroup>
                            <div className={styles.formField}>
                                <Label className={styles.formLabel}>{t('nominee.dateOfBirth')}</Label>
                                <DatePicker
                                    value={tempGuardian.dateOfBirth ? new Date(tempGuardian.dateOfBirth.split('/').reverse().join('-')) : null}
                                    onChange={(date) => {
                                        if (date) {
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const year = date.getFullYear();
                                            setTempGuardian({ ...tempGuardian, dateOfBirth: `${day}/${month}/${year}` });
                                        } else {
                                            setTempGuardian({ ...tempGuardian, dateOfBirth: '' });
                                        }
                                    }}
                                    placeholder="DD/MM/YYYY"
                                    usePortal
                                    disableFutureDates
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.modalFooter}>
                    <CtaButton
                        onClick={confirmNominee}
                        disabled={isFetchingNominee || !tempNominee.fullName || !tempNominee.relationship || (nomineeIsMinor && !tempGuardian.name)}
                    >
                        {isFetchingNominee ? t('nominee.loading', 'Loading...') : t('nominee.confirm')}
                    </CtaButton>
                </div>
            </Modal>
        </div>
    );
}
