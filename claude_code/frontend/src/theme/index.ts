/**
 * Theme System - Central Export
 * Combines all design tokens for easy import
 */

import {colors} from './colors';
import {typography} from './typography';
import {spacing, padding, margin, gap} from './spacing';
import {shadows} from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  padding,
  margin,
  gap,
  shadows,

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },

  // Sizing
  size: {
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
    button: {
      sm: {
        height: 32,
        paddingHorizontal: 12,
      },
      md: {
        height: 40,
        paddingHorizontal: 16,
      },
      lg: {
        height: 48,
        paddingHorizontal: 24,
      },
    },
    input: {
      sm: {
        height: 32,
        paddingHorizontal: 12,
      },
      md: {
        height: 40,
        paddingHorizontal: 16,
      },
      lg: {
        height: 48,
        paddingHorizontal: 16,
      },
    },
  },

  // Opacity
  opacity: {
    disabled: 0.5,
    loading: 0.6,
    hover: 0.8,
    pressed: 0.7,
  },

  // Z-Index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
};

export type Theme = typeof theme;

// Re-export individual modules for specific use cases
export {colors} from './colors';
export {typography} from './typography';
export {spacing, padding, margin, gap} from './spacing';
export {shadows} from './shadows';
