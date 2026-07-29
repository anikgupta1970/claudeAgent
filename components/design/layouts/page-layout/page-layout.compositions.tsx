import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { PageLayout } from './page-layout.js';

const formCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--colors-surface-primary)',
  padding: 'var(--spacing-x4)',
  borderRadius: 'var(--borders-radius-large)',
  boxShadow: 'var(--effects-shadows-raised)',
  maxWidth: '500px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-large)',
  fontFamily: 'var(--typography-font-family)',
};

const headingStyle: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-heading-h2)',
  fontWeight: 'var(--typography-font-weight-bold)',
  color: 'var(--colors-text-default)',
  margin: 0,
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-heading-h4)',
  fontWeight: 'var(--typography-font-weight-semi-bold)',
  color: 'var(--colors-text-default)',
  margin: 0,
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-small)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-body-default)',
  fontWeight: 'var(--typography-font-weight-medium)',
  color: 'var(--colors-text-secondary)',
};

const inputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid var(--borders-default-color)',
  borderRadius: 'var(--borders-radius-medium)',
  padding: '0 var(--spacing-medium)',
};

const inputPrefixStyle: React.CSSProperties = {
  paddingRight: 'var(--spacing-small)',
  color: 'var(--colors-text-secondary)',
  borderRight: '1px solid var(--borders-default-color)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--spacing-medium)',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: 'var(--typography-sizes-body-default)',
};

const hintTextStyle: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-body-small)',
  color: 'var(--colors-text-secondary)',
  margin: 'var(--spacing-small) 0 0 0',
};

const radioGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-large)',
};

const radioLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-small)',
  cursor: 'var(--interactions-cursor-pointer)',
};

const checkboxGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-medium)',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--spacing-medium)',
  cursor: 'var(--interactions-cursor-pointer)',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#ff0000',
  color: 'var(--colors-text-inverse)',
  padding: 'var(--spacing-medium)',
  border: 'none',
  borderRadius: 'var(--borders-radius-medium)',
  width: '100%',
  fontSize: 'var(--typography-sizes-body-large)',
  fontWeight: 'var(--typography-font-weight-semi-bold)',
  cursor: 'var(--interactions-cursor-pointer)',
};

const linkStyle: React.CSSProperties = {
  color: 'var(--colors-text-primary)',
  textDecoration: 'underline',
  cursor: 'var(--interactions-cursor-pointer)',
};

export const LoginPage = () => {
  return (
    <ApiBankingTheme>
      <PageLayout
        title="Login - Banking App"
        description="Login to your account to access customer details and services."
        keywords="bank, login, customer details, banking"
      >
        <div style={formCardStyle}>
          <h1 style={headingStyle}>Login</h1>
          <div>
            <h2 style={subHeadingStyle}>Customer Details</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-large)',
                marginTop: 'var(--spacing-large)',
              }}
            >
              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  Mobile Number <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={inputWrapperStyle}>
                  <span style={inputPrefixStyle}>+91</span>
                  <input
                    style={inputStyle}
                    type="tel"
                    defaultValue="9876543210"
                  />
                </div>
                <p style={hintTextStyle}>
                  For testing purposes Mobile Number: 9876543210
                </p>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  Validate using <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={radioGroupStyle}>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="validation"
                      value="dob"
                      defaultChecked
                    />
                    <span>Date of Birth</span>
                  </label>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="validation" value="pan" />
                    <span>PAN Number</span>
                  </label>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  Date of Birth <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={inputWrapperStyle}>
                  <input style={inputStyle} defaultValue="MM/DD/YYYY" />
                  <span style={{ cursor: 'pointer' }}>📅</span>
                </div>
                <p style={hintTextStyle}>
                  For testing purposes DOB: 01/01/1990 (MM/DD/YYYY)
                </p>
              </div>
            </div>
          </div>

          <div style={checkboxGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" style={{ marginTop: '4px' }} />
              <span>
                I/we have read, understood, and hereby accept the Privacy Policy.
              </span>
            </label>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" style={{ marginTop: '4px' }} />
              <span>
                I/we hereby give consent (V.1.0) in relation to Requested
                Products
              </span>
            </label>
          </div>

          <div>
            <p style={hintTextStyle}>
              For full details read our{' '}
              <a style={linkStyle}>Terms and Conditions</a> and{' '}
              <a style={linkStyle}>Privacy Policy</a>
            </p>
          </div>

          <button style={buttonStyle}>Continue</button>
        </div>
      </PageLayout>
    </ApiBankingTheme>
  );
};

export const BasicPageWithContent = () => {
  return (
    <ApiBankingTheme>
      <PageLayout
        title="Basic Page"
        description="A basic page layout example."
        keywords="layout, basic, example"
      >
        <div style={{ ...formCardStyle, maxWidth: '800px' }}>
          <h1 style={headingStyle}>Welcome to the Page</h1>
          <p style={{ color: 'var(--colors-text-secondary)', lineHeight: 1.6 }}>
            This composition demonstrates the basic usage of the PageLayout
            component. It wraps the content, sets the page title and meta tags,
            and provides consistent padding and responsive behavior out of the
            box. The main content area is centered and has a maximum width to
            ensure readability on large screens. All styling is derived from
            the theme variables.
          </p>
          <img
            src="https://pixabay.com/get/g5f249a66c41060867adc7fa3b44011bab73ed09cd5d7a24d3a650010d956214ebc94c7ac929bcc19b943b06a5239cec66ee37b33fdf01a15314f56bd6e82aeb3_1280.jpg"
            alt="Workspace"
            style={{ width: '100%', borderRadius: 'var(--borders-radius-medium)' }}
          />
        </div>
      </PageLayout>
    </ApiBankingTheme>
  );
};