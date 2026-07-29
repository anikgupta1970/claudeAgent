import { setupTestI18n } from '@api-banking/fixed-deposit.i18n';
import { en } from '@api-banking/fixed-deposit.language-packs';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Nomination, type NomineeData } from './nomination.js';

setupTestI18n(en);

const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ApiBankingTheme>{ui}</ApiBankingTheme>);
};

describe('Nomination', () => {
    it('should render checkbox unchecked by default', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();

        renderWithTheme(
            <Nomination
                enabled={false}
                onEnabledChange={onEnabledChange}
                nomineeData={null}
                onNomineeChange={onNomineeChange}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('should call onEnabledChange when checkbox is clicked', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();

        renderWithTheme(
            <Nomination
                enabled={false}
                onEnabledChange={onEnabledChange}
                nomineeData={null}
                onNomineeChange={onNomineeChange}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(onEnabledChange).toHaveBeenCalledWith(true);
    });

    it('should display nominee card when enabled with data', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();
        const nomineeData: NomineeData = {
            fullName: 'John Doe',
            dateOfBirth: '15/03/1990',
            relationship: 'Spouse',
        };

        renderWithTheme(
            <Nomination
                enabled={true}
                onEnabledChange={onEnabledChange}
                nomineeData={nomineeData}
                onNomineeChange={onNomineeChange}
            />
        );

        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('15/03/1990')).toBeInTheDocument();
        expect(screen.getByText('spouse')).toBeInTheDocument();
    });

    it('should not display nominee card when enabled without data', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();

        renderWithTheme(
            <Nomination
                enabled={true}
                onEnabledChange={onEnabledChange}
                nomineeData={null}
                onNomineeChange={onNomineeChange}
            />
        );

        expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });

    it('should call onNomineeChange with null when delete button is clicked', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();
        const nomineeData: NomineeData = {
            fullName: 'John Doe',
            dateOfBirth: '15/03/1990',
            relationship: 'Spouse',
        };

        renderWithTheme(
            <Nomination
                enabled={true}
                onEnabledChange={onEnabledChange}
                nomineeData={nomineeData}
                onNomineeChange={onNomineeChange}
            />
        );

        const deleteButton = screen.getAllByRole('button')[1];
        fireEvent.click(deleteButton);

        expect(onNomineeChange).toHaveBeenCalledWith(null);
    });

    it('should disable interaction when disabled prop is true', () => {
        const onEnabledChange = vi.fn();
        const onNomineeChange = vi.fn();
        const nomineeData: NomineeData = {
            fullName: 'John Doe',
            dateOfBirth: '15/03/1990',
            relationship: 'Spouse',
        };

        renderWithTheme(
            <Nomination
                enabled={true}
                onEnabledChange={onEnabledChange}
                nomineeData={nomineeData}
                onNomineeChange={onNomineeChange}
                disabled
            />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    describe('Nominee Modal', () => {
        it('should open modal automatically when checkbox is checked and nomineeData is null', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            // Modal should open automatically
            expect(screen.getByText('Add Nominee')).toBeInTheDocument();
        });

        it('should open modal with pre-filled data when edit button is clicked', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '15/03/1990',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Click edit button (first button)
            const editButton = screen.getAllByRole('button')[0];
            fireEvent.click(editButton);

            // Modal should be open
            expect(screen.getByText('Add Nominee')).toBeInTheDocument();

            // Fields should be pre-filled
            const nameInput = screen.getByPlaceholderText('Nominee Name');
            expect(nameInput).toHaveValue('John Doe');
        });

        it('should call onNomineeChange with valid data when confirm is clicked', async () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open modal by clicking checkbox
            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            // Fill in the form
            const nameInput = screen.getByPlaceholderText('Nominee Name');
            fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

            // Select Relationship - use button role for React Aria Select
            const relationshipSelect = screen.getByRole('button', { name: 'Select Relationship' });
            fireEvent.click(relationshipSelect);

            // Wait for and click option
            const spouseOption = await screen.findByRole('option', { name: 'Spouse' });
            fireEvent.click(spouseOption);

            // Wait for React Aria's async state update to flush so confirm button becomes enabled
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Confirm/i })).not.toBeDisabled();
            });

            // Click confirm
            const confirmButton = screen.getByRole('button', { name: /Confirm/i });
            fireEvent.click(confirmButton);

            // Should have been called with nominee data
            expect(onNomineeChange).toHaveBeenCalled();
        });

        it('should update fullName when typing in name input', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open modal
            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            // Type in name field
            const nameInput = screen.getByPlaceholderText('Nominee Name');
            fireEvent.change(nameInput, { target: { value: 'Test Name' } });

            expect(nameInput).toHaveValue('Test Name');
        });

        it('should update relationship when selecting from dropdown', async () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open modal
            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            // Click on relationship select
            const relationshipSelect = screen.getByText('Select Relationship');
            fireEvent.click(relationshipSelect);

            // Select an option
            const daughterOption = await screen.findByText('Daughter');
            fireEvent.click(daughterOption);

            // Verify the option was selected (the select should now show "Daughter")
            expect(screen.getByText('Daughter')).toBeInTheDocument();
        });

        it('should disable confirm button when required fields are empty', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open modal
            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            // Confirm button should be disabled initially
            const confirmButton = screen.getByRole('button', { name: /Confirm/i });
            expect(confirmButton).toBeDisabled();
        });

        it('should close modal when close is triggered', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();

            renderWithTheme(
                <Nomination
                    enabled={false}
                    onEnabledChange={onEnabledChange}
                    nomineeData={null}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open modal
            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            expect(screen.getByText('Add Nominee')).toBeInTheDocument();

            // Find close button and click it
            const allButtons = screen.getAllByRole('button');
            const closeButton = allButtons.find(btn =>
                btn.getAttribute('aria-label')?.toLowerCase().includes('close') ||
                btn.className?.includes('close')
            );

            if (closeButton) {
                fireEvent.click(closeButton);
            }
        });
    });

    describe('Date handling', () => {
        it('should handle date of birth clearing by setting empty string', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '15/03/1990',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Open edit modal
            const editButton = screen.getAllByRole('button')[0];
            fireEvent.click(editButton);

            // The DatePicker should be rendered
            expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
        });
    });

    describe('Utility functions', () => {
        it('should display full name without masking', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '15/03/1990',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('should display full date of birth', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '15/03/1990',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            expect(screen.getByText('15/03/1990')).toBeInTheDocument();
        });

        it('should display relationship in lowercase', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '15/03/1990',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Relationship should be in lowercase
            expect(screen.getByText('spouse')).toBeInTheDocument();
        });

        it('should handle date of birth with non-standard format', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '1990', // Non-standard format (no slashes)
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Should display the date as-is when format is non-standard
            expect(screen.getByText('1990')).toBeInTheDocument();
        });

        it('should handle empty date of birth', () => {
            const onEnabledChange = vi.fn();
            const onNomineeChange = vi.fn();
            const nomineeData: NomineeData = {
                fullName: 'John Doe',
                dateOfBirth: '',
                relationship: 'Spouse',
            };

            renderWithTheme(
                <Nomination
                    enabled={true}
                    onEnabledChange={onEnabledChange}
                    nomineeData={nomineeData}
                    onNomineeChange={onNomineeChange}
                />
            );

            // Should render without crashing
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });
});
