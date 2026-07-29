import React from 'react';
import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { StitchClientProvider } from '@api-banking/stitch.stitch-client';
import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import { BranchSelector, BranchSelectorBase, type Branch, BranchesProvider, useBranches, useBranchesOptional, getCitiesForState, STATES } from './index.js';

setupTestI18n(en);

// Mock the Stitch client
const mockStitchClient = {
    getBranchStates: vi.fn().mockResolvedValue({ states: ['IN-MH', 'IN-DL'] }),
    getBranchCities: vi.fn().mockResolvedValue({ cities: ['Mumbai', 'Pune'] }),
    getBranches: vi.fn().mockResolvedValue({ branches: [] }),
    getBranchesByLocation: vi.fn().mockResolvedValue([
        { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' },
        { code: '2', name: 'Mumbai - Bandra', address: 'Linking Road, Bandra West, Mumbai 400050', ifsc: 'HDFC0000002' }
    ]),
    getBranchesByPincode: vi.fn().mockResolvedValue([
        { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' }
    ]),
    setTokenProvider: vi.fn(),
};

vi.mock('@api-banking/stitch.stitch-client', () => ({
    useStitchClientWithFallback: () => mockStitchClient,
    StitchClientProvider: ({ children }: { children: React.ReactNode }) => children,
    isTokenExpiringSoon: () => false,
}));

beforeEach(() => {
    vi.clearAllMocks();
    mockStitchClient.getBranchStates.mockResolvedValue({ states: ['IN-MH', 'IN-DL'] });
    mockStitchClient.getBranchCities.mockImplementation(({ state }: { state: string }) => {
        if (state === 'IN-MH') {
            return Promise.resolve({ cities: ['Mumbai', 'Pune'] });
        } else if (state === 'IN-DL') {
            return Promise.resolve({ cities: ['Delhi', 'New Delhi'] });
        }
        return Promise.resolve({ cities: [] });
    });
    mockStitchClient.getBranches.mockResolvedValue({
        branches: [
            { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' },
            { code: '2', name: 'Mumbai - Bandra', address: 'Linking Road, Bandra West, Mumbai 400050', ifsc: 'HDFC0000002' }
        ]
    });
});

const MOCK_BRANCHES: Branch[] = [
    { code: '1', name: 'Mumbai - Andheri West', address: 'Shop No. 5, Andheri West, Mumbai 400058', ifsc: 'HDFC0000001' },
    { code: '2', name: 'Mumbai - Bandra', address: 'Linking Road, Bandra West, Mumbai 400050', ifsc: 'HDFC0000002' },
    { code: '3', name: 'Delhi - Connaught Place', address: 'Block A, Connaught Place, New Delhi 110001', ifsc: 'HDFC0000003' },
];

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <ApiBankingTheme>
            <StitchClientProvider config={{ baseUrl: 'http://localhost:5000' }}>
                {ui}
            </StitchClientProvider>
        </ApiBankingTheme>
    );
};

describe('BranchSelector', () => {
    it('should render placeholder when no value is selected', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelector
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
            />
        );

        expect(screen.getByText('Select a branch')).toBeInTheDocument();
    });

    it('should display selected branch name', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelector
                value="1"
                onChange={onChange}
                branches={MOCK_BRANCHES}
            />
        );

        expect(screen.getByText('Mumbai - Andheri West')).toBeInTheDocument();
    });

    it('should open modal when selector is clicked', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        // Wait for states to load
        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        const selector = screen.getByRole('button');
        fireEvent.click(selector);

        expect(screen.getByRole('dialog', { name: 'Search Branch' })).toBeInTheDocument();
    });

    it('should open modal when Enter key is pressed', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        // Wait for states to load
        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        const selector = screen.getByRole('button');
        fireEvent.keyDown(selector, { key: 'Enter' });

        expect(screen.getByRole('dialog', { name: 'Search Branch' })).toBeInTheDocument();
    });

    it('should open modal when Space key is pressed', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        // Wait for states to load
        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        const selector = screen.getByRole('button');
        fireEvent.keyDown(selector, { key: ' ' });

        expect(screen.getByRole('dialog', { name: 'Search Branch' })).toBeInTheDocument();
    });

    it('should not open modal on keyboard when disabled', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelector
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                disabled
            />
        );

        const selector = screen.getByRole('button');
        fireEvent.keyDown(selector, { key: 'Enter' });

        expect(screen.queryByRole('dialog', { name: 'Select Branch' })).not.toBeInTheDocument();
    });

    it('should show mode toggle in modal with Location selected by default', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        const locationRadio = screen.getByLabelText('Location');
        const pincodeRadio = screen.getByLabelText('PinCode');

        expect(locationRadio).toBeChecked();
        expect(pincodeRadio).not.toBeChecked();
    });

    it('should show state, city, and branch dropdowns in location mode', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('State')).toBeInTheDocument();
        expect(screen.getByText('City')).toBeInTheDocument();
        // "Branch" appears twice (outer label + modal label), so check for multiple
        expect(screen.getAllByText('Branch').length).toBeGreaterThanOrEqual(1);
    });

    it('should switch to pincode mode when PinCode radio is selected', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        const pincodeRadio = screen.getByLabelText('PinCode');
        fireEvent.click(pincodeRadio);

        expect(screen.getByText('Pin-code')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter 6-digit pincode')).toBeInTheDocument();
    });

    it('should call onFilterChange when PIN code is entered', async () => {
        const onChange = vi.fn();
        const onFilterChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                    onFilterChange={onFilterChange}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        // Switch to pincode mode
        const pincodeRadio = screen.getByLabelText('PinCode');
        fireEvent.click(pincodeRadio);

        // Enter PIN code
        const pinInput = screen.getByPlaceholderText('Enter 6-digit pincode');
        fireEvent.change(pinInput, { target: { value: '400058' } });

        expect(onFilterChange).toHaveBeenCalledWith({ pin: '400058' });
    });

    it('should display branch details card when a branch is selected in modal', async () => {
        const onChange = vi.fn();
        const states = [{ value: 'IN-MH', label: 'MH' }];
        const cities = [{ value: 'Mumbai', label: 'Mumbai' }];

        renderWithTheme(
            <BranchSelectorBase
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                states={states}
                cities={cities}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        fireEvent.click(screen.getByLabelText('PinCode'));

        const pinInput = screen.getByPlaceholderText('Enter 6-digit pincode');
        fireEvent.change(pinInput, { target: { value: '400058' } });

        const branchDropdown = document.getElementById('branch-select-pincode')!;
        await act(async () => {
            fireEvent.click(branchDropdown);
        });
        const branchOption = await screen.findByRole('option', { name: 'Mumbai - Andheri West' });
        await act(async () => {
            fireEvent.click(branchOption);
        });

        expect(screen.getByText('Branch Address & IFSC Code')).toBeInTheDocument();
        expect(screen.getByText('Shop No. 5, Andheri West, Mumbai 400058')).toBeInTheDocument();
        expect(screen.getByText('HDFC0000001')).toBeInTheDocument();
    });

    it('should call onChange when branch is selected and confirmed', async () => {
        const onChange = vi.fn();
        const onFilterChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                    onFilterChange={onFilterChange}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        fireEvent.click(screen.getByLabelText('PinCode'));

        const pinInput = screen.getByPlaceholderText('Enter 6-digit pincode');
        fireEvent.change(pinInput, { target: { value: '400058' } });

        const branchDropdown = document.getElementById('branch-select-pincode')!;
        await act(async () => {
            fireEvent.click(branchDropdown);
        });

        const branchOption = await screen.findByRole('option', { name: 'Delhi - Connaught Place' });
        await act(async () => {
            fireEvent.click(branchOption);
        });

        // Click confirm
        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);

        expect(onChange).toHaveBeenCalledWith('3');
    });

    it('should disable Confirm button when no branch is selected', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        expect(confirmButton).toBeDisabled();
    });

    it('should display error text when provided', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelector
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                errorText="Please select a branch"
            />
        );

        expect(screen.getByText('Please select a branch')).toBeInTheDocument();
    });

    it('should not open modal when disabled', () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelector
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                disabled
            />
        );

        const selector = screen.getByRole('button');
        fireEvent.click(selector);

        expect(screen.queryByRole('dialog', { name: 'Select Branch' })).not.toBeInTheDocument();
    });

    it.skip('should call onFilterChange when city is selected in location mode', async () => {
        const onChange = vi.fn();
        const onFilterChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={[]}
                    onFilterChange={onFilterChange}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));

        // Select state first — wrap in act to flush async city fetch
        const stateDropdown = document.getElementById('state-select')!;
        await act(async () => {
            fireEvent.click(stateDropdown);
        });
        const mhOption = await screen.findByRole('option', { name: 'MH' });

        // Click state option and wait for async city fetch to complete
        await act(async () => {
            fireEvent.click(mhOption);
            await waitFor(() => {
                expect(mockStitchClient.getBranchCities).toHaveBeenCalledWith({ country: 'IN', state: 'IN-MH' });
            });
            // Flush microtasks so setCities from async handleStateChange is processed
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Then select city
        const cityDropdown = document.getElementById('city-select')!;
        await waitFor(() => {
            expect(cityDropdown).not.toHaveAttribute('disabled');
        });
        await act(async () => {
            fireEvent.click(cityDropdown);
        });

        const mumbaiOption = await screen.findByRole('option', { name: /Mumbai|Pune/i });
        await act(async () => {
            fireEvent.click(mumbaiOption);
        });

        // Re-select once to avoid timing flakiness with async state propagation
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            fireEvent.click(cityDropdown);
        });
        const mumbaiOptionRetry = await screen.findByRole('option', { name: /Mumbai|Pune/i });
        await act(async () => {
            fireEvent.click(mumbaiOptionRetry);
        });

        await waitFor(() => {
            expect(onFilterChange).toHaveBeenCalled();
        });

        expect(onFilterChange).toHaveBeenLastCalledWith({
            state: 'IN-MH',
            city: expect.stringMatching(/Mumbai|Pune/i)
        });
    });

    it('should close modal when clicking close icon', async () => {
        const onChange = vi.fn();

        await act(async () => {
            renderWithTheme(
                <BranchSelector
                    value=""
                    onChange={onChange}
                    branches={MOCK_BRANCHES}
                />
            );
        });

        await waitFor(() => {
            expect(mockStitchClient.getBranchStates).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        // Find and click close icon (SVG with role="img")
        const closeIcon = screen.getByRole('img', { name: /close modal/i });
        fireEvent.click(closeIcon);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});

describe('BranchSelectorBase', () => {
    const CUSTOM_STATES = [
        { value: 'GJ', label: 'Gujarat' },
        { value: 'RJ', label: 'Rajasthan' },
    ];

    const CUSTOM_CITIES = [
        { value: 'Ahmedabad', label: 'Ahmedabad' },
    ];

    it('should render with custom states', async () => {
        const onChange = vi.fn();

        renderWithTheme(
            <BranchSelectorBase
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                states={CUSTOM_STATES}
                cities={[]}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        const stateDropdown = document.getElementById('state-select')!;
        await act(async () => {
            fireEvent.click(stateDropdown);
        });

        expect(await screen.findByRole('option', { name: 'Gujarat' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Rajasthan' })).toBeInTheDocument();
    });

    it('should call onStateChange when state is selected', async () => {
        const onChange = vi.fn();
        const onStateChange = vi.fn();

        renderWithTheme(
            <BranchSelectorBase
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                states={CUSTOM_STATES}
                cities={[]}
                onStateChange={onStateChange}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        const stateDropdown = document.getElementById('state-select')!;
        await act(async () => {
            fireEvent.click(stateDropdown);
        });
        const gujaratOption = await screen.findByRole('option', { name: 'Gujarat' });
        await act(async () => {
            fireEvent.click(gujaratOption);
        });

        expect(onStateChange).toHaveBeenCalledWith('GJ');
    });

    it.skip('should call onCityChange when city is selected', async () => {
        const onChange = vi.fn();
        const onCityChange = vi.fn();

        renderWithTheme(
            <BranchSelectorBase
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                states={CUSTOM_STATES}
                cities={CUSTOM_CITIES}
                onCityChange={onCityChange}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        // Select state first
        const stateDropdown = document.getElementById('state-select')!;
        await act(async () => {
            fireEvent.click(stateDropdown);
        });
        const gujaratOption = await screen.findByRole('option', { name: 'Gujarat' });
        await act(async () => {
            fireEvent.click(gujaratOption);
        });

        // Select city
        const cityDropdown = document.getElementById('city-select')!;
        await act(async () => {
            fireEvent.click(cityDropdown);
        });
        const ahmedabadOption = await screen.findByRole('option', { name: 'Ahmedabad' });
        await act(async () => {
            fireEvent.click(ahmedabadOption);
        });

        expect(onCityChange).toHaveBeenCalledWith('Ahmedabad');
    });

    it('should call onPinCodeChange when PIN is entered', () => {
        const onChange = vi.fn();
        const onPinCodeChange = vi.fn();

        renderWithTheme(
            <BranchSelectorBase
                value=""
                onChange={onChange}
                branches={MOCK_BRANCHES}
                states={CUSTOM_STATES}
                cities={[]}
                onPinCodeChange={onPinCodeChange}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        // Switch to pincode mode
        fireEvent.click(screen.getByLabelText('PinCode'));

        // Enter PIN
        const pinInput = screen.getByPlaceholderText('Enter 6-digit pincode');
        fireEvent.change(pinInput, { target: { value: '380001' } });

        expect(onPinCodeChange).toHaveBeenCalledWith('380001');
    });
});

describe('getCitiesForState', () => {
    it('should return cities for valid state code', () => {
        const cities = getCitiesForState('IN-MH');
        expect(cities).toHaveLength(1);
        expect(cities[0].value).toBe('Mumbai');
    });

    it('should return empty array for invalid state code', () => {
        const cities = getCitiesForState('INVALID');
        expect(cities).toEqual([]);
    });

    it('should return empty array for empty string', () => {
        const cities = getCitiesForState('');
        expect(cities).toEqual([]);
    });
});

describe('STATES', () => {
    it('should contain expected states', () => {
        expect(STATES).toHaveLength(3);
        expect(STATES.map(s => s.value)).toContain('IN-MH');
        expect(STATES.map(s => s.value)).toContain('IN-DL');
        expect(STATES.map(s => s.value)).toContain('IN-KA');
    });
});

describe('BranchesProvider and useBranches', () => {
    it('should throw error when useBranches is used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useBranches());
        }).toThrow('useBranches must be used within a BranchesProvider');

        consoleSpy.mockRestore();
    });

    it('should return null when useBranchesOptional is used outside provider', () => {
        const { result } = renderHook(() => useBranchesOptional());
        expect(result.current).toBeNull();
    });

    it('should provide initial state', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StitchClientProvider config={{ baseUrl: 'http://localhost:5000' }}>
                <BranchesProvider>{children}</BranchesProvider>
            </StitchClientProvider>
        );

        const { result } = renderHook(() => useBranches(), { wrapper });

        expect(result.current.branches).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.fetchBranches).toBe('function');
    });

    it('should fetch branches successfully', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StitchClientProvider config={{ baseUrl: 'http://localhost:5000' }}>
                <BranchesProvider>{children}</BranchesProvider>
            </StitchClientProvider>
        );

        const { result } = renderHook(() => useBranches(), { wrapper });

        await act(async () => {
            await result.current.fetchBranches({ state: 'IN-MH', city: 'Mumbai' });
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.branches.length).toBeGreaterThan(0);
        expect(result.current.error).toBeNull();
    });

    it('should return context value when useBranchesOptional is used inside provider', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <StitchClientProvider config={{ baseUrl: 'http://localhost:5000' }}>
                <BranchesProvider>{children}</BranchesProvider>
            </StitchClientProvider>
        );

        const { result } = renderHook(() => useBranchesOptional(), { wrapper });

        expect(result.current).not.toBeNull();
        expect(result.current?.branches).toEqual([]);
        expect(typeof result.current?.fetchBranches).toBe('function');
    });
});
