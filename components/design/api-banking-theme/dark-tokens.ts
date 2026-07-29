import { DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { ApiBankingThemeSchema } from "./api-banking-theme-tokens.js";

/**
 * override tokens for the dark theme.
 * overrides the default light theme tokens.
 */
export const darkThemeSchema: DeepPartial<ApiBankingThemeSchema> = {
  colors: {
    primary: {
      default: '#E30613',
      hover: '#F31623',
      active: '#C90512',
    },
    secondary: {
      default: '#49A6EA',
      hover: '#67B8EC',
      active: '#2B94E8',
    },
    surface: {
      background: '#161B22',
      primary: '#1F242C',
      secondary: '#2A303A',
    },
    text: {
      primary: '#F0F6FC',
      default: '#F0F6FC',
      secondary: '#8B949E',
      inverse: '#1D2329',
    },
    status: {
      positive: { default: '#28a745', subtle: 'rgba(40, 167, 69, 0.2)' },
      negative: { default: '#dc3545', subtle: 'rgba(220, 53, 69, 0.2)' },
      warning: { default: '#ffc107', subtle: 'rgba(255, 193, 7, 0.2)' },
      info: { default: '#49A6EA', subtle: 'rgba(73, 166, 234, 0.2)' },
    },
    overlay: 'rgba(10, 10, 10, 0.7)',
    accent: {
      default: '#A64DA6',
      hover: '#B65DB6',
      active: '#963D96',
    },
    surfaceDark: {
      default: '#1A3A5C',
      hover: '#234A72',
      active: '#132A46',
    },
  },
  borders: {
    default: {
      color: '#30363D',
      width: '1px',
      style: 'solid',
    },
    focus: {
      color: '#49A6EA',
      width: '2px',
      style: 'solid',
      offset: '2px',
    },
    radius: {
      small: '4px',
      medium: '8px',
      large: '16px',
    },
  },
  effects: {
    shadows: {
      xs: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      small: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      medium: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      large: '0px 8px 16px rgba(0, 0, 0, 0.4)',
      xLarge: '0px 12px 24px rgba(0, 0, 0, 0.5)',
      inset: 'inset 0px 1px 2px rgba(255, 255, 255, 0.05)',
      raised: '0px 4px 12px rgba(0, 0, 0, 0.3), 0px 2px 4px rgba(0, 0, 0, 0.2)',
    }
  }
};