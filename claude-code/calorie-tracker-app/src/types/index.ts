export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface LogEntry {
  id: number;
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
  mealCategory: MealCategory;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface AiNutritionItem {
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AiNutritionResponse {
  description: string;
  items: AiNutritionItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
