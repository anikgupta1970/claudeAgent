/**
 * ApiBanking tokens theme.
 * Include all tokens in this object.
 */
export function apiBankingThemeTokens() {
  const tokens = {
    /**
     * Color Palette
     */
    colors: {
      primary: {
        default: '#E30613', // Main brand color for actions (e.g., Continue, Submit)
        hover: '#F31623',   // Lighter shade for hover states
        active: '#C90512',  // Darker shade for active/pressed states
      },
      secondary: {
        default: '#0072C6', // Accent color for secondary actions (e.g., Accept)
        hover: '#0082E0',   // Lighter accent for hover
        active: '#0062AC',  // Darker accent for active
      },
      surface: {
        background: '#F7F8FA', // Page background color
        primary: '#FFFFFF',     // Card, modal, and primary content surfaces
        secondary: '#E9ECEF',   // Disabled states, subtle backgrounds
      },
      text: {
        primary: '#1D2329',   // Main text color for headings and body
        default: '#1D2329',   // Default text color
        secondary: '#6C757D', // Lighter text for labels, placeholders, help text
        inverse: '#FFFFFF',   // Text on dark or colored backgrounds
      },
      status: {
        positive: { default: '#28A745', subtle: '#D4EDDA' },
        negative: { default: '#DC3545', subtle: '#F8D7DA' },
        warning: { default: '#FFC107', subtle: '#FFF3CD' },
        info: { default: '#0072C6', subtle: '#CCE5FF' },
      },
      overlay: 'rgba(29, 35, 41, 0.5)', // Semi-transparent overlay for modals
      accent: {
        default: '#8B2D8B', // Purple - for selection highlights
        hover: '#9B3D9B',
        active: '#7B1D7B',
      },
      surfaceDark: {
        default: '#003366', // Dark navy - for stepper background
        hover: '#004080',
        active: '#002952',
      },
    },

    borders: {
      default: {
        color: '#CED4DA', // Default border for inputs and containers
        width: '1px',
        style: 'solid',
      },
      focus: {
        color: '#0072C6', // Focus ring color for accessibility
        width: '2px',
        style: 'solid',
        offset: '2px',
      },
      radius: {
        small: '4px',    // Small elements like checkboxes
        medium: '8px',   // Standard elements like buttons, inputs
        large: '16px',   // Larger elements like cards, modals
      },
    },

    /**
     * Typography System
     */
    typography: {
      fontFamily: "'Poppins', sans-serif, Arial", // Modern, clean, and legible typeface
      sizes: {
        display: { large: '60px', medium: '48px', small: '36px' },
        heading: {
          h1: '32px',
          h2: '28px',
          h3: '24px',
          h4: '20px',
          h5: '18px',
          h6: '16px',
        },
        body: { large: '18px', medium: '16px', default: '16px', small: '14px' },
        caption: { default: '12px', medium: '14px' },
      },
      lineHeight: {
        base: '1.6', // Generous line height for readability
        heading: '1.3',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.03em',
      },
    },

    /**
     * Spacing & Layout
     */
    spacing: {
      default: '16px',
      medium: '16px',
      small: '8px',
      large: '24px',
      xl: '32px',
      x4: '48px',
    },

    layout: {
      maxPageWidth: '1280px',
      gutter: '24px',
    },

    /**
     * Visual Effects
     */
    effects: {
      shadows: {
        xs: '0px 1px 2px rgba(29, 35, 41, 0.05)',
        small: '0px 2px 4px rgba(29, 35, 41, 0.08)',
        medium: '0px 8px 16px rgba(29, 35, 41, 0.08)',
        large: '0px 12px 24px rgba(29, 35, 41, 0.12)',
        xLarge: '0px 16px 32px rgba(29, 35, 41, 0.15)',
        inset: 'inset 0px 1px 2px rgba(0, 0, 0, 0.06)',
        raised: '0px 4px 12px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
      },
      opacity: { disabled: '0.5', hover: '0.8', faint: '0.2', semiOpaque: '0.7' },
      gradients: {
        primary: 'linear-gradient(to right, #E30613, #FF4136)',
        secondary: 'linear-gradient(to right, #0072C6, #0082E0)',
        radial: 'radial-gradient(circle, #E30613, #C90512)',
      },
      blur: {
        small: 'blur(4px)',
        medium: 'blur(8px)',
        large: 'blur(16px)',
      },
    },

    /**
     * Interaction & Motion
     */
    interactions: {
      cursor: { pointer: 'pointer', disabled: 'not-allowed', text: 'text', grab: 'grab', grabbing: 'grabbing' },
      zIndex: { base: '1', modal: '100', tooltip: '200', overlay: '300', sticky: '50' },
      transitions: {
        duration: { fast: '0.15s', medium: '0.3s', slow: '0.5s' },
        easing: {
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeOut: 'ease-out',
          easeIn: 'ease-in',
          spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        },
        property: {
          all: 'all',
          transform: 'transform',
          opacity: 'opacity',
          color: 'color',
          shadow: 'box-shadow',
        },
      },
      hoverEffect: {
        scale: 'scale(1.03)',
        translateY: 'translateY(-2px)',
        shadow: '0px 6px 12px rgba(29, 35, 41, 0.1)',
      },
    },
  };

  return tokens;
}

/**
 * Use tokens from this schema as css variables in your components.
 * For example, use `surfaceColor` as css variable `--surface-color`
 */
export type ApiBankingThemeSchema = ReturnType<typeof apiBankingThemeTokens>;