import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Icon } from './icon.js';

// SVG path data components for reusability
const CloseIconPath = () => <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />;
const CalendarIconPath = () => <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />;
const UserIconPath = () => <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const CheckmarkIconPath = () => <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />;


export const BasicIcon = () => (
  <ApiBankingTheme>
    <div style={{ padding: 'var(--spacing-large)' }}>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-secondary)' }}>
        Default user icon (size: `var(--typography-sizes-body-large)`, color: `currentColor`):
      </p>
      <Icon>
        <UserIconPath />
      </Icon>
    </div>
  </ApiBankingTheme>
);

export const SizedAndColoredIcons = () => (
  <ApiBankingTheme>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)', padding: 'var(--spacing-large)' }}>
      <div>
        <h4 style={{ fontFamily: 'var(--typography-font-family)', marginBlock: 0, marginBlockEnd: 'var(--spacing-medium)' }}>By Size</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
          <Icon size="16px"><UserIconPath /></Icon>
          <Icon size="24px"><UserIconPath /></Icon>
          <Icon size="32px"><UserIconPath /></Icon>
          <Icon size="2em"><UserIconPath /></Icon>
        </div>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--typography-font-family)', marginBlock: 0, marginBlockEnd: 'var(--spacing-medium)' }}>By Color</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-medium)' }}>
          <Icon size="24px" color="var(--colors-primary-default)"><UserIconPath /></Icon>
          <Icon size="24px" color="var(--colors-status-positive-default)"><CheckmarkIconPath /></Icon>
          <Icon size="24px" color="var(--colors-status-negative-default)"><CloseIconPath /></Icon>
          <Icon size="24px" color="var(--colors-status-info-default)"><CalendarIconPath /></Icon>
        </div>
      </div>
    </div>
  </ApiBankingTheme>
);

export const InteractiveIcon = () => (
  <ApiBankingTheme>
    <div style={{ padding: 'var(--spacing-large)' }}>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-secondary)' }}>
        Clickable icon with hover effect:
      </p>
      <Icon size="32px" onClick={() => alert('Close icon clicked!')}>
        <CloseIconPath />
      </Icon>
    </div>
  </ApiBankingTheme>
);

export const IconGalleryForApp = () => (
    <ApiBankingTheme>
        <div style={{ padding: 'var(--spacing-large)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-medium)' }}>
            <h3 style={{ fontFamily: 'var(--typography-font-family)', fontWeight: 'var(--typography-font-weight-bold)', margin: 0 }}>
              Login Flow Icons
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center', color: 'var(--colors-text-secondary)', border: '1px solid var(--borders-default-color)', borderRadius: 'var(--borders-radius-medium)', padding: 'var(--spacing-large)' }}>
                <Icon title="User Profile" size="32px" color="var(--colors-text-primary)">
                    <UserIconPath />
                </Icon>
                <Icon title="Date of Birth" size="32px">
                    <CalendarIconPath />
                </Icon>
                <Icon title="Consent Accepted" size="32px" color="var(--colors-status-positive-default)">
                    <CheckmarkIconPath />
                </Icon>
                <Icon title="Close Modal" size="32px" color="var(--colors-status-negative-default)" onClick={() => alert('Closing...')}>
                    <CloseIconPath />
                </Icon>
            </div>
        </div>
    </ApiBankingTheme>
);