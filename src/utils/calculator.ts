export type Gender = "male" | "female";

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
