import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeSessionPrompt } from './resume-session-prompt.js';

describe('ResumeSessionPrompt', () => {
    const mockOnResume = vi.fn();
    const mockOnStartFresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the prompt with title and description', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
            />
        );

        expect(screen.getByText('Resume Your Application?')).toBeTruthy();
        expect(screen.getByText(/incomplete Fixed Deposit application/)).toBeTruthy();
    });

    it('should call onResume when Resume button is clicked', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
            />
        );

        fireEvent.click(screen.getByText('Resume Application'));
        expect(mockOnResume).toHaveBeenCalledTimes(1);
    });

    it('should call onStartFresh when Start Fresh button is clicked', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
            />
        );

        fireEvent.click(screen.getByText('Start Fresh'));
        expect(mockOnStartFresh).toHaveBeenCalledTimes(1);
    });

    it('should show loading state when isLoading is true', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
                isLoading={true}
            />
        );

        const resumeButton = screen.getByText('Resuming...');
        const startFreshButton = screen.getByText('Start Fresh');

        expect(resumeButton).toBeTruthy();
        expect((resumeButton as HTMLButtonElement).disabled).toBe(true);
        expect((startFreshButton as HTMLButtonElement).disabled).toBe(true);
    });

    it('should disable buttons when loading', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
                isLoading={true}
            />
        );

        fireEvent.click(screen.getByText('Resuming...'));
        fireEvent.click(screen.getByText('Start Fresh'));

        expect(mockOnResume).not.toHaveBeenCalled();
        expect(mockOnStartFresh).not.toHaveBeenCalled();
    });

    it('should have proper accessibility attributes', () => {
        render(
            <ResumeSessionPrompt
                onResume={mockOnResume}
                onStartFresh={mockOnStartFresh}
            />
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog.getAttribute('aria-labelledby')).toBe('resume-title');
        expect(dialog.getAttribute('aria-describedby')).toBe('resume-description');
    });
});
