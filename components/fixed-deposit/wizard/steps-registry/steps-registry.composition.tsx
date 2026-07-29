import React from 'react';
import { createStepsRegistry } from './steps-registry.js';

// Mock Stepper component for composition
const MockStepper = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

export const BasicStepsRegistry = () => {
  const registry = createStepsRegistry({ Stepper: MockStepper });
  const registeredTypes = registry.listRegisteredTypes();

  return (
    <div>
      <h3>Registered Components</h3>
      <ul>
        {registeredTypes.map((name) => (
          <li key={name}>
            {name}: {registry.has(name) ? 'Registered' : 'Not Found'}
          </li>
        ))}
      </ul>
    </div>
  );
};
