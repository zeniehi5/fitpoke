import type { MenuItem } from "@/data/menu";

export function recommendMenus(
  menus: MenuItem[],
  targetCalories: number
): MenuItem[] {
  const combinations = getCombinations(menus, 3);
  let bestScore = -Infinity;
  let bestCombo: MenuItem[] = [];

  for (const combo of combinations) {
    const totalCal = sum(combo.map((m) => m.nutrition.calorie));
    const totalProtein = sum(combo.map((m) => m.nutrition.protein));
    const totalCarb = sum(combo.map((m) => m.nutrition.carb));
    const totalFat = sum(combo.map((m) => m.nutrition.fat));

    const calorieScore = -Math.abs(targetCalories - totalCal);
    const proteinScore = totalProtein;
    const balanceRatio = totalProtein / (totalCarb + totalFat + 1);
    const balanceScore = balanceRatio * 10;

    const totalScore =
      calorieScore * 0.5 + proteinScore * 0.3 + balanceScore * 0.2;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestCombo = combo;
    }
  }

  return bestCombo;
}

function getCombinations<T>(arr: T[], r: number): T[][] {
  const result: T[][] = [];
  const recurse = (start: number, combo: T[]) => {
    if (combo.length === r) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      recurse(i + 1, [...combo, arr[i]]);
    }
  };
  recurse(0, []);
  return result;
}

function sum(arr: number[]) {
  return arr.reduce((acc, val) => acc + val, 0);
}
