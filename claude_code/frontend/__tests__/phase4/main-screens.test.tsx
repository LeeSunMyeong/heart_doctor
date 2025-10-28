import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {HomeScreen} from '../../src/screens/main/HomeScreen';
import {ResultScreen} from '../../src/screens/main/ResultScreen';
import {HistoryScreen} from '../../src/screens/main/HistoryScreen';
import {useAssessmentStore} from '../../src/store/assessmentStore';
import {useSubscriptionStore} from '../../src/store/subscriptionStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as any;

const mockRoute = {
  params: {},
} as any;

// Mock stores
jest.mock('../../src/store/assessmentStore');
jest.mock('../../src/store/subscriptionStore');

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Phase 4: Main Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    beforeEach(() => {
      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        formData: {},
        updateFormData: jest.fn(),
        isFormValid: jest.fn().mockReturnValue(false),
        resetForm: jest.fn(),
      });
      (useSubscriptionStore as unknown as jest.Mock).mockReturnValue({
        canUseFeature: jest.fn().mockReturnValue(true),
      });
    });

    it('should render home screen with title', () => {
      const {getByText} = render(<HomeScreen navigation={mockNavigation} />);
      expect(getByText('assessment.title')).toBeTruthy();
      expect(getByText('assessment.description')).toBeTruthy();
    });

    it('should render form sections', () => {
      const {getByText} = render(<HomeScreen navigation={mockNavigation} />);
      expect(getByText('assessment.basicInfo')).toBeTruthy();
      expect(getByText('assessment.vitalSigns')).toBeTruthy();
      expect(getByText('assessment.heartMetrics')).toBeTruthy();
    });

    it('should render submit and reset buttons', () => {
      const {getAllByText} = render(<HomeScreen navigation={mockNavigation} />);
      expect(getAllByText('common.submit').length).toBeGreaterThan(0);
      expect(getAllByText('common.reset').length).toBeGreaterThan(0);
    });

    it('should call resetForm when reset button is pressed', () => {
      const mockResetForm = jest.fn();
      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        formData: {},
        updateFormData: jest.fn(),
        isFormValid: jest.fn().mockReturnValue(false),
        resetForm: mockResetForm,
      });

      const {getAllByText} = render(<HomeScreen navigation={mockNavigation} />);
      const resetButtons = getAllByText('common.reset');
      fireEvent.press(resetButtons[0]);

      expect(mockResetForm).toHaveBeenCalled();
    });
  });

  describe('ResultScreen', () => {
    it('should show empty state when no result', () => {
      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        latestResult: null,
      });

      const {getByText} = render(
        <ResultScreen navigation={mockNavigation} route={mockRoute} />,
      );

      expect(getByText('result.noResult')).toBeTruthy();
      expect(getByText('result.goToAssessment')).toBeTruthy();
    });

    it('should render result when available', () => {
      const mockResult = {
        id: '1',
        formData: {
          age: 45,
          sex: 'M' as const,
          chestPainType: 1,
          restingBP: 120,
          cholesterol: 200,
          fastingBS: 0,
          restingECG: 0,
          maxHR: 150,
          exerciseAngina: false,
          oldpeak: 1.0,
          stSlope: 1,
        },
        predictions: {
          normal: 0.7,
          angina: 0.1,
          myocardialInfarction: 0.05,
          arrhythmia: 0.05,
          heartFailure: 0.05,
          valvularDisease: 0.05,
        },
        riskLevel: 'low' as const,
        confidence: 0.85,
        recommendations: ['Regular exercise', 'Healthy diet'],
        createdAt: '2025-10-23T00:00:00Z',
      };

      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        latestResult: mockResult,
      });

      const {getByText} = render(
        <ResultScreen navigation={mockNavigation} route={mockRoute} />,
      );

      expect(getByText('result.title')).toBeTruthy();
      expect(getByText('result.riskLevel')).toBeTruthy();
      expect(getByText('result.predictions')).toBeTruthy();
      expect(getByText('result.recommendations')).toBeTruthy();
    });

    it('should navigate to home on new assessment button press', () => {
      const mockResult = {
        id: '1',
        formData: {} as any,
        predictions: {
          normal: 0.7,
          angina: 0.1,
          myocardialInfarction: 0.05,
          arrhythmia: 0.05,
          heartFailure: 0.05,
          valvularDisease: 0.05,
        },
        riskLevel: 'low' as const,
        confidence: 0.85,
        recommendations: [],
        createdAt: '2025-10-23T00:00:00Z',
      };

      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        latestResult: mockResult,
      });

      const {getByText} = render(
        <ResultScreen navigation={mockNavigation} route={mockRoute} />,
      );

      fireEvent.press(getByText('result.newAssessment'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });

  describe('HistoryScreen', () => {
    it('should show empty state when no history', () => {
      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        results: [],
        setLatestResult: jest.fn(),
      });

      const {getByText} = render(<HistoryScreen navigation={mockNavigation} />);

      expect(getByText('history.noHistory')).toBeTruthy();
      expect(getByText('history.noHistoryDesc')).toBeTruthy();
      expect(getByText('history.startAssessment')).toBeTruthy();
    });

    it('should render history list when results exist', () => {
      const mockResults = [
        {
          id: '1',
          formData: {age: 45, sex: 'M' as const} as any,
          predictions: {
            normal: 0.7,
            angina: 0.1,
            myocardialInfarction: 0.05,
            arrhythmia: 0.05,
            heartFailure: 0.05,
            valvularDisease: 0.05,
          },
          riskLevel: 'low' as const,
          confidence: 0.85,
          recommendations: [],
          createdAt: '2025-10-23T00:00:00Z',
        },
      ];

      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        results: mockResults,
        setLatestResult: jest.fn(),
      });

      const {getByText} = render(<HistoryScreen navigation={mockNavigation} />);

      expect(getByText('history.title')).toBeTruthy();
      expect(getByText('history.subtitle')).toBeTruthy();
    });

    it('should navigate to home on start assessment button press', () => {
      (useAssessmentStore as unknown as jest.Mock).mockReturnValue({
        results: [],
        setLatestResult: jest.fn(),
      });

      const {getByText} = render(<HistoryScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('history.startAssessment'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
});
