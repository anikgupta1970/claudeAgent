import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Heading } from '@api-banking/design.typography.heading';
import { Card } from './card.js';

const buttonStyle: React.CSSProperties = {
  padding: 'var(--spacing-small) var(--spacing-medium)',
  borderRadius: 'var(--borders-radius-medium)',
  fontFamily: 'var(--typography-font-family)',
  fontWeight: 'var(--typography-font-weight-semi-bold)',
  cursor: 'pointer',
  border: 'none',
  textAlign: 'center',
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'var(--colors-primary-default)',
  color: 'var(--colors-text-inverse)',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: 'var(--colors-text-primary)',
  border: '1px solid var(--borders-default-color)',
};

export const LoginScreenCard = () => (
  <ApiBankingTheme>
    <div
      style={{
        padding: 'var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'var(--colors-surface-secondary)',
      }}
    >
      <Card style={{ maxWidth: '480px', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xl)',
            fontFamily: 'var(--typography-font-family)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-small)',
            }}
          >
            <Heading level={2}>Login</Heading>
            <Heading level={3}>Customer Details</Heading>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-large)',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-small)',
                  color: 'var(--colors-text-primary)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                }}
              >
                Mobile Number *
              </label>
              <div
                style={{
                  border: '1px solid var(--borders-default-color)',
                  padding: 'var(--spacing-medium)',
                  borderRadius: 'var(--borders-radius-medium)',
                  color: 'var(--colors-text-secondary)',
                }}
              >
                +91 9876543210
              </div>
              <p
                style={{
                  fontSize: 'var(--typography-sizes-body-small)',
                  color: 'var(--colors-text-secondary)',
                  margin: 'var(--spacing-small) 0 0 0',
                }}
              >
                For testing purposes Mobile Number: 9876543210
              </p>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-medium)',
                  color: 'var(--colors-text-primary)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                }}
              >
                Validate using *
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-large)',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-small)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '6px solid var(--colors-primary-default)',
                    }}
                  />
                  <span>Date of Birth</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-small)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '2px solid var(--borders-default-color)',
                    }}
                  />
                  <span>PAN Number</span>
                </div>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-small)',
                  color: 'var(--colors-text-primary)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                }}
              >
                Date of Birth *
              </label>
              <div
                style={{
                  border: '1px solid var(--borders-default-color)',
                  padding: 'var(--spacing-medium)',
                  borderRadius: 'var(--borders-radius-medium)',
                  color: 'var(--colors-text-secondary)',
                }}
              >
                MM/DD/YYYY
              </div>
              <p
                style={{
                  fontSize: 'var(--typography-sizes-body-small)',
                  color: 'var(--colors-text-secondary)',
                  margin: 'var(--spacing-small) 0 0 0',
                }}
              >
                For testing purposes DOB: 01/01/1990 (MM/DD/YYYY)
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-medium)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 'var(--spacing-medium)',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid var(--borders-default-color)',
                    borderRadius: 'var(--borders-radius-small)',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                ></div>
                <span>
                  I/we have read, understood, and hereby accept the Privacy
                  Policy.
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 'var(--spacing-medium)',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid var(--borders-default-color)',
                    borderRadius: 'var(--borders-radius-small)',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                ></div>
                <span>
                  I/we hereby give consent (V.1.0) in relation to Requested
                  Products
                </span>
              </div>
            </div>
          </div>
          <p
            style={{
              fontSize: 'var(--typography-sizes-body-small)',
              color: 'var(--colors-text-secondary)',
              margin: '0',
            }}
          >
            For full details read our{' '}
            <a href="#" style={{ color: 'var(--colors-text-primary)' }}>
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: 'var(--colors-text-primary)' }}>
              Privacy Policy
            </a>
            .
          </p>

          <div
            style={{
              backgroundColor: '#ff0000',
              color: 'var(--colors-text-inverse)',
              padding: 'var(--spacing-medium)',
              textAlign: 'center',
              borderRadius: 'var(--borders-radius-medium)',
              fontWeight: 'var(--typography-font-weight-bold)',
              cursor: 'pointer',
            }}
          >
            Continue
          </div>
        </div>
      </Card>
    </div>
  </ApiBankingTheme>
);

export const InteractiveOutlinedCard = () => (
  <ApiBankingTheme>
    <div style={{ padding: '2rem', maxWidth: '400px' }}>
      <Card
        interactive
        variant="outlined"
        header={<Heading level={4}>Consent Details</Heading>}
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-medium)' }}>
            <div style={secondaryButtonStyle}>Cancel</div>
            <div style={primaryButtonStyle}>Accept</div>
          </div>
        }
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--typography-font-family)',
            color: 'var(--colors-text-primary)',
          }}
        >
          This card is interactive and uses the 'outlined' style. Hover over it
          to see the effect. It also includes a header and a footer for
          actions, similar to a modal dialog.
        </p>
      </Card>
    </div>
  </ApiBankingTheme>
);

export const CardWithImage = () => (
  <ApiBankingTheme>
    <div style={{ padding: '2rem', maxWidth: '350px' }}>
      <Card interactive>
        <div style={{ padding: '0', margin: '-24px -24px 0 -24px' }}>
          <img
            src="https://pixabay.com/get/g4ecfa44885ab25f2ac5f5644d0558392ce62b00b15fa4d785cdf642a1432d4ce1086d2226b6c77d0f12a9eedcf3300a3a6983040fc2762f2268e947b5fc9a670_1280.jpg"
            alt="Cyber background"
            style={{
              width: '100%',
              display: 'block',
              borderTopLeftRadius: 'var(--borders-radius-large)',
              borderTopRightRadius: 'var(--borders-radius-large)',
            }}
          />
        </div>
        <Heading level={4}>Explore Our API</Heading>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--typography-font-family)',
            color: 'var(--colors-text-secondary)',
            fontSize: 'var(--typography-sizes-body-medium)',
          }}
        >
          Click to learn more about our powerful and secure banking APIs for
          your next project. This card has a hover effect and contains an image.
        </p>
      </Card>
    </div>
  </ApiBankingTheme>
);