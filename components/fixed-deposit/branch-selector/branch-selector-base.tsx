import React, { useState, useCallback } from "react";
import { Select, type SelectOption } from "@api-banking/design.inputs.select";
import { RadioButton } from "@api-banking/design.inputs.radio-button";
import { TextInput } from "@api-banking/design.inputs.text-input";
import { Card } from "@api-banking/design.content.card";
import { CtaButton } from "@api-banking/design.actions.cta-button";
import { InputGroup } from "@api-banking/design.inputs.input-group";
import { Paragraph } from "@api-banking/design.typography.paragraph";
import { Heading } from "@api-banking/design.typography.heading";
import { Modal } from "@api-banking/design.overlays.modal";
import styles from "./branch-selector.module.scss";

export type Branch = {
    code: string;
    name: string;
    address: string;
    ifsc?: string;
};

export type BranchFilterParams = {
    city?: string;
    pin?: string;
    state?: string;
};

export type SelectionMode = 'location' | 'pincode';

export type BranchSelectorBaseProps = {
    /** Currently selected branch code */
    value: string;
    /** Callback when branch selection changes */
    onChange: (branchCode: string) => void;
    /** List of available branches to select from */
    branches: Branch[];
    /** List of available states */
    states: SelectOption[];
    /** List of available cities for the selected state */
    cities: SelectOption[];
    /** Label for the field */
    label?: string;
    /** Helper text shown below the field */
    helperText?: string;
    /** Error text (replaces helper text when present) */
    errorText?: string;
    /** Whether the selector is disabled */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Whether branches are currently loading */
    isLoading?: boolean;
    /** Callback when state selection changes */
    onStateChange?: (stateCode: string) => void;
    /** Callback when city selection changes */
    onCityChange?: (city: string) => void;
    /** Callback when PIN code changes */
    onPinCodeChange?: (pin: string) => void;
};

/**
 * Presentational component for branch selection.
 * Use this when you want full control over data fetching and state management.
 * For a ready-to-use version with built-in data handling, use `BranchSelector` instead.
 */
export function BranchSelectorBase({
    value,
    onChange,
    branches,
    states,
    cities,
    label = "Branch",
    helperText = "FD will be booked at this branch",
    errorText,
    disabled = false,
    className,
    isLoading = false,
    onStateChange,
    onCityChange,
    onPinCodeChange,
}: BranchSelectorBaseProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('location');
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [pinCode, setPinCode] = useState<string>('');
    const [tempSelectedBranch, setTempSelectedBranch] = useState<string>('');

    const selectedBranchData = branches.find(b => b.code === value);
    const tempSelectedBranchData = branches.find(b => b.code === tempSelectedBranch);

    const branchOptions = branches.map(branch => ({
        value: branch.code,
        label: branch.name,
    }));

    const openModal = () => {
        if (disabled) return;
        setTempSelectedBranch(value);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const confirmSelection = () => {
        onChange(tempSelectedBranch);
        closeModal();
    };

    const handleModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const mode = e.target.value as SelectionMode;
        setSelectionMode(mode);
        // Reset selections when switching modes
        setSelectedState('');
        setSelectedCity('');
        setPinCode('');
        setTempSelectedBranch('');
    }, []);

    const handleStateChange = useCallback((stateCode: string) => {
        setSelectedState(stateCode);
        setSelectedCity('');
        setTempSelectedBranch('');
        onStateChange?.(stateCode);
    }, [onStateChange]);

    const handleCityChange = useCallback((city: string) => {
        setSelectedCity(city);
        setTempSelectedBranch('');
        onCityChange?.(city);
    }, [onCityChange]);

    const handlePinCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const pin = e.target.value;
        setPinCode(pin);
        setTempSelectedBranch('');
        if (pin.length >= 6) {
            onPinCodeChange?.(pin);
        }
    }, [onPinCodeChange]);

    const handleBranchChange = useCallback((branchCode: string) => {
        setTempSelectedBranch(branchCode);
    }, []);

    return (
        <div className={className}>
            <InputGroup
                label={label}
                className={styles.branchSection}
                errorText={errorText}
                helpText={!errorText ? helperText : undefined}
            >
                <div
                    className={`${styles.branchSelector} ${value ? styles.hasValue : ''} ${errorText ? styles.inputError : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={openModal}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                            openModal();
                        }
                    }}
                    aria-label={label}
                    aria-disabled={disabled}
                >
                    {selectedBranchData ? (
                        <Paragraph element="span" className={styles.branchValue}>{selectedBranchData.name}</Paragraph>
                    ) : (
                        <Paragraph element="span" variant="muted" className={styles.branchPlaceholder}>Select a branch</Paragraph>
                    )}
                    <span className={styles.branchSearchIcon}>🔍</span>
                </div>
            </InputGroup>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Search Branch"
                className={styles.branchModal}
            >
                <div className={styles.modalContent}>
                    {/* Selection Mode Toggle */}
                    <div className={styles.modeToggle}>
                        <RadioButton
                            id="mode-location"
                            name="selectionMode"
                            value="location"
                            label="Location"
                            checked={selectionMode === 'location'}
                            onChange={handleModeChange}
                        />
                        <RadioButton
                            id="mode-pincode"
                            name="selectionMode"
                            value="pincode"
                            label="PinCode"
                            checked={selectionMode === 'pincode'}
                            onChange={handleModeChange}
                        />
                    </div>

                    {/* Location Mode */}
                    {selectionMode === 'location' && (
                        <div className={styles.locationFields}>
                            <InputGroup label="State">
                                <Select
                                    id="state-select"
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    options={states}
                                    placeholder="Select state"
                                    usePortal
                                />
                            </InputGroup>

                            <InputGroup label="City">
                                <Select
                                    id="city-select"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    options={cities}
                                    placeholder="Select city"
                                    disabled={!selectedState}
                                    usePortal
                                />
                            </InputGroup>

                            <InputGroup label="Branch">
                                <Select
                                    id="branch-select"
                                    value={tempSelectedBranch}
                                    onChange={handleBranchChange}
                                    options={branchOptions}
                                    placeholder={isLoading ? "Loading branches..." : "Select branch"}
                                    disabled={!selectedCity || isLoading}
                                    usePortal
                                />
                            </InputGroup>
                        </div>
                    )}

                    {/* PinCode Mode */}
                    {selectionMode === 'pincode' && (
                        <div className={styles.pincodeFields}>
                            <InputGroup label="PIN Code">
                                <TextInput
                                    id="pincode-input"
                                    value={pinCode}
                                    onChange={handlePinCodeChange}
                                    placeholder="Enter 6-digit PIN code"
                                />
                            <Paragraph variant="muted" className={styles.helpText}>For testing purposes, Enter Pincode: 400058</Paragraph>
                            </InputGroup>

                            <InputGroup label="Branch">
                                <Select
                                    id="branch-select-pincode"
                                    value={tempSelectedBranch}
                                    onChange={handleBranchChange}
                                    options={branchOptions}
                                    placeholder={isLoading ? "Loading branches..." : "Select branch"}
                                    disabled={pinCode.length < 6 || isLoading}
                                    usePortal
                                />
                            </InputGroup>
                        </div>
                    )}

                    {/* Branch Details Card */}
                    {tempSelectedBranchData && (
                        <Card variant="outlined" className={styles.branchDetailsCard}>
                            <Heading level={6} className={styles.cardTitle}>
                                Branch Address & IFSC Code
                            </Heading>
                            <Paragraph className={styles.branchAddress}>
                                {tempSelectedBranchData.address}
                            </Paragraph>
                            <Paragraph className={styles.ifscCode}>
                                IFSC Code - <span className={styles.ifscValue}>{tempSelectedBranchData.ifsc}</span>
                            </Paragraph>
                        </Card>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <CtaButton
                        onClick={confirmSelection}
                        disabled={!tempSelectedBranch}
                    >
                        Confirm
                    </CtaButton>
                </div>
            </Modal>
        </div>
    );
}
