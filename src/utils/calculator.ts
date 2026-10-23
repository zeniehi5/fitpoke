import type { NutritionGoals } from "@/types/nutrition";

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type Goal = "lean-massup" | "bulkup" | "fat-loss";

/** 하루 식사 횟수 기준 (한 끼 권장량 = 하루 목표 / MEALS_PER_DAY) */
export const MEALS_PER_DAY = 2.5;

/**
 * 목표별 칼로리 보정 계수와 탄단지 에너지 비율
 */
export const GOAL_PROFILES: Record<
  Goal,
  {
    label: string;
    calorieFactor: number;
    macros: { protein: number; carbs: number; fat: number };
  }
> = {
  "fat-loss": {
    label: "다이어트",
    calorieFactor: 0.8, // 유지 칼로리 -20%
    macros: { protein: 0.4, carbs: 0.3, fat: 0.3 },
  },
  "lean-massup": {
    label: "린 메스업",
    calorieFactor: 1.1, // 유지 칼로리 +10%
    macros: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  },
  bulkup: {
    label: "벌크업",
    calorieFactor: 1.2, // 유지 칼로리 +20%
    macros: { protein: 0.25, carbs: 0.5, fat: 0.25 },
  },
};

/**
 * BMI = weight / (height in meter)^2
 */
export function calculateBMI(height: number, weight: number): number {
  if (height <= 0) {
    throw new Error("Height must be greater than 0 for BMI calculation.");
  }

  const bmi = weight / Math.pow(height / 100, 2);
  return Math.round(bmi * 10) / 10;
}

/**
 * BMR 계산
 */
export function calculateBMR(
  gender: Gender,
  height: number,
  weight: number,
  age: number
): number {
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return Math.round(bmr * 10) / 10;
}

/**
 * 하루 권장 섭취 칼로리
 */
export function calculateRecommendedIntake(bmr: number): number {
  const activityFactor = 1.2;
  return Math.round(bmr * activityFactor);
}

/**
 * 활동 수준에 따른 하루 권장 칼로리 계산
 */
export function calculateRecommendedCalories(bmr: number, activityLevel: ActivityLevel): number {
  const activityFactors = {
    "sedentary": 1.2,      // 좌식 생활
    "light": 1.375,        // 가벼운 활동
    "moderate": 1.55,      // 보통 활동
    "active": 1.725,       // 활발한 활동
    "very-active": 1.9     // 매우 활발한 활동
  };
  
  const factor = activityFactors[activityLevel] || 1.2;
  return Math.round(bmr * factor);
}

/**
 * 목표를 반영한 하루 목표 칼로리
 */
export function calculateTargetCalories(maintenanceCalories: number, goal: Goal): number {
  return Math.round(maintenanceCalories * GOAL_PROFILES[goal].calorieFactor);
}

/**
 * 목표별 탄단지 비율에 따른 한 끼 영양 목표
 */
export function calculateMealGoals(dailyCalories: number, goal: Goal): NutritionGoals {
  const perMealCalories = Math.round(dailyCalories / MEALS_PER_DAY);
  const { macros } = GOAL_PROFILES[goal];

  return {
    calories: perMealCalories,
    protein: Math.round((perMealCalories * macros.protein) / 4),
    carbs: Math.round((perMealCalories * macros.carbs) / 4),
    fat: Math.round((perMealCalories * macros.fat) / 9),
    fiber: 10,
  };
}

/**
 * BMI 상태 (대한비만학회 기준)
 */
export function getBmiStatus(bmi: number): string {
  if (bmi < 18.5) return "저체중";
  if (bmi < 23) return "정상";
  if (bmi < 25) return "과체중";
  if (bmi < 30) return "비만";
  return "고도비만";
}
