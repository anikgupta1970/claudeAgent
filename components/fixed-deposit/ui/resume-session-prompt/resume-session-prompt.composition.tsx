import * as React from 'react';
import { ResumeSessionPrompt } from './resume-session-prompt.js';

export const BasicResumeSessionPrompt = () => {
    return (
        <ResumeSessionPrompt
            onResume={() => console.log('Resume clicked')}
            onStartFresh={() => console.log('Start Fresh clicked')}
        />
    );
};

export const LoadingResumeSessionPrompt = () => {
    return (
        <ResumeSessionPrompt
            onResume={() => console.log('Resume clicked')}
            onStartFresh={() => console.log('Start Fresh clicked')}
            isLoading={true}
        />
    );
};
