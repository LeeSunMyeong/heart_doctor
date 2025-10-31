/**
 * Voice Test Questions Configuration
 * Maps the 17-question Korean script to AssessmentData fields
 */

export interface VoiceQuestion {
  id: number;
  text: string;
  field: keyof AssessmentData | null;
  type: 'preparation' | 'basic' | 'symptom' | 'completion';
  expectedResponseType: 'yes-no' | 'number' | 'text';
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export interface AssessmentData {
  // Basic Information
  sex: number; // 0: 여성, 1: 남성
  age: number;
  weight: number; // kg
  height: number; // cm
  bodyTemperature: number; // 섭씨
  breathingRate: number; // 회/분

  // Symptoms (0: 없음, 1: 있음)
  chestPainType: number;
  lateralPain: number;
  footPain: number;
  swelling: number;
  chestTightness: number;
  nauseaVomiting: number;
  dizziness: number;
  shortnessOfBreath: number;
  lethargy: number;
  palpitations: number;
}

/**
 * Complete voice test question script
 * Total: 17 questions (1 preparation + 6 basic + 10 symptoms + 1 completion)
 */
export const voiceTestQuestions: VoiceQuestion[] = [
  // 0. Preparation Check
  {
    id: 0,
    text: '심장 닥터의 심장 건강 분석 시간입니다. 고객님 지금 준비되셨나요?',
    field: null,
    type: 'preparation',
    expectedResponseType: 'yes-no',
  },

  // 1. Sex (성별)
  {
    id: 1,
    text: '성별이 어떻게 되시나요? 남성이신가요, 여성이신가요?',
    field: 'sex',
    type: 'basic',
    expectedResponseType: 'text',
  },

  // 2. Age (나이)
  {
    id: 2,
    text: '나이가 어떻게 되시나요?',
    field: 'age',
    type: 'basic',
    expectedResponseType: 'number',
    validationRules: {
      min: 1,
      max: 120,
    },
  },

  // 3. Weight (몸무게)
  {
    id: 3,
    text: '몸무게는 몇 킬로그램이신가요?',
    field: 'weight',
    type: 'basic',
    expectedResponseType: 'number',
    validationRules: {
      min: 20,
      max: 300,
    },
  },

  // 4. Height (키)
  {
    id: 4,
    text: '키는 몇 센티미터이신가요?',
    field: 'height',
    type: 'basic',
    expectedResponseType: 'number',
    validationRules: {
      min: 100,
      max: 250,
    },
  },

  // 5. Body Temperature (체온)
  {
    id: 5,
    text: '체온은 몇 도이신가요?',
    field: 'bodyTemperature',
    type: 'basic',
    expectedResponseType: 'number',
    validationRules: {
      min: 34,
      max: 42,
    },
  },

  // 6. Breathing Rate (호흡)
  {
    id: 6,
    text: '호흡은 1분당 몇 회이신가요?',
    field: 'breathingRate',
    type: 'basic',
    expectedResponseType: 'number',
    validationRules: {
      min: 8,
      max: 40,
    },
  },

  // 7. Chest Pain Type (가슴 통증)
  {
    id: 7,
    text: '가슴 통증이 있으신가요?',
    field: 'chestPainType',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 8. Lateral Pain (옆구리 통증)
  {
    id: 8,
    text: '옆구리 통증이 있으신가요?',
    field: 'lateralPain',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 9. Foot Pain (발 통증)
  {
    id: 9,
    text: '발 통증이 있으신가요?',
    field: 'footPain',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 10. Swelling (부기)
  {
    id: 10,
    text: '부기가 있으신가요?',
    field: 'swelling',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 11. Chest Tightness (가슴 답답함)
  {
    id: 11,
    text: '가슴 답답함이 있으신가요?',
    field: 'chestTightness',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 12. Nausea/Vomiting (구토)
  {
    id: 12,
    text: '구토 증상이 있으신가요?',
    field: 'nauseaVomiting',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 13. Dizziness (현기증)
  {
    id: 13,
    text: '현기증이 있으신가요?',
    field: 'dizziness',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 14. Shortness of Breath (호흡 곤란)
  {
    id: 14,
    text: '호흡 곤란이 있으신가요?',
    field: 'shortnessOfBreath',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 15. Lethargy (무기력증)
  {
    id: 15,
    text: '무기력증이 있으신가요?',
    field: 'lethargy',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 16. Palpitations (심계항진)
  {
    id: 16,
    text: '심계항진 증상이 있으신가요?',
    field: 'palpitations',
    type: 'symptom',
    expectedResponseType: 'yes-no',
  },

  // 17. Completion
  {
    id: 17,
    text: '모든 질문에 대한 답변이 끝났습니다. 대단히 감사합니다.',
    field: null,
    type: 'completion',
    expectedResponseType: 'text',
  },
];

/**
 * Parse voice response to extract numeric values
 * Handles Korean number words and numeric strings
 */
export const parseVoiceNumber = (response: string): number | null => {
  // Remove spaces and convert to lowercase
  const cleaned = response.replace(/\s+/g, '').toLowerCase();

  // Korean number word mapping
  const koreanNumbers: {[key: string]: number} = {
    영: 0,
    일: 1,
    이: 2,
    삼: 3,
    사: 4,
    오: 5,
    육: 6,
    칠: 7,
    팔: 8,
    구: 9,
    십: 10,
    스물: 20,
    서른: 30,
    마흔: 40,
    쉰: 50,
    예순: 60,
    일흔: 70,
    여든: 80,
    아흔: 90,
    백: 100,
  };

  // Try to extract numeric values first
  const numericMatch = cleaned.match(/\d+(\.\d+)?/);
  if (numericMatch) {
    return parseFloat(numericMatch[0]);
  }

  // Try Korean number words
  for (const [word, value] of Object.entries(koreanNumbers)) {
    if (cleaned.includes(word)) {
      return value;
    }
  }

  return null;
};

/**
 * Parse yes/no responses in Korean
 * Returns: 1 for yes, 0 for no, null for unclear
 */
export const parseYesNo = (response: string): number | null => {
  const cleaned = response.replace(/\s+/g, '').toLowerCase();

  // Yes patterns
  const yesPatterns = ['네', '예', '있어요', '있습니다', '맞아요', '그렇습니다'];
  if (yesPatterns.some(pattern => cleaned.includes(pattern))) {
    return 1;
  }

  // No patterns
  const noPatterns = ['아니', '없어요', '없습니다', '아니요', '괜찮아요'];
  if (noPatterns.some(pattern => cleaned.includes(pattern))) {
    return 0;
  }

  return null;
};

/**
 * Parse sex response
 * Returns: 1 for male, 0 for female, null for unclear
 */
export const parseSex = (response: string): number | null => {
  const cleaned = response.replace(/\s+/g, '').toLowerCase();

  // Male patterns
  if (cleaned.includes('남') || cleaned.includes('남성')) {
    return 1;
  }

  // Female patterns
  if (cleaned.includes('여') || cleaned.includes('여성')) {
    return 0;
  }

  return null;
};

/**
 * Validate response against question rules
 */
export const validateResponse = (
  question: VoiceQuestion,
  value: number | null,
): {valid: boolean; error?: string} => {
  if (value === null) {
    return {valid: false, error: '답변을 이해하지 못했습니다. 다시 말씀해 주세요.'};
  }

  const rules = question.validationRules;
  if (!rules) {
    return {valid: true};
  }

  if (rules.min !== undefined && value < rules.min) {
    return {
      valid: false,
      error: `${rules.min} 이상의 값을 입력해 주세요.`,
    };
  }

  if (rules.max !== undefined && value > rules.max) {
    return {
      valid: false,
      error: `${rules.max} 이하의 값을 입력해 주세요.`,
    };
  }

  return {valid: true};
};

/**
 * Get initial empty assessment data
 */
export const getEmptyAssessmentData = (): AssessmentData => ({
  sex: 0,
  age: 0,
  weight: 0,
  height: 0,
  bodyTemperature: 0,
  breathingRate: 0,
  chestPainType: 0,
  lateralPain: 0,
  footPain: 0,
  swelling: 0,
  chestTightness: 0,
  nauseaVomiting: 0,
  dizziness: 0,
  shortnessOfBreath: 0,
  lethargy: 0,
  palpitations: 0,
});
