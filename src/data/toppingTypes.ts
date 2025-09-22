export interface BaseTopping {
  id: string;
  name: string;
  type: 'base';
  category: 'grain' | 'greens' | 'noodle';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  price: number;
  image?: string;
}

export interface MainTopping {
  id: string;
  name: string;
  type: 'main';
  category: 'protein' | 'vegetable' | 'cheese' | 'nuts' | 'fruit';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number;
  price: number;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image?: string;
}

export interface SauceTopping {
  id: string;
  name: string;
  type: 'sauce';
  category: 'sauce';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number;
  price: number;
  isGlutenFree?: boolean;
  image?: string;
}

export type Topping = BaseTopping | MainTopping | SauceTopping;