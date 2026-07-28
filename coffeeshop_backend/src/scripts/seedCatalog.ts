import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../database/mongodb";
import Bean, { type IBean } from "../models/bean.model";

dotenv.config();

type SeedBean = Pick<
  IBean,
  | "name"
  | "description"
  | "origin"
  | "roastLevel"
  | "process"
  | "category"
  | "tastingNotes"
  | "weightGrams"
  | "price"
  | "stock"
  | "featured"
  | "images"
>;

const beans: SeedBean[] = [
  {
    name: "Arabica Light Roast",
    description: "The classic specialty species roasted light to preserve its natural sweetness, floral aroma, and bright, tea-like acidity.",
    origin: "Ethiopia",
    roastLevel: "light",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Jasmine", "Citrus", "Honey"],
    weightGrams: 250,
    price: 900,
    stock: 50,
    featured: true,
    images: ["/uploads/beans/arabica-light.jpg"],
  },
  {
    name: "Arabica Medium Roast",
    description: "A balanced, everyday roast that softens Arabica's acidity into a smooth cup of caramel sweetness and orchard-fruit warmth.",
    origin: "Ethiopia",
    roastLevel: "medium",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Caramel", "Red Apple", "Almond"],
    weightGrams: 250,
    price: 900,
    stock: 60,
    featured: true,
    images: ["/uploads/beans/arabica-medium.jpg"],
  },
  {
    name: "Arabica Dark Roast",
    description: "Roasted longer for a bold, full-bodied cup with rich chocolate depth and a lingering, low-acid finish.",
    origin: "Ethiopia",
    roastLevel: "dark",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Dark Chocolate", "Toasted Nut", "Molasses"],
    weightGrams: 250,
    price: 900,
    stock: 45,
    featured: false,
    images: ["/uploads/beans/arabica-dark.jpg"],
  },
  {
    name: "Robusta Light Roast",
    description: "An unusually light take on Robusta, kept bright to highlight its grainy sweetness and higher caffeine kick without heavy bitterness.",
    origin: "Vietnam",
    roastLevel: "light",
    process: "natural",
    category: "single-origin",
    tastingNotes: ["Grain", "Peanut", "Brown Sugar"],
    weightGrams: 250,
    price: 650,
    stock: 55,
    featured: false,
    images: ["/uploads/beans/robusta-light.jpg"],
  },
  {
    name: "Robusta Medium Roast",
    description: "Bold and full-bodied with the earthy, nutty backbone Robusta is known for, plus the extra caffeine punch that makes it an espresso-blend staple.",
    origin: "Vietnam",
    roastLevel: "medium",
    process: "natural",
    category: "single-origin",
    tastingNotes: ["Earthy", "Dark Cocoa", "Toasted Grain"],
    weightGrams: 250,
    price: 650,
    stock: 70,
    featured: false,
    images: ["/uploads/beans/robusta-medium.jpg"],
  },
  {
    name: "Robusta Dark Roast",
    description: "A heavy, smoky dark roast built for crema-rich espresso — intense, bittersweet, and unmistakably bold.",
    origin: "Vietnam",
    roastLevel: "dark",
    process: "natural",
    category: "espresso",
    tastingNotes: ["Smoke", "Bitter Cocoa", "Roasted Grain"],
    weightGrams: 250,
    price: 680,
    stock: 65,
    featured: true,
    images: ["/uploads/beans/robusta-dark.jpg"],
  },
  {
    name: "Liberica Light Roast",
    description: "A rare, distinctive species roasted light to showcase its signature floral, almost fruity aroma with a woody undertone.",
    origin: "Philippines",
    roastLevel: "light",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Floral", "Jackfruit", "Cedar"],
    weightGrams: 250,
    price: 1050,
    stock: 20,
    featured: true,
    images: ["/uploads/beans/liberica-light.jpg"],
  },
  {
    name: "Liberica Medium Roast",
    description: "Liberica's famous smoky-woody character comes forward at medium roast, rounded out by dried fruit sweetness.",
    origin: "Philippines",
    roastLevel: "medium",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Dried Fruit", "Smoke", "Cedar"],
    weightGrams: 250,
    price: 1050,
    stock: 22,
    featured: false,
    images: ["/uploads/beans/liberica-medium.jpg"],
  },
  {
    name: "Liberica Dark Roast",
    description: "A deep, smoky dark roast that leans fully into Liberica's rustic, woody profile for a bold and unusual cup.",
    origin: "Philippines",
    roastLevel: "dark",
    process: "washed",
    category: "single-origin",
    tastingNotes: ["Dark Wood", "Smoke", "Dried Fig"],
    weightGrams: 250,
    price: 1050,
    stock: 18,
    featured: false,
    images: ["/uploads/beans/liberica-dark.jpg"],
  },
  {
    name: "Excelsa Light Roast",
    description: "A tart, vibrant species roasted light to bring out its unusually fruity, almost wine-like brightness.",
    origin: "Malaysia",
    roastLevel: "light",
    process: "natural",
    category: "single-origin",
    tastingNotes: ["Tart Cherry", "Citrus", "Tamarind"],
    weightGrams: 250,
    price: 1000,
    stock: 25,
    featured: false,
    images: ["/uploads/beans/excelsa-light.jpg"],
  },
  {
    name: "Excelsa Medium Roast",
    description: "Excelsa's tangy, dark-fruited character balances beautifully with medium-roast sweetness for a complex, layered cup.",
    origin: "Malaysia",
    roastLevel: "medium",
    process: "natural",
    category: "single-origin",
    tastingNotes: ["Dried Fig", "Tamarind", "Spice"],
    weightGrams: 250,
    price: 1000,
    stock: 28,
    featured: true,
    images: ["/uploads/beans/excelsa-medium.jpg"],
  },
  {
    name: "Excelsa Dark Roast",
    description: "Bold and tart in equal measure — a dark roast that keeps Excelsa's fruit-forward edge under a smoky, full-bodied finish.",
    origin: "Malaysia",
    roastLevel: "dark",
    process: "natural",
    category: "single-origin",
    tastingNotes: ["Tart Cherry", "Smoke", "Dark Fruit"],
    weightGrams: 250,
    price: 1000,
    stock: 20,
    featured: false,
    images: ["/uploads/beans/excelsa-dark.jpg"],
  },
];

async function seed() {
  await connectDB();

  const keepNames = beans.map((b) => b.name);
  const { deletedCount } = await Bean.deleteMany({ name: { $nin: keepNames } });
  if (deletedCount) console.log(`Removed ${deletedCount} old catalog bean(s).`);

  for (const bean of beans) {
    await Bean.findOneAndUpdate(
      { name: bean.name },
      { $set: bean },
      { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`Upserted: ${bean.name}`);
  }

  console.log(`\nSeeded ${beans.length} beans.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
