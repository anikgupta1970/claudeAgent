import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Nomination, type NomineeData } from './nomination.js';

export const NominationUnchecked = () => {
    const [enabled, setEnabled] = useState(false);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>(null);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <Nomination
                    enabled={enabled}
                    onEnabledChange={setEnabled}
                    nomineeData={nomineeData}
                    onNomineeChange={setNomineeData}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const NominationWithData = () => {
    const [enabled, setEnabled] = useState(true);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>({
        fullName: 'John Doe',
        dateOfBirth: '15/03/1990',
        relationship: 'Spouse',
    });

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <Nomination
                    enabled={enabled}
                    onEnabledChange={setEnabled}
                    nomineeData={nomineeData}
                    onNomineeChange={setNomineeData}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const NominationDisabled = () => {
    const [enabled, setEnabled] = useState(true);
    const [nomineeData, setNomineeData] = useState<NomineeData | null>({
        fullName: 'Jane Smith',
        dateOfBirth: '22/07/1985',
        relationship: 'Partner',
    });

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <Nomination
                    enabled={enabled}
                    onEnabledChange={setEnabled}
                    nomineeData={nomineeData}
                    onNomineeChange={setNomineeData}
                    disabled
                />
            </div>
        </ApiBankingTheme>
    );
};
