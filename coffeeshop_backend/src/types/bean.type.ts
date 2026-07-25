import { z } from "zod";

export const BeanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  origin: z.string().min(2, "Origin is required"),
  roastLevel: z.enum(["light", "medium", "medium-dark", "dark"]),
  process: z.enum(["washed", "natural", "honey", "anaerobic"]).default("washed"),
  category: z.enum(["single-origin", "blend", "decaf", "espresso"]).default("single-origin"),
  tastingNotes: z.array(z.string()).default([]),
  weightGrams: z.coerce.number().positive().default(250),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
  featured: z.coerce.boolean().default(false),
});

export const BeanUpdateSchema = BeanSchema.partial();