import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import React, { useState } from 'react';
import { DatePicker } from './date-picker.js';

const CompositionWrapper = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div
    style={{
      padding: 'var(--spacing-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-medium)',
      maxWidth: '400px',
      fontFamily: 'var(--typography-font-family)',
      backgroundColor: 'var(--colors-surface-background)',
      borderRadius: 'var(--borders-radius-large)'
    }}
  >
    <h3 style={{ margin: 0, color: 'var(--colors-text-primary)', fontSize: 'var(--typography-sizes-heading-h5)' }}>{title}</h3>
    <p style={{ margin: 0, color: 'var(--colors-text-secondary)', fontSize: 'var(--typography-sizes-body-small)' }}>{description}</p>
    <div style={{ paddingTop: 'var(--spacing-medium)' }}>
        {children}
    </div>
  </div>
);

export const BasicDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <ApiBankingTheme>
        <div style={{ padding: 'var(--spacing-large)', display: 'flex', justifyContent: 'center' }}>
            <CompositionWrapper
                title="Interactive Date Picker"
                description="Allows users to select their date of birth. The calendar opens on icon click."
            >
                <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="Date of Birth (MM/DD/YYYY)"
                />
            </CompositionWrapper>
        </div>
    </ApiBankingTheme>
  );
};

export const DatePickerWithInitialValue = () => {
    // January 1, 1990
    const initialDate = new Date(1990, 0, 1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

    return (
        <ApiBankingTheme>
            <div style={{ padding: 'var(--spacing-large)', display: 'flex', justifyContent: 'center' }}>
                <CompositionWrapper
                    title="With Pre-selected Date"
                    description="Useful for forms where a user's date of birth is pre-filled and can be edited."
                >
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                </CompositionWrapper>
            </div>
        </ApiBankingTheme>
    );
};

export const DisabledDatePicker = () => {
  const disabledDate = new Date(2005, 10, 20);

  return (
    <ApiBankingTheme>
        <div style={{ padding: 'var(--spacing-large)', display: 'flex', justifyContent: 'center' }}>
            <CompositionWrapper
                title="Disabled State"
                description="The component is non-interactive, used for displaying a date in a read-only context."
            >
                <DatePicker
                    value={disabledDate}
                    onChange={() => {}} // No-op
                    disabled
                />
            </CompositionWrapper>
        </div>
    </ApiBankingTheme>
  );
};