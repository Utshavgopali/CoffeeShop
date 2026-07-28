export const BEAN_CATEGORIES = [
  { value: "single-origin", label: "Single Origin" },
  { value: "blend", label: "Blend" },
  { value: "espresso", label: "Espresso" },
  { value: "decaf", label: "Decaf" },
] as const;

export const ROAST_LEVELS = [
  { value: "light", label: "Light", dial: "20%", wash: "#e3b872" },
  { value: "medium", label: "Medium", dial: "45%", wash: "#cf9548" },
  { value: "medium-dark", label: "Medium-Dark", dial: "70%", wash: "#b5762f" },
  { value: "dark", label: "Dark", dial: "95%", wash: "#8f5a24" },
] as const;

export const PROCESS_METHODS = [
  { value: "washed", label: "Washed" },
  { value: "natural", label: "Natural" },
  { value: "honey", label: "Honey" },
  { value: "anaerobic", label: "Anaerobic" },
] as const;

export type BeanCategory = (typeof BEAN_CATEGORIES)[number]["value"];
export type RoastLevel = (typeof ROAST_LEVELS)[number]["value"];