export interface CreateBeanDTO {
  name: string; description: string; origin: string;
  roastLevel: "light" | "medium" | "medium-dark" | "dark";
  process: "washed" | "natural" | "honey" | "anaerobic";
  category: "single-origin" | "blend" | "decaf" | "espresso";
  tastingNotes: string[]; weightGrams: number; price: number; stock: number; featured: boolean;
}