import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Logo } from './logo.js';

const compositionWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-x4)',
  padding: 'var(--spacing-x4)',
  backgroundColor: 'var(--colors-surface-primary)',
  borderRadius: 'var(--borders-radius-large)',
  alignItems: 'flex-start',
};

const h4Style: React.CSSProperties = {
  fontFamily: 'var(--typography-font-family)',
  color: 'var(--colors-text-secondary)',
  margin: '0 0 var(--spacing-small) 0',
  fontWeight: 'var(--typography-font-weight-regular)',
  fontSize: 'var(--typography-sizes-caption-default)',
};

const customImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: 'var(--borders-radius-small)',
  objectFit: 'cover',
};

export const DefaultLogo = () => (
  <MemoryRouter>
    <ApiBankingTheme>
      <div style={{ padding: 'var(--spacing-large)', backgroundColor: 'var(--colors-surface-background)' }}>
        <Logo />
      </div>
    </ApiBankingTheme>
  </MemoryRouter>
);

export const LogoVariations = () => (
  <MemoryRouter>
    <ApiBankingTheme>
      <div style={compositionWrapperStyle}>
        <div>
          <h4 style={h4Style}>With Slogan</h4>
          <Logo slogan="Secure. Fast. Connected." />
        </div>
        <div>
          <h4 style={h4Style}>Minimal</h4>
          <Logo minimal={true} logoSize={50} />
        </div>
        <div>
          <h4 style={h4Style}>Custom Size (60px)</h4>
          <Logo logoSize={60} slogan="Scaling new heights" />
        </div>
      </div>
    </ApiBankingTheme>
  </MemoryRouter>
);

export const CustomLogo = () => (
  <MemoryRouter>
    <ApiBankingTheme>
      <div style={{ padding: 'var(--spacing-large)', backgroundColor: 'var(--colors-surface-background)' }}>
        <Logo
          logo={
            <img
              src="https://cdn.pixabay.com/photo/2018/05/14/16/54/cyber-3400789_150.jpg"
              alt="Custom Brand"
              style={customImgStyle}
            />
          }
          name="Future Bank"
          slogan="Banking for the next generation"
          logoSize={50}
        />
      </div>
    </ApiBankingTheme>
  </MemoryRouter>
);