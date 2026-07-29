import React, { useState, useCallback } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { BranchSelector, BranchSelectorBase, type Branch, type BranchFilterParams } from './index.js';

// Mock branches matching the mock server data structure
const BRANCHES_BY_CITY: Record<string, Branch[]> = {
    'Mumbai': [
        { code: '101', name: 'Andheri West', address: 'Shop No. 5, Ground Floor, Andheri West, Mumbai, Maharashtra', ifsc: 'HDFC0000101' },
        { code: '102', name: 'Lower Parel', address: '1st Floor, Phoenix Mall, Lower Parel, Mumbai, Maharashtra', ifsc: 'HDFC0000102' },
        { code: '103', name: 'BKC', address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra', ifsc: 'HDFC0000103' },
        { code: '104', name: 'Nariman Point', address: 'Nariman Point, Mumbai, Maharashtra', ifsc: 'HDFC0000104' },
    ],
    'Delhi': [
        { code: '3', name: 'K G Marg', address: '209 - 214, Kailash Building, 26, Kasturba Gandhi Marg, New Delhi, Delhi', ifsc: 'HDFC0000003' },
        { code: '4', name: 'Connaught Place', address: 'Ground Floor, Connaught Place, New Delhi, Delhi', ifsc: 'HDFC0000004' },
    ],
    'Bangalore': [
        { code: '201', name: 'MG Road', address: 'MG Road, Bangalore, Karnataka', ifsc: 'HDFC0000201' },
        { code: '202', name: 'Koramangala', address: 'Koramangala 5th Block, Bangalore, Karnataka', ifsc: 'HDFC0000202' },
    ],
};

const BRANCHES_BY_PIN: Record<string, Branch[]> = {
    '400021': [
        { code: '104', name: 'Nariman Point', address: 'Nariman Point, Mumbai, Maharashtra', ifsc: 'HDFC0000104' },
    ],
    '400058': [
        { code: '101', name: 'Andheri West', address: 'Shop No. 5, Ground Floor, Andheri West, Mumbai, Maharashtra', ifsc: 'HDFC0000101' },
    ],
    '400013': [
        { code: '102', name: 'Lower Parel', address: '1st Floor, Phoenix Mall, Lower Parel, Mumbai, Maharashtra', ifsc: 'HDFC0000102' },
    ],
    '110001': [
        { code: '3', name: 'K G Marg', address: '209 - 214, Kailash Building, 26, Kasturba Gandhi Marg, New Delhi, Delhi', ifsc: 'HDFC0000003' },
        { code: '4', name: 'Connaught Place', address: 'Ground Floor, Connaught Place, New Delhi, Delhi', ifsc: 'HDFC0000004' },
    ],
    '560001': [
        { code: '201', name: 'MG Road', address: 'MG Road, Bangalore, Karnataka', ifsc: 'HDFC0000201' },
    ],
    '560095': [
        { code: '202', name: 'Koramangala', address: 'Koramangala 5th Block, Bangalore, Karnataka', ifsc: 'HDFC0000202' },
    ],
};

// ===========================================
// SMART COMPONENT (BranchSelector)
// Uses built-in state/city data from location-data.ts
// ===========================================

export const BranchSelectorDefault = () => {
    const [value, setValue] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = useCallback((filters: BranchFilterParams) => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            if (filters.city) {
                setBranches(BRANCHES_BY_CITY[filters.city] || []);
            } else if (filters.pin) {
                setBranches(BRANCHES_BY_PIN[filters.pin] || []);
            } else {
                setBranches([]);
            }
            setIsLoading(false);
        }, 300);
    }, []);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <BranchSelector
                    value={value}
                    onChange={setValue}
                    branches={branches}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />
                {value && (
                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                        Selected branch code: {value}
                    </p>
                )}
            </div>
        </ApiBankingTheme>
    );
};

export const BranchSelectorWithPreselectedValue = () => {
    const [value, setValue] = useState('104');
    const [branches, setBranches] = useState<Branch[]>(BRANCHES_BY_CITY.Mumbai);

    const handleFilterChange = useCallback((filters: BranchFilterParams) => {
        if (filters.city) {
            setBranches(BRANCHES_BY_CITY[filters.city] || []);
        } else if (filters.pin) {
            setBranches(BRANCHES_BY_PIN[filters.pin] || []);
        }
    }, []);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <BranchSelector
                    value={value}
                    onChange={setValue}
                    branches={branches}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </ApiBankingTheme>
    );
};

export const BranchSelectorWithError = () => {
    const [value, setValue] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);

    const handleFilterChange = useCallback((filters: BranchFilterParams) => {
        if (filters.city) {
            setBranches(BRANCHES_BY_CITY[filters.city] || []);
        } else if (filters.pin) {
            setBranches(BRANCHES_BY_PIN[filters.pin] || []);
        }
    }, []);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <BranchSelector
                    value={value}
                    onChange={setValue}
                    branches={branches}
                    onFilterChange={handleFilterChange}
                    errorText="Please select a branch"
                />
            </div>
        </ApiBankingTheme>
    );
};

export const BranchSelectorDisabled = () => {
    const branches = BRANCHES_BY_CITY.Mumbai;

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <BranchSelector
                    value="104"
                    onChange={() => {}}
                    branches={branches}
                    disabled
                />
            </div>
        </ApiBankingTheme>
    );
};

export const BranchSelectorLoading = () => {
    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <BranchSelector
                    value=""
                    onChange={() => {}}
                    branches={[]}
                    isLoading={true}
                />
            </div>
        </ApiBankingTheme>
    );
};

// ===========================================
// PRESENTATIONAL COMPONENT (BranchSelectorBase)
// Full control over states, cities, and data fetching
// ===========================================

// Custom states/cities for the base component demo
const CUSTOM_STATES = [
    { value: 'GJ', label: 'Gujarat' },
    { value: 'RJ', label: 'Rajasthan' },
];

const CUSTOM_CITIES: Record<string, Array<{ value: string; label: string }>> = {
    'GJ': [
        { value: 'Ahmedabad', label: 'Ahmedabad' },
        { value: 'Surat', label: 'Surat' },
    ],
    'RJ': [
        { value: 'Jaipur', label: 'Jaipur' },
        { value: 'Udaipur', label: 'Udaipur' },
    ],
};

const CUSTOM_BRANCHES: Record<string, Branch[]> = {
    'Ahmedabad': [
        { code: 'AHM001', name: 'CG Road', address: 'CG Road, Ahmedabad, Gujarat', ifsc: 'HDFC0000301' },
        { code: 'AHM002', name: 'SG Highway', address: 'SG Highway, Ahmedabad, Gujarat', ifsc: 'HDFC0000302' },
    ],
    'Surat': [
        { code: 'SUR001', name: 'Ring Road', address: 'Ring Road, Surat, Gujarat', ifsc: 'HDFC0000303' },
    ],
    'Jaipur': [
        { code: 'JAI001', name: 'MI Road', address: 'MI Road, Jaipur, Rajasthan', ifsc: 'HDFC0000401' },
    ],
    'Udaipur': [
        { code: 'UDA001', name: 'City Palace Road', address: 'City Palace Road, Udaipur, Rajasthan', ifsc: 'HDFC0000402' },
    ],
};

export const BranchSelectorBaseWithCustomData = () => {
    const [value, setValue] = useState('');
    const [cities, setCities] = useState<Array<{ value: string; label: string }>>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleStateChange = useCallback((stateCode: string) => {
        setCities(CUSTOM_CITIES[stateCode] || []);
        setBranches([]);
    }, []);

    const handleCityChange = useCallback((city: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setBranches(CUSTOM_BRANCHES[city] || []);
            setIsLoading(false);
        }, 200);
    }, []);

    const handlePinCodeChange = useCallback((pin: string) => {
        setIsLoading(true);
        setTimeout(() => {
            // For demo, just show empty
            setBranches([]);
            setIsLoading(false);
        }, 200);
    }, []);

    return (
        <ApiBankingTheme>
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <h4 style={{ marginBottom: '16px' }}>Custom States: Gujarat & Rajasthan</h4>
                <BranchSelectorBase
                    value={value}
                    onChange={setValue}
                    branches={branches}
                    states={CUSTOM_STATES}
                    cities={cities}
                    onStateChange={handleStateChange}
                    onCityChange={handleCityChange}
                    onPinCodeChange={handlePinCodeChange}
                    isLoading={isLoading}
                />
                {value && (
                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                        Selected branch code: {value}
                    </p>
                )}
            </div>
        </ApiBankingTheme>
    );
};
