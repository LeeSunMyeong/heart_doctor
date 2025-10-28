/**
 * Readdy Design System - Colors
 *
 * Primary color palette matching the Readdy design reference
 */

export const colors = {
  // Primary
  primary: '#EF4444',        // red-500 - main accent color
  primaryDark: '#DC2626',    // red-600 - hover/pressed state
  primaryLight: '#FEE2E2',   // red-100 - light backgrounds

  // Background
  background: '#FFFFFF',     // white - main background
  backgroundGray: '#F3F4F6', // gray-100 - secondary background
  backgroundDark: '#F9FAFB', // gray-50 - cards and sections

  // Text
  text: '#000000',           // black - primary text
  textSecondary: '#374151',  // gray-700 - secondary text
  textTertiary: '#6B7280',   // gray-500 - tertiary text
  textDisabled: '#9CA3AF',   // gray-400 - disabled text

  // Border
  border: '#D1D5DB',         // gray-300 - default borders
  borderLight: '#E5E7EB',    // gray-200 - light borders
  borderDark: '#9CA3AF',     // gray-400 - dark borders

  // Status
  success: '#10B981',        // green-600 - success state
  successLight: '#D1FAE5',   // green-100 - success background
  warning: '#F59E0B',        // yellow-400 - warning state
  warningLight: '#FEF3C7',   // yellow-100 - warning background
  error: '#EF4444',          // red-500 - error state
  errorLight: '#FEE2E2',     // red-100 - error background
  info: '#3B82F6',           // blue-500 - info state
  infoLight: '#DBEAFE',      // blue-100 - info background

  // Special
  premium: '#8B5CF6',        // purple-600 - premium features
  premiumLight: '#EDE9FE',   // purple-100 - premium background
  kakao: '#FEE500',          // Kakao official yellow
  google: '#FFFFFF',         // Google white background

  // Gradient colors
  gradientBlue: '#DBEAFE',   // blue-100
  gradientPurple: '#F5F3FF', // purple-50
  gradientPink: '#FCE7F3',   // pink-100

  // Button colors
  buttonActive: '#000000',   // black - selected button background
  buttonInactive: '#FFFFFF', // white - unselected button background
  buttonBorder: '#D1D5DB',   // gray-300 - button border

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparentWhite: 'rgba(255, 255, 255, 0.9)',
  transparentWhiteLight: 'rgba(255, 255, 255, 0.8)',
} as const;

export type ColorName = keyof typeof colors;
