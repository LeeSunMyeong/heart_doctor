import {create} from 'zustand';
import {AssessmentForm, AssessmentResult} from '../types';
import {assessmentService, handleApiError, CheckRequest} from '../api';

interface AssessmentState {
  // Form data
  formData: Partial<AssessmentForm>;
  currentStep: number;
  totalSteps: number;

  // Results
  latestResult: AssessmentResult | null;
  results: AssessmentResult[];

  // UI state
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;

  // Form actions
  updateFormData: (data: Partial<AssessmentForm>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  isFormValid: () => boolean;

  // API actions
  submitAssessment: (userId: number) => Promise<AssessmentResult | null>;
  loadHistory: (userId: number) => Promise<void>;

  // Result actions
  setLatestResult: (result: AssessmentResult) => void;
  addResult: (result: AssessmentResult) => void;
  setResults: (results: AssessmentResult[]) => void;
  clearResults: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialFormData: Partial<AssessmentForm> = {
  age: null,
  sex: null,
  chestPainType: null,
  restingBP: null,
  cholesterol: null,
  fastingBS: null,
  restingECG: null,
  maxHR: null,
  exerciseAngina: null,
  oldpeak: null,
  stSlope: null,
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  formData: initialFormData,
  currentStep: 0,
  totalSteps: 3,
  latestResult: null,
  results: [],
  isLoading: false,
  error: null,
  isSubmitting: false,

  // Form actions
  updateFormData: (data: Partial<AssessmentForm>) => {
    const {formData} = get();
    set({
      formData: {
        ...formData,
        ...data,
      },
    });
  },

  setStep: (step: number) => {
    const {totalSteps} = get();
    if (step >= 0 && step < totalSteps) {
      set({currentStep: step});
    }
  },

  nextStep: () => {
    const {currentStep, totalSteps} = get();
    if (currentStep < totalSteps - 1) {
      set({currentStep: currentStep + 1});
    }
  },

  prevStep: () => {
    const {currentStep} = get();
    if (currentStep > 0) {
      set({currentStep: currentStep - 1});
    }
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 0,
      error: null,
      isSubmitting: false,
    });
  },

  isFormValid: () => {
    const {formData} = get();
    const requiredFields: (keyof AssessmentForm)[] = [
      'age',
      'sex',
      'chestPainType',
      'restingBP',
      'cholesterol',
      'fastingBS',
      'restingECG',
      'maxHR',
      'exerciseAngina',
      'oldpeak',
      'stSlope',
    ];

    return requiredFields.every(field => {
      const value = formData[field];
      return value !== null && value !== undefined;
    });
  },

  // API actions
  submitAssessment: async (userId: number) => {
    const {formData, isFormValid} = get();

    if (!isFormValid()) {
      set({error: 'All fields are required'});
      return null;
    }

    set({isSubmitting: true, error: null});

    try {
      const checkRequest: CheckRequest = {
        age: formData.age!,
        sex: formData.sex!,
        restingBP: formData.restingBP!,
        cholesterol: formData.cholesterol!,
        fastingBS: formData.fastingBS!,
        maxHR: formData.maxHR!,
        chestPainType: formData.chestPainType!,
        restingECG: formData.restingECG!,
        exerciseAngina: formData.exerciseAngina!,
        oldpeak: formData.oldpeak!,
        stSlope: formData.stSlope!,
      };

      const {check, prediction} = await assessmentService.submitAssessment(
        checkRequest,
      );

      const result: AssessmentResult = {
        id: prediction.predictionId.toString(),
        date: prediction.createdAt,
        age: check.age,
        sex: check.sex === 'M' ? ('male' as const) : ('female' as const),
        riskLevel: prediction.riskLevel.toLowerCase() as
          | 'low'
          | 'medium'
          | 'high'
          | 'critical',
        confidence: prediction.confidence,
        predictions: prediction.predictions,
        recommendations: prediction.recommendations,
      };

      set({
        latestResult: result,
        results: [result, ...get().results],
        isSubmitting: false,
      });

      return result;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isSubmitting: false});
      return null;
    }
  },

  loadHistory: async (userId: number) => {
    set({isLoading: true, error: null});

    try {
      const checks = await assessmentService.getAssessmentHistory(userId);

      // Transform checks to AssessmentResult format
      // Note: This would need prediction data too - simplified for now
      const results: AssessmentResult[] = checks.map(check => ({
        id: check.checkId.toString(),
        date: check.createdAt,
        age: check.age,
        sex: check.sex === 'M' ? ('male' as const) : ('female' as const),
        riskLevel: 'medium' as const, // Would need to fetch prediction
        confidence: 0.85, // Would need to fetch prediction
        predictions: {},
        recommendations: [],
      }));

      set({results, isLoading: false});
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({error: errorMessage, isLoading: false});
    }
  },

  // Result actions
  setLatestResult: (result: AssessmentResult) => {
    set({latestResult: result});
  },

  addResult: (result: AssessmentResult) => {
    const {results} = get();
    set({
      results: [result, ...results],
      latestResult: result,
    });
  },

  setResults: (results: AssessmentResult[]) => {
    set({results});
  },

  clearResults: () => {
    set({results: [], latestResult: null});
  },

  // Utility
  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },

  setError: (error: string | null) => {
    set({error});
  },

  clearError: () => {
    set({error: null});
  },
}));
