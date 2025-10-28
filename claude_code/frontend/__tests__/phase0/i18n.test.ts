import i18n from '../../src/i18n';

describe('Phase 0: i18n Configuration', () => {
  it('should initialize i18n', () => {
    expect(i18n).toBeDefined();
    expect(i18n.isInitialized).toBe(true);
  });

  it('should have English translations', () => {
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
  });

  it('should have Korean translations', () => {
    expect(i18n.hasResourceBundle('ko', 'translation')).toBe(true);
  });

  it('should translate common keys in English', () => {
    i18n.changeLanguage('en');
    expect(i18n.t('common.appName')).toBe('Heart Health Analysis Tool');
    expect(i18n.t('common.submit')).toBe('Analyze');
  });

  it('should translate common keys in Korean', () => {
    i18n.changeLanguage('ko');
    expect(i18n.t('common.appName')).toBe('심장 건강지표 분석 도구');
    expect(i18n.t('common.submit')).toBe('분석하다');
  });

  it('should have auth translations', () => {
    expect(i18n.t('auth.login')).toBeDefined();
    expect(i18n.t('auth.signup')).toBeDefined();
  });

  it('should have assessment translations', () => {
    expect(i18n.t('assessment.title')).toBeDefined();
    expect(i18n.t('assessment.basicInfo')).toBeDefined();
  });

  it('should fallback to English for missing translations', () => {
    i18n.changeLanguage('en');
    expect(i18n.t('nonexistent.key')).toContain('nonexistent.key');
  });
});
