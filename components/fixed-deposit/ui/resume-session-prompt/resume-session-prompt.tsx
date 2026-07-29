import React from 'react';
import styles from './resume-session-prompt.module.scss';

export interface ResumeSessionPromptProps {
    onResume: () => void;
    onStartFresh: () => void;
    isLoading?: boolean;
}

export function ResumeSessionPrompt({ onResume, onStartFresh, isLoading = false }: ResumeSessionPromptProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal} role="dialog" aria-labelledby="resume-title" aria-describedby="resume-description">
                <div className={styles.iconContainer}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.05 11C3.27 6.61 6.61 3.27 11 3.05M3.05 11H1M3.05 11C3.05 11.17 3.05 11.33 3.06 11.5M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12M21 12C21 7.03 16.97 3 12 3M21 12H23M12 3V1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 id="resume-title" className={styles.title}>Resume Your Application?</h2>
                <p id="resume-description" className={styles.description}>
                    We found an incomplete Fixed Deposit application. Would you like to continue where you left off?
                </p>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.resumeButton}
                        onClick={onResume}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resuming...' : 'Resume Application'}
                    </button>
                    <button
                        type="button"
                        className={styles.startFreshButton}
                        onClick={onStartFresh}
                        disabled={isLoading}
                    >
                        Start Fresh
                    </button>
                </div>
            </div>
        </div>
    );
}
