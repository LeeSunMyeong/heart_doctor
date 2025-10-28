import {theme, colors, typography, spacing, shadows} from '../../src/theme';

describe('Phase 1: Theme System', () => {
  describe('Colors', () => {
    it('should have primary color palette', () => {
      expect(colors.primary).toBeDefined();
      expect(colors.primary[500]).toBe('#3B82F6');
    });

    it('should have semantic colors', () => {
      expect(colors.success).toBeDefined();
      expect(colors.error).toBeDefined();
      expect(colors.warning).toBeDefined();
      expect(colors.info).toBeDefined();
    });

    it('should have functional colors', () => {
      expect(colors.background).toBeDefined();
      expect(colors.text).toBeDefined();
      expect(colors.border).toBeDefined();
    });

    it('should have complete color scales', () => {
      const colorScales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

      colorScales.forEach(scale => {
        expect(colors.primary[scale]).toBeDefined();
        expect(colors.success[scale]).toBeDefined();
        expect(colors.error[scale]).toBeDefined();
      });
    });
  });

  describe('Typography', () => {
    it('should have font sizes defined', () => {
      expect(typography.fontSize.xs).toBe(12);
      expect(typography.fontSize.sm).toBe(14);
      expect(typography.fontSize.base).toBe(16);
      expect(typography.fontSize.lg).toBe(18);
    });

    it('should have font weights defined', () => {
      expect(typography.fontWeight.normal).toBe('400');
      expect(typography.fontWeight.medium).toBe('500');
      expect(typography.fontWeight.semibold).toBe('600');
      expect(typography.fontWeight.bold).toBe('700');
    });

    it('should have text styles defined', () => {
      expect(typography.textStyles.h1).toBeDefined();
      expect(typography.textStyles.body).toBeDefined();
      expect(typography.textStyles.button).toBeDefined();
    });

    it('should have correct h1 style', () => {
      expect(typography.textStyles.h1.fontSize).toBe(36);
      expect(typography.textStyles.h1.fontWeight).toBe('700');
    });
  });

  describe('Spacing', () => {
    it('should have spacing scale based on 4px', () => {
      expect(spacing[1]).toBe(4);
      expect(spacing[2]).toBe(8);
      expect(spacing[4]).toBe(16);
      expect(spacing[8]).toBe(32);
    });

    it('should have padding presets', () => {
      expect(theme.padding.sm).toBe(8);
      expect(theme.padding.md).toBe(16);
      expect(theme.padding.lg).toBe(24);
    });

    it('should have margin presets', () => {
      expect(theme.margin.sm).toBe(8);
      expect(theme.margin.md).toBe(16);
      expect(theme.margin.lg).toBe(24);
    });
  });

  describe('Shadows', () => {
    it('should have shadow levels', () => {
      expect(shadows.none).toBeDefined();
      expect(shadows.sm).toBeDefined();
      expect(shadows.base).toBeDefined();
      expect(shadows.lg).toBeDefined();
    });

    it('should have correct shadow properties', () => {
      expect(shadows.base.shadowColor).toBe('#000');
      expect(shadows.base.shadowOpacity).toBe(0.1);
      expect(shadows.base.elevation).toBe(2);
    });

    it('should have increasing elevation values', () => {
      expect(shadows.sm.elevation).toBeLessThan(shadows.base.elevation);
      expect(shadows.base.elevation).toBeLessThan(shadows.md.elevation);
      expect(shadows.md.elevation).toBeLessThan(shadows.lg.elevation);
    });
  });

  describe('Border Radius', () => {
    it('should have border radius scales', () => {
      expect(theme.borderRadius.none).toBe(0);
      expect(theme.borderRadius.sm).toBe(4);
      expect(theme.borderRadius.base).toBe(8);
      expect(theme.borderRadius.full).toBe(9999);
    });
  });

  describe('Sizing', () => {
    it('should have icon sizes', () => {
      expect(theme.size.icon.sm).toBe(20);
      expect(theme.size.icon.md).toBe(24);
      expect(theme.size.icon.lg).toBe(32);
    });

    it('should have button sizes', () => {
      expect(theme.size.button.md.height).toBe(40);
      expect(theme.size.button.md.paddingHorizontal).toBe(16);
    });

    it('should have input sizes', () => {
      expect(theme.size.input.md.height).toBe(40);
      expect(theme.size.input.md.paddingHorizontal).toBe(16);
    });
  });

  describe('Z-Index', () => {
    it('should have z-index layers', () => {
      expect(theme.zIndex.base).toBe(0);
      expect(theme.zIndex.modal).toBeGreaterThan(theme.zIndex.dropdown);
      expect(theme.zIndex.tooltip).toBeGreaterThan(theme.zIndex.modal);
    });
  });

  describe('Theme Integration', () => {
    it('should export complete theme object', () => {
      expect(theme.colors).toBeDefined();
      expect(theme.typography).toBeDefined();
      expect(theme.spacing).toBeDefined();
      expect(theme.shadows).toBeDefined();
    });

    it('should have consistent color references', () => {
      expect(theme.colors.primary[500]).toBe(colors.primary[500]);
    });
  });
});
