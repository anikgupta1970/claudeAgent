import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Stepper } from './stepper.js';

it('should unwrap Fragment children and inject onContinue', () => {
    const handleComplete = vi.fn();
    const handleContinue = vi.fn();

    const StepComponent = ({ onContinue }: { onContinue?: (data: any) => void }) => (
        <button onClick={() => onContinue?.({ foo: 'bar' })}>Next</button>
    );

    const { getByText } = render(
        <Stepper onComplete={handleComplete}>
            <>
                <StepComponent onContinue={handleContinue} />
            </>
        </Stepper>
    );

    fireEvent.click(getByText('Next'));

    expect(handleContinue).toHaveBeenCalledWith({ foo: 'bar' });
    expect(handleComplete).toHaveBeenCalled();
});
