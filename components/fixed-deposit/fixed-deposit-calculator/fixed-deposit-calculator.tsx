import React, { useState, useCallback } from "react";
import { useStitchClientWithFallback } from "@api-banking/stitch.stitch-client";
import { useJourneyContext } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { FixedDepositCalculatorBase, type FDCalculatorInput, type FDCalculationResult } from "./fixed-deposit-calculator-base.js";

// Type for the legacy FD calculator response (from mock server)
type LegacyFDCalculatorResponse = {
    maturityAmount?: { amount: number; currency: string };
    roi?: number;
    interestEarned?: { amount: number; currency: string };
    maturityDate?: string;
    startDate?: string;
};

// Re-export types from base for convenience
export type { FDCalculatorInput, FDCalculationResult } from "./fixed-deposit-calculator-base.js";

export type FixedDepositCalculatorProps = {
    /** Input values for FD calculation */
    input: FDCalculatorInput;
    /** Customer ID for the FD calculation */
    customerId?: string;
    /** Product variant identifier */
    productVariant?: string;
    /** Maturity instruction details */
    maturityInstruction?: {
        option: string;
        renewalOption?: string;
        payoutAccountId: string;
        managersCheque: boolean;
    };
    /** Callback invoked after successful calculation */
    onCalculationComplete?: (result: FDCalculationResult) => void;
    /** Callback invoked on calculation error */
    onCalculationError?: (error: string) => void;
    /** Whether the calculator is disabled */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
};

/**
 * Smart FD calculator component with built-in API integration.
 * Handles calculation state and API calls internally.
 *
 * For full control over calculation logic and state, use `FixedDepositCalculatorBase` instead.
 */
export function FixedDepositCalculator({
    input,
    customerId: customerIdProp,
    productVariant = 'regular',
    maturityInstruction,
    onCalculationComplete,
    onCalculationError,
    disabled = false,
    className,
}: FixedDepositCalculatorProps) {
    const [result, setResult] = useState<FDCalculationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const stitchClient = useStitchClientWithFallback();
    const { customerId: contextCustomerId, accessToken } = useJourneyContext();

    // Use prop customerId if provided, otherwise fallback to context
    const customerId = customerIdProp || contextCustomerId;

    const handleCalculate = useCallback(async () => {
        setIsCalculating(true);
        setError(null);
        setResult(null);

        try {
            const response = await stitchClient.calculateFDLegacy(
                {
                    amount: input.amount,
                    tenureYears: input.tenureYears,
                    tenureMonths: input.tenureMonths,
                    tenureDays: input.tenureDays,
                    interestPayout: input.interestPayout,
                    fdType: input.fdType,
                },
                customerId || undefined,
                productVariant,
                maturityInstruction,
                accessToken || undefined
            );

            if (response && typeof response === 'object' && 'errors' in response && Array.isArray((response as { errors?: unknown[] }).errors)) {
                const {errors} = (response as { errors: Array<{ message?: string }> });
                const errorMessage = errors?.[0]?.message || 'Failed to calculate FD details';
                setError(errorMessage);
                onCalculationError?.(errorMessage);
                return;
            }

            const fdResponse = response as LegacyFDCalculatorResponse;
            const calculationResult: FDCalculationResult = {
                principal: parseFloat(input.amount),
                interestRate: fdResponse.roi || 0,
                interestEarned: fdResponse.interestEarned?.amount ? parseFloat(String(fdResponse.interestEarned.amount)) : 0,
                maturityAmount: fdResponse.maturityAmount?.amount ? parseFloat(String(fdResponse.maturityAmount.amount)) : parseFloat(input.amount),
                maturityDate: fdResponse.maturityDate || '',
            };

            setResult(calculationResult);
            onCalculationComplete?.(calculationResult);
        } catch {
            const errorMessage = 'Unable to connect to server. Please try again.';
            setError(errorMessage);
            onCalculationError?.(errorMessage);
        } finally {
            setIsCalculating(false);
        }
    }, [input, stitchClient, customerId, productVariant, maturityInstruction, accessToken, onCalculationComplete, onCalculationError]);

    return (
        <FixedDepositCalculatorBase
            input={input}
            onCalculate={handleCalculate}
            result={result}
            error={error}
            isCalculating={isCalculating}
            disabled={disabled}
            className={className}
        />
    );
}
