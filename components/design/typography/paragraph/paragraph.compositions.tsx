import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Paragraph } from './paragraph.js';

const CompositionContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '2rem',
      backgroundColor: 'var(--colors-surface-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      borderRadius: 'var(--borders-radius-large)',
      width: 'fit-content'
    }}
  >
    {children}
  </div>
);

export const BasicParagraphs = () => {
  return (
    <ApiBankingTheme>
      <CompositionContainer>
        <Paragraph>
          I/we have read, understood, and hereby accept the Privacy Policy.
        </Paragraph>
        <Paragraph>OTP has been sent to xxxx3210</Paragraph>
      </CompositionContainer>
    </ApiBankingTheme>
  );
};

export const LeadParagraphs = () => {
  return (
    <ApiBankingTheme>
      <CompositionContainer>
        <Paragraph variant="lead">Login</Paragraph>
        <Paragraph variant="lead">Customer Details</Paragraph>
        <Paragraph variant="lead">Enter OTP</Paragraph>
      </CompositionContainer>
    </ApiBankingTheme>
  );
};

export const MutedParagraphs = () => {
  return (
    <ApiBankingTheme>
      <CompositionContainer>
        <Paragraph variant="muted">
          For testing purposes Mobile Number: 9876543210
        </Paragraph>
        <Paragraph variant="muted">
          For testing purposes, please use OTP: 123456
        </Paragraph>
        <Paragraph variant="muted">
          For full details read our Terms and Conditions and Privacy Policy.
        </Paragraph>
      </CompositionContainer>
    </ApiBankingTheme>
  );
};