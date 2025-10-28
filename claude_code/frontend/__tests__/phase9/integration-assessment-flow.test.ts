/**
 * Phase 9: Integration Tests - Assessment Flow
 * 평가 플로우 통합 테스트 (폼 작성 → 제출 → 결과 저장)
 */

import {describe, it, expect, beforeEach} from '@jest/globals';
import {useAssessmentStore} from '../../src/store/assessmentStore';
import type {AssessmentForm, AssessmentResult} from '../../src/types';

describe('Phase 9: Assessment Flow Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useAssessmentStore.getState().resetForm();
    useAssessmentStore.getState().clearResults();
  });

  describe('Form Data Management', () => {
    it('should complete full assessment form step by step', () => {
      // Step 1: Basic Information
      useAssessmentStore.getState().updateFormData({
        age: 45,
        sex: 'male',
      });

      expect(useAssessmentStore.getState().formData.age).toBe(45);
      expect(useAssessmentStore.getState().formData.sex).toBe('male');

      // Step 2: Health Metrics
      useAssessmentStore.getState().updateFormData({
        restingBP: 120,
        cholesterol: 200,
        fastingBS: 100,
        maxHR: 150,
      });

      expect(useAssessmentStore.getState().formData.restingBP).toBe(120);
      expect(useAssessmentStore.getState().formData.cholesterol).toBe(200);

      // Step 3: Symptoms
      useAssessmentStore.getState().updateFormData({
        chestPainType: 1,
        restingECG: 0,
        exerciseAngina: false,
        oldpeak: 1.0,
        stSlope: 1,
      });

      expect(useAssessmentStore.getState().formData.chestPainType).toBe(1);
      expect(useAssessmentStore.getState().formData.exerciseAngina).toBe(false);
    });

    it('should validate complete form data', () => {
      // Incomplete form
      expect(useAssessmentStore.getState().isFormValid()).toBe(false);

      // Complete form
      const completeFormData: Partial<AssessmentForm> = {
        age: 50,
        sex: 'male',
        chestPainType: 0,
        restingBP: 120,
        cholesterol: 200,
        fastingBS: 100,
        restingECG: 0,
        maxHR: 150,
        exerciseAngina: false,
        oldpeak: 1.0,
        stSlope: 1,
      };

      useAssessmentStore.getState().updateFormData(completeFormData);

      expect(useAssessmentStore.getState().isFormValid()).toBe(true);
    });
  });

  describe('Step Navigation', () => {
    it('should navigate through assessment steps', () => {
      // Initial step
      expect(useAssessmentStore.getState().currentStep).toBe(0);

      // Next step
      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(1);

      // Next step again
      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(2);

      // Cannot go beyond last step
      useAssessmentStore.getState().nextStep();
      expect(useAssessmentStore.getState().currentStep).toBe(2); // totalSteps - 1

      // Go back
      useAssessmentStore.getState().prevStep();
      expect(useAssessmentStore.getState().currentStep).toBe(1);

      // Cannot go before first step
      useAssessmentStore.getState().setStep(0);
      useAssessmentStore.getState().prevStep();
      expect(useAssessmentStore.getState().currentStep).toBe(0);
    });

    it('should allow direct step navigation', () => {
      useAssessmentStore.getState().setStep(2);
      expect(useAssessmentStore.getState().currentStep).toBe(2);

      useAssessmentStore.getState().setStep(0);
      expect(useAssessmentStore.getState().currentStep).toBe(0);

      // Invalid step number should not change current step
      useAssessmentStore.getState().setStep(10);
      expect(useAssessmentStore.getState().currentStep).toBe(0);
    });
  });

  describe('Result Management', () => {
    it('should add and manage assessment results', () => {
      const mockResult: AssessmentResult = {
        id: '1',
        date: new Date().toISOString(),
        age: 45,
        sex: 'male',
        riskLevel: 'medium',
        confidence: 0.85,
        predictions: {
          heartDisease: 0.45,
          normalHeart: 0.55,
        },
        recommendations: [
          'Regular exercise recommended',
          'Monitor blood pressure',
        ],
      };

      // Add result
      useAssessmentStore.getState().addResult(mockResult);

      // Verify result added
      expect(useAssessmentStore.getState().results.length).toBe(1);
      expect(useAssessmentStore.getState().latestResult).toEqual(mockResult);
      expect(useAssessmentStore.getState().results[0].id).toBe('1');
    });

    it('should maintain multiple results in order', () => {
      const result1: AssessmentResult = {
        id: '1',
        date: '2025-01-01T00:00:00Z',
        age: 45,
        sex: 'male',
        riskLevel: 'low',
        confidence: 0.9,
        predictions: {},
        recommendations: [],
      };

      const result2: AssessmentResult = {
        id: '2',
        date: '2025-01-02T00:00:00Z',
        age: 45,
        sex: 'male',
        riskLevel: 'medium',
        confidence: 0.85,
        predictions: {},
        recommendations: [],
      };

      useAssessmentStore.getState().addResult(result1);
      useAssessmentStore.getState().addResult(result2);

      // Most recent should be first
      expect(useAssessmentStore.getState().results.length).toBe(2);
      expect(useAssessmentStore.getState().results[0].id).toBe('2');
      expect(useAssessmentStore.getState().latestResult?.id).toBe('2');
    });

    it('should clear all results', () => {
      // Add some results
      useAssessmentStore.getState().addResult({
        id: '1',
        date: new Date().toISOString(),
        age: 45,
        sex: 'male',
        riskLevel: 'low',
        confidence: 0.9,
        predictions: {},
        recommendations: [],
      });

      expect(useAssessmentStore.getState().results.length).toBe(1);

      // Clear results
      useAssessmentStore.getState().clearResults();

      expect(useAssessmentStore.getState().results.length).toBe(0);
      expect(useAssessmentStore.getState().latestResult).toBeNull();
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      // Fill in form
      useAssessmentStore.getState().updateFormData({
        age: 45,
        sex: 'male',
        restingBP: 120,
      });

      useAssessmentStore.getState().setStep(2);

      // Reset
      useAssessmentStore.getState().resetForm();

      // Verify reset
      expect(useAssessmentStore.getState().currentStep).toBe(0);
      expect(useAssessmentStore.getState().formData.age).toBeNull();
      expect(useAssessmentStore.getState().formData.sex).toBeNull();
      expect(useAssessmentStore.getState().formData.restingBP).toBeNull();
      expect(useAssessmentStore.getState().error).toBeNull();
    });
  });

  describe('Complete Assessment Flow', () => {
    it('should handle complete assessment submission flow', () => {
      // Step 1: Fill basic info
      useAssessmentStore.getState().updateFormData({
        age: 50,
        sex: 'male',
      });
      useAssessmentStore.getState().nextStep();

      // Step 2: Fill health metrics
      useAssessmentStore.getState().updateFormData({
        restingBP: 120,
        cholesterol: 200,
        fastingBS: 100,
        maxHR: 150,
      });
      useAssessmentStore.getState().nextStep();

      // Step 3: Fill symptoms
      useAssessmentStore.getState().updateFormData({
        chestPainType: 0,
        restingECG: 0,
        exerciseAngina: false,
        oldpeak: 1.0,
        stSlope: 1,
      });

      // Validate complete form
      expect(useAssessmentStore.getState().isFormValid()).toBe(true);

      // Simulate result
      const formData = useAssessmentStore.getState().formData;
      const mockResult: AssessmentResult = {
        id: '1',
        date: new Date().toISOString(),
        age: formData.age!,
        sex: formData.sex!,
        riskLevel: 'low',
        confidence: 0.92,
        predictions: {
          heartDisease: 0.08,
          normalHeart: 0.92,
        },
        recommendations: [
          'Maintain healthy lifestyle',
          'Annual checkup recommended',
        ],
      };

      useAssessmentStore.getState().addResult(mockResult);

      // Verify completion
      expect(useAssessmentStore.getState().results.length).toBe(1);
      expect(useAssessmentStore.getState().latestResult?.riskLevel).toBe('low');

      // Reset for new assessment
      useAssessmentStore.getState().resetForm();
      expect(useAssessmentStore.getState().currentStep).toBe(0);
      expect(useAssessmentStore.getState().formData.age).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle form validation errors', () => {
      // Try to validate incomplete form
      expect(useAssessmentStore.getState().isFormValid()).toBe(false);

      // Set error
      useAssessmentStore.getState().setError('Please complete all fields');
      expect(useAssessmentStore.getState().error).toBe('Please complete all fields');

      // Clear error
      useAssessmentStore.getState().clearError();
      expect(useAssessmentStore.getState().error).toBeNull();
    });

    it('should manage loading states', () => {
      useAssessmentStore.getState().setLoading(true);
      expect(useAssessmentStore.getState().isLoading).toBe(true);

      useAssessmentStore.getState().setLoading(false);
      expect(useAssessmentStore.getState().isLoading).toBe(false);
    });
  });
});
