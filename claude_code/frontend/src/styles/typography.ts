/**
 * Readdy Design System - Typography
 *
 * Font sizes and styles matching the Readdy design reference
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Titles
  title: {
    fontSize: 20,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    lineHeight: 28,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    lineHeight: 32,
  },

  // Subtitles
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    lineHeight: 26,
  },
  subtitleMedium: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },

  // Body text
  body: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },

  // Labels
  label: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
  },

  // Caption
  caption: {
    fontSize: 10,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 14,
  },
  captionMedium: {
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 15,
  },

  // Button text
  button: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
  buttonLarge: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
} as const;

export type TypographyStyle = keyof typeof typography;
