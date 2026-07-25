import express from "express";
import type { CorsOptions } from "cors";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./database/mongodb";

import userRoutes from "./routes/user.route";
import beanRoutes from "./routes/bean.route";
import cartRoutes from "./routes/cart.route";
import wishlistRoutes from "./routes/wishlist.route";
import notificationRoutes from "./routes/notification.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/beans", beanRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CoffeeShop API is running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});