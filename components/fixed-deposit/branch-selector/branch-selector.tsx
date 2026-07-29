import React, { useState, useCallback, useEffect } from "react";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { BranchSelectorBase } from "./branch-selector-base.js";

// Re-export types from base for convenience
export type { Branch, BranchFilterParams, SelectionMode } from "./branch-selector-base.js";

export type BranchSelectorProps = {
    /** Currently selected branch code */
    value: string;
    /** Callback when branch selection changes */
    onChange: (branchCode: string) => void;
    /** List of available branches to select from */
    branches: Array<{
        code: string;
        name: string;
        address: string;
        ifsc?: string;
    }>;
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
    /** Callback when filter parameters change (state/city or PIN) */
    onFilterChange?: (filters: { city?: string; pin?: string; state?: string }) => void;
};

/**
 * Smart branch selector component that fetches states/cities from API.
 * Handles the cascading dropdown logic internally.
 *
 * For full control over data fetching, use `BranchSelectorBase` instead.
 */
export function BranchSelector({
    value,
    onChange,
    branches,
    label,
    helperText,
    errorText,
    disabled,
    className,
    isLoading,
    onFilterChange,
}: BranchSelectorProps) {
    const stitchClient = useStitchClientWithFallback();

    const [states, setStates] = useState<Array<{ value: string; label: string }>>([]);
    const [cities, setCities] = useState<Array<{ value: string; label: string }>>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    // Fetch states on mount
    useEffect(() => {
        const fetchStates = async () => {
            setIsLoadingStates(true);
            try {
                const response = await stitchClient.getBranchStates({ country: 'IN' });
                if (response.states) {
                    // Convert state codes to options (e.g., "IN-MH" -> { value: "IN-MH", label: "MH" })
                    const stateOptions = response.states.map((code: string) => ({
                        value: code,
                        label: code.replace('IN-', ''), // Remove "IN-" prefix for display
                    }));
                    setStates(stateOptions);
                }
            } catch (error) {
                console.error('Failed to fetch branch states:', error);
            } finally {
                setIsLoadingStates(false);
            }
        };

        fetchStates();
    }, [stitchClient]);

    // Fetch cities when state changes
    const handleStateChange = useCallback(async (stateCode: string) => {
        setSelectedState(stateCode);
        setCities([]);

        if (!stateCode) return;

        setIsLoadingCities(true);
        try {
            const response = await stitchClient.getBranchCities({ country: 'IN', state: stateCode });
            if (response.cities) {
                // Convert city names to options
                const cityOptions = response.cities.map((city: string) => ({
                    value: city,
                    label: city,
                }));
                setCities(cityOptions);
            }
        } catch (error) {
            console.error('Failed to fetch branch cities:', error);
        } finally {
            setIsLoadingCities(false);
        }
    }, [stitchClient]);

    const handleCityChange = useCallback((city: string) => {
        onFilterChange?.({ state: selectedState, city });
    }, [selectedState, onFilterChange]);

    const handlePinCodeChange = useCallback((pin: string) => {
        onFilterChange?.({ pin });
    }, [onFilterChange]);

    return (
        <BranchSelectorBase
            value={value}
            onChange={onChange}
            branches={branches}
            states={states}
            cities={cities}
            label={label}
            helperText={helperText}
            errorText={errorText}
            disabled={disabled || isLoadingStates}
            className={className}
            isLoading={isLoading || isLoadingCities}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            onPinCodeChange={handlePinCodeChange}
        />
    );
}
