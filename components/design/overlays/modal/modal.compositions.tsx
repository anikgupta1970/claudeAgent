import React, { useState } from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Heading } from '@api-banking/design.typography.heading';
import { Modal } from './modal.js';

// --- Helper styles for composition elements ---
const compStyles = {
  triggerButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--borders-radius-medium)',
    cursor: 'pointer',
    fontFamily: 'var(--typography-font-family)',
    fontSize: 'var(--typography-sizes-body-default)',
    backgroundColor: 'var(--colors-primary-default)',
    color: 'var(--colors-text-inverse)',
    fontWeight: 'var(--typography-font-weight-medium)',
  },
  actionButton: {
    padding: '8px 24px',
    border: '1px solid transparent',
    borderRadius: 'var(--borders-radius-medium)',
    cursor: 'pointer',
    fontFamily: 'var(--typography-font-family)',
    fontSize: 'var(--typography-sizes-body-default)',
    fontWeight: 'var(--typography-font-weight-medium)',
    transition: 'all var(--interactions-transitions-duration-fast)',
  },
  link: {
    fontFamily: 'var(--typography-font-family)',
    color: 'var(--colors-primary-default)',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'var(--typography-font-weight-medium)',
  },
  otpInput: {
    width: '45px',
    height: '55px',
    textAlign: 'center' as const,
    fontSize: 'var(--typography-sizes-heading-h5)',
    border: '1px solid var(--borders-default-color)',
    borderRadius: 'var(--borders-radius-medium)',
    backgroundColor: 'var(--colors-surface-background)',
  },
};
// --- End of helper styles ---

export const ConsentDetailsModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ApiBankingTheme>
      <div style={{ padding: 'var(--spacing-xl)', minHeight: '350px', backgroundColor: 'var(--colors-surface-background)' }}>
        <button style={compStyles.triggerButton} onClick={() => setIsOpen(true)}>
          Show Consent Modal
        </button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Consent Details"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
            <div>
              <Heading level={6} visualLevel="h6" style={{ fontWeight: 'var(--typography-font-weight-bold)', color: 'var(--colors-text-primary)', marginBottom: 'var(--spacing-small)' }}>
                Summary
              </Heading>
              <p style={{ margin: 0, lineHeight: 'var(--typography-line-height-base)' }}>
                I/we have read, understood, and hereby accept the Privacy Policy of the bank.
              </p>
            </div>
            <a href="https://pixabay.com/get/gd33c7870d3b467b73c531ac93c307db3c511401d548413b4e60df7af9ad0afcfca47_1280.png" target="_blank" rel="noopener noreferrer" style={compStyles.link}>
              View document
            </a>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-medium)', paddingTop: 'var(--spacing-medium)' }}>
              <button
                style={{
                  ...compStyles.actionButton,
                  backgroundColor: 'var(--colors-surface-secondary)',
                  color: 'var(--colors-text-primary)',
                  border: '1px solid var(--borders-default-color)',
                }}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...compStyles.actionButton,
                  backgroundColor: 'var(--colors-primary-default)',
                  color: 'var(--colors-text-inverse)',
                }}
                onClick={() => { alert('Accepted!'); setIsOpen(false); }}
              >
                Accept
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ApiBankingTheme>
  );
};


export const OTPVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ApiBankingTheme>
      <div style={{ padding: 'var(--spacing-xl)', minHeight: '400px', backgroundColor: 'var(--colors-surface-background)' }}>
        <button style={compStyles.triggerButton} onClick={() => setIsOpen(true)}>
          Show OTP Modal
        </button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Enter OTP"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)', textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--colors-text-primary)', lineHeight: 'var(--typography-line-height-base)' }}>
              OTP has been sent to xxxx3210
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-small)', margin: 'var(--spacing-medium) 0' }}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} style={compStyles.otpInput}></div>
                ))}
            </div>
            <p style={{ margin: 0, color: 'var(--colors-text-secondary)', fontSize: 'var(--typography-sizes-body-small)' }}>
                For testing purposes, please use OTP: 123456
            </p>
            <button
                style={{
                    ...compStyles.actionButton,
                    backgroundColor: '#e4002b',
                    color: 'white',
                    width: '100%',
                    paddingBlock: '12px',
                    marginTop: 'var(--spacing-medium)'
                }}
                onClick={() => { alert('Submitted!'); setIsOpen(false); }}
            >
                Submit
            </button>
          </div>
        </Modal>
      </div>
    </ApiBankingTheme>
  );
};


export const BasicModalWithLongContent = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ApiBankingTheme>
            <div style={{ padding: 'var(--spacing-xl)', backgroundColor: 'var(--colors-surface-background)' }}>
                <button
                    style={compStyles.triggerButton}
                    onClick={() => setIsOpen(true)}
                >
                    Show Scrolling Modal
                </button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Terms and Conditions"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>
                        <Heading level={5}>1. Introduction</Heading>
                        <p>Welcome to our service. By using our service, you are agreeing to these terms. Please read them carefully. Our service is very diverse, so sometimes additional terms or product requirements (including age requirements) may apply.</p>

                        <Heading level={5}>2. Using our Service</Heading>
                        <p>You must follow any policies made available to you within the Service. Don't misuse our Service. For example, don’t interfere with our Service or try to access them using a method other than the interface and the instructions that we provide. You may use our Service only as permitted by law, including applicable export and re-export control laws and regulations.</p>

                        <Heading level={5}>3. Privacy and Copyright Protection</Heading>
                        <p>Our privacy policies explain how we treat your personal data and protect your privacy when you use our Service. By using our Service, you agree that we can use such data in accordance with our privacy policies.</p>

                        <Heading level={5}>4. Your Content in our Service</Heading>
                        <p>Some of our Services allow you to upload, submit, store, send or receive content. You retain ownership of any intellectual property rights that you hold in that content. In short, what belongs to you stays yours.</p>

                        <Heading level={5}>5. About Software in our Services</Heading>
                        <p>When a Service requires or includes downloadable software, this software may update automatically on your device once a new version or feature is available. Some Services may let you adjust your automatic update settings.</p>
                    </div>
                </Modal>
            </div>
        </ApiBankingTheme>
    );
};