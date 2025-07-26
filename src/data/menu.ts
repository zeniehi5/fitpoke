export interface Nutrition {
  calorie: number;
  protein: number;
  carb: number;
  fat: number;
}

export interface MenuItem {
  name: string;
  image: string;
  nutrition: Nutrition;
}

export const menus: MenuItem[] = [
  {
    name: "소고기 포케",
    image: "https://cdn.imweb.me/thumbnail/20250706/5a34364b2d02b.jpg",
    nutrition: {
      calorie: 340,
      protein: 35,
      carb: 15,
      fat: 12,
    },
  },
  {
    name: "연어 포케",
    image: "https://cdn.imweb.me/thumbnail/20250706/194adc7d1ec13.jpg",
    nutrition: {
      calorie: 420,
      protein: 30,
      carb: 20,
      fat: 18,
    },
  },
  {
    name: "새우 포케",
    image: "https://cdn.imweb.me/thumbnail/20250706/b211cb37be98b.jpg",
    nutrition: {
      calorie: 310,
      protein: 22,
      carb: 12,
      fat: 14,
    },
  },
];
