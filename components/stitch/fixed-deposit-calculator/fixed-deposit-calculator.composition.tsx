import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { TextInput } from '@api-banking/design.inputs.text-input';
import {
  FixedDepositCalculator,
  FixedDepositCalculatorBase,
  type FDCalculatorInput,
  type FDCalculationResult,
} from './index.js';

const defaultInput: FDCalculatorInput = {
  amount: '10000',
  tenureYears: '1',
  tenureMonths: '0',
  tenureDays: '0',
  interestPayout: 'monthly',
  fdType: 'withdrawable',
};

// ===========================================
// SMART COMPONENT (FixedDepositCalculator)
// Uses built-in API client for calculations
// ===========================================

export const SmartCalculator = () => {
  const [amount, setAmount] = useState(defaultInput.amount);

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="smart-calculator-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculator
          input={{ ...defaultInput, amount }}
          customerId="CUST001"
          productVariant="STANDARD_FD"
          maturityInstruction={{
            option: 'renew',
            payoutAccountId: 'ACC001',
            managersCheque: false,
          }}
          onCalculationComplete={(result) => {
            console.log('Calculation complete:', result);
          }}
          onCalculationError={(error) => {
            console.error('Calculation error:', error);
          }}
        />
      </div>
    </ApiBankingTheme>
  );
};

export const SmartCalculatorDisabled = () => {
  const [amount, setAmount] = useState(defaultInput.amount);

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="smart-calculator-disabled-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          disabled
        />
        <FixedDepositCalculator
          input={{ ...defaultInput, amount }}
          customerId="CUST001"
          productVariant="STANDARD_FD"
          maturityInstruction={{
            option: 'renew',
            payoutAccountId: 'ACC001',
            managersCheque: false,
          }}
          disabled
        />
      </div>
    </ApiBankingTheme>
  );
};

// ===========================================
// PRESENTATIONAL COMPONENT (FixedDepositCalculatorBase)
// Full control over calculation logic and state
// ===========================================

export const CalculatorReady = () => {
  const [amount, setAmount] = useState(defaultInput.amount);
  const [result, setResult] = useState<FDCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResult({
      principal: 10000,
      interestRate: 6.5,
      interestEarned: 650,
      maturityAmount: 10650,
      maturityDate: '2027-01-22',
    });
    setIsCalculating(false);
  };

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-ready-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculatorBase
          input={{ ...defaultInput, amount }}
          onCalculate={handleCalculate}
          result={result}
          error={error}
          isCalculating={isCalculating}
        />
      </div>
    </ApiBankingTheme>
  );
};

export const CalculatorWithResult = () => {
  const [amount, setAmount] = useState(defaultInput.amount);
  const result: FDCalculationResult = {
    principal: 50000,
    interestRate: 7.25,
    interestEarned: 3625,
    maturityAmount: 53625,
    maturityDate: '2027-01-22',
   
    
  };

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-with-result-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculatorBase
          input={{ ...defaultInput, amount }}
          onCalculate={() => {}}
          result={result}
        />
      </div>
    </ApiBankingTheme>
  );
};

export const CalculatorWithError = () => {
  const [amount, setAmount] = useState(defaultInput.amount);

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-with-error-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculatorBase
          input={{ ...defaultInput, amount }}
          onCalculate={() => {}}
          error="Unable to calculate FD details. Please check your inputs and try again."
        />
      </div>
    </ApiBankingTheme>
  );
};

export const CalculatorCalculating = () => {
  const [amount, setAmount] = useState(defaultInput.amount);

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-calculating-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculatorBase
          input={{ ...defaultInput, amount }}
          onCalculate={() => {}}
          isCalculating
        />
      </div>
    </ApiBankingTheme>
  );
};

export const CalculatorDisabled = () => {
  const [amount, setAmount] = useState(defaultInput.amount);

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-disabled-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          disabled
        />
        <FixedDepositCalculatorBase
          input={{ ...defaultInput, amount }}
          onCalculate={() => {}}
          disabled
        />
      </div>
    </ApiBankingTheme>
  );
};

export const CalculatorMissingInput = () => {
  const [amount, setAmount] = useState('');

  const incompleteInput: FDCalculatorInput = {
    amount,
    tenureYears: '0',
    tenureMonths: '0',
    tenureDays: '0',
    interestPayout: 'monthly',
    fdType: 'withdrawable',
  };

  return (
    <ApiBankingTheme>
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <TextInput
          id="calculator-missing-input-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <FixedDepositCalculatorBase
          input={incompleteInput}
          onCalculate={() => {}}
        />
      </div>
    </ApiBankingTheme>
  );
};
