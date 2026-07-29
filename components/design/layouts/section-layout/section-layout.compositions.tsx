import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { SectionLayout } from './section-layout.js';

const CompositionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      maxWidth: '720px',
      margin: 'auto',
      padding: 'var(--spacing-xl)',
      backgroundColor: 'var(--colors-surface-background)',
    }}
  >
    {children}
  </div>
);

export const BasicSectionLayout = () => (
  <ApiBankingTheme>
    <CompositionWrapper>
      <SectionLayout title="Customer Details">
        <Paragraph>
          Please enter your mobile number to proceed. We will send an OTP for
          verification. This helps us keep your account secure.
        </Paragraph>
        <div
          style={{
            border: '1px solid var(--borders-default-color)',
            padding: 'var(--spacing-large)',
            borderRadius: 'var(--borders-radius-medium)',
            color: 'var(--colors-text-secondary)',
            marginTop: 'var(--spacing-medium)',
            textAlign: 'center',
            backgroundColor: 'var(--colors-surface-primary)',
          }}
        >
          [Placeholder for Input Fields]
        </div>
      </SectionLayout>
    </CompositionWrapper>
  </ApiBankingTheme>
);

export const SectionLayoutWithFullHeader = () => (
  <ApiBankingTheme>
    <CompositionWrapper>
      <SectionLayout
        title="Consent & Conditions"
        subtitle="Please review and accept the following terms to continue."
        caption="For full details read our Terms and Conditions and Privacy Policy."
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-medium)',
            padding: 'var(--spacing-large)',
            backgroundColor: 'var(--colors-surface-primary)',
            borderRadius: 'var(--borders-radius-large)',
          }}
        >
          <Paragraph>
            [Checkbox] I/we have read, understood, and hereby accept the Privacy
            Policy.
          </Paragraph>
          <Paragraph>
            [Checkbox] I/we hereby give consent (V.1.0) in relation to Requested
            Products.
          </Paragraph>
        </div>
      </SectionLayout>
    </CompositionWrapper>
  </ApiBankingTheme>
);

export const SectionLayoutWithRichContent = () => (
  <ApiBankingTheme>
    <CompositionWrapper>
      <SectionLayout
        title={<Heading level={2}>Welcome to Secure Banking</Heading>}
        subtitle="Your financial safety is our top priority."
      >
        <Paragraph>
          We employ state-of-the-art technology to protect your information and
          transactions. Our robust infrastructure ensures that your data is
          always safe, encrypted, and accessible only to you.
        </Paragraph>
        <img
          src="https://pixabay.com/get/g409f20d68ba5021d3b2ea241c6c00286f88190a3757c3fb0b9a99913552c4466349af8b5f575e38bee5db517ef9bffd659eae3759641a9e95e1c4385fc0c926a_1280.jpg"
          alt="Abstract technology background representing secure banking"
          style={{
            width: '100%',
            borderRadius: 'var(--borders-radius-large)',
            objectFit: 'cover',
            marginTop: 'var(--spacing-large)',
          }}
        />
      </SectionLayout>
    </CompositionWrapper>
  </ApiBankingTheme>
);