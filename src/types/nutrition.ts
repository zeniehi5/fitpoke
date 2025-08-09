export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionProgress {
  current: NutritionGoals;
  goals: NutritionGoals;
  percentages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface MealPlan {
  mealsPerDay: 2 | 3;
  perMealGoals: NutritionGoals;
}