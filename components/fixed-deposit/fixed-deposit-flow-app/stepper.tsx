import React, { useState, useEffect } from 'react';
import styles from './stepper.module.scss';

export type StepperProps = {
    children?: React.ReactNode;
    stepTitles?: string[];
    initialStep?: number;
    onComplete?: () => void;
    onStepClick?: (stepIndex: number) => void;
    onStepChange?: (stepIndex: number) => void;
};

export function Stepper({ children, stepTitles = [], initialStep = 0, onComplete, onStepClick, onStepChange }: StepperProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
    const steps = React.Children.toArray(children);

    // Sync currentStepIndex when initialStep changes (e.g., after session restore)
    useEffect(() => {
        setCurrentStepIndex(initialStep);
    }, [initialStep]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextStep = currentStepIndex + 1;
            setCurrentStepIndex(nextStep);
            onStepChange?.(nextStep);
        } else {
            onComplete?.();
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            const prevStep = currentStepIndex - 1;
            setCurrentStepIndex(prevStep);
            onStepChange?.(prevStep);
        }
    };

    const handleStepClick = (index: number) => {
        if (index < currentStepIndex) {
            setCurrentStepIndex(index);
            onStepClick?.(index);
            onStepChange?.(index);
        }
    };

    const currentChild = steps[currentStepIndex];

    if (!currentChild) {
        return <div>No steps defined</div>;
    }

    const getStepClassName = (index: number) => {
        if (index < currentStepIndex) {
            return `${styles.stepTab} ${styles.stepTabCompleted}`;
        }
        if (index === currentStepIndex) {
            return `${styles.stepTab} ${styles.stepTabCurrent}`;
        }
        return `${styles.stepTab} ${styles.stepTabPending}`;
    };

    const getConnectorClassName = (index: number) => {
        if (index < currentStepIndex) {
            return `${styles.stepConnector} ${styles.completed}`;
        }
        return `${styles.stepConnector} ${styles.dashed}`;
    };

    return (
        <div className={styles.stepperContainer}>
            {/* Step Navigation Tabs */}
            <nav className={styles.stepperNav}>
                <div className={styles.stepTabs}>
                    {stepTitles.map((title, index) => (
                        <React.Fragment key={index}>
                            <button
                                type="button"
                                className={getStepClassName(index)}
                                onClick={() => handleStepClick(index)}
                                disabled={index > currentStepIndex}
                                aria-current={index === currentStepIndex ? 'step' : undefined}
                            >
                                <span className={styles.stepNumber}>
                                    {index < currentStepIndex ? '✓' : index + 1}
                                </span>
                                {title}
                            </button>
                            {index < stepTitles.length - 1 && (
                                <div className={getConnectorClassName(index)} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </nav>

            {/* Content Area */}
            <div className={styles.contentWrapper}>
                <div className={styles.contentHeader} />
                <div className={styles.contentCard}>
                    <div className={styles.contentInner}>
                        {(() => {
                            let childToRender = currentChild;
                            if (React.isValidElement(currentChild) && currentChild.type === React.Fragment) {
                                const fragChildren = (currentChild.props as any).children;
                                if (React.isValidElement(fragChildren)) {
                                    childToRender = fragChildren;
                                }
                            }

                            return React.isValidElement(childToRender) ? React.cloneElement(childToRender as React.ReactElement<any>, {
                                onContinue: (data: any) => {
                                    const child = childToRender as React.ReactElement<any>;
                                    if (child.props.onContinue) {
                                        child.props.onContinue(data);
                                    }
                                    handleNext();
                                },
                                onBack: currentStepIndex > 0 ? handlePrevious : undefined,
                            }) : childToRender;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
