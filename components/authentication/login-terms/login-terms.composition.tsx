import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Link } from '@api-banking/design.navigation.link';
import { LoginTerms } from './login-terms.js';

const CompositionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 'var(--spacing-large)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-large)',
      backgroundColor: 'var(--colors-surface-primary)',
      width: '100%',
      maxWidth: '450px',
      borderRadius: 'var(--borders-radius-medium)',
      border: '1px solid var(--colors-surface-secondary)',
      boxSizing: 'border-box'
    }}
  >
    {children}
  </div>
);

export const InteractiveLoginTermses = () => {
  const [isPolicyAccepted, setPolicyAccepted] = useState(false);
  const [isProductsConsented, setProductsConsented] = useState(false);

  const handleViewPolicyDetails = () => {
    // In a real app, this would open a modal.
    // We use `confirm` to simulate the user agreeing in the modal.
    const confirmed = window.confirm(
      'Consent Details: Privacy Policy\n\nSummary: I/we have read, understood, and hereby accept the Privacy Policy of the bank.\n\n(Click "OK" to simulate "Accept" in a modal)'
    );
    if (confirmed) {
      setPolicyAccepted(true);
    }
  };

  const handleViewProductDetails = () => {
    const confirmed = window.confirm(
      'Consent Details: Requested Products\n\nSummary: I/we hereby give consent (V.1.0) in relation to Requested Products.\n\n(Click "OK" to simulate "Accept" in a modal)'
    );
    if (confirmed) {
      setProductsConsented(true);
    }
  };

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <LoginTerms
          id="privacy-policy"
          checked={isPolicyAccepted}
          onViewDetails={handleViewPolicyDetails}
          label="I/we have read, understood, and hereby accept the Privacy Policy of the bank."
        />
        <LoginTerms
          id="requested-products"
          checked={isProductsConsented}
          onViewDetails={handleViewProductDetails}
          label="I/we hereby give consent (V.1.0) in relation to Requested Products"
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const LoginTermsWithDetailsLink = () => {
  const [isTermsAccepted, setTermsAccepted] = useState(false);

  const handleViewTerms = () => {
    const confirmed = window.confirm(
      'Consent Details: Full Terms\n\nClicking the label text or the "View Details" link will trigger this confirmation.\n\n(Click "OK" to accept)'
    );
    if (confirmed) {
      setTermsAccepted(true);
    }
  };

  // This handler stops the event from bubbling up, which would cause handleViewTerms to fire twice.
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleViewTerms();
  };

  return (
    <ApiBankingTheme>
      <CompositionWrapper>
        <LoginTerms
          id="terms-and-conditions"
          checked={isTermsAccepted}
          onViewDetails={handleViewTerms}
          label={
            <span>
              I agree to the full terms. {' '}
              <Link href="#" onClick={onLinkClick}>
                View Details
              </Link>
            </span>
          }
        />
      </CompositionWrapper>
    </ApiBankingTheme>
  );
};

export const DisabledLoginTermses = () => (
  <ApiBankingTheme>
    <CompositionWrapper>
      <LoginTerms
        id="disabled-unchecked"
        disabled
        onViewDetails={() => alert('This should not be called.')}
        label="Disabled and unchecked consent"
      />
      <LoginTerms
        id="disabled-checked"
        checked
        disabled
        onViewDetails={() => alert('This should not be called.')}
        label="Disabled and checked consent"
      />
    </CompositionWrapper>
  </ApiBankingTheme>
);