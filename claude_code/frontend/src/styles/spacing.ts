/**
 * Readdy Design System - Spacing
 *
 * Consistent spacing values matching the Readdy design reference
 */

export const spacing = {
  // Base spacing units
  xxs: 2,   // 2px
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  lg: 16,   // 16px
  xl: 24,   // 24px
  xxl: 32,  // 32px
  xxxl: 48, // 48px

  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,
  iconXxl: 64,
  iconXxxl: 80,

  // Border radius
  radiusXs: 4,
  radiusSm: 6,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusFull: 9999,

  // Button heights
  buttonSmall: 32,
  buttonMedium: 40,
  buttonLarge: 48,
  buttonXlarge: 56,

  // Input heights
  inputSmall: 32,
  inputMedium: 40,
  inputLarge: 48,

  // Header heights
  headerHeight: 60,
  headerHeightSmall: 50,

  // Card padding
  cardPaddingSmall: 12,
  cardPaddingMedium: 16,
  cardPaddingLarge: 20,

  // Container padding
  containerPadding: 16,
  containerPaddingLarge: 24,
} as const;

export type SpacingSize = keyof typeof spacing;
