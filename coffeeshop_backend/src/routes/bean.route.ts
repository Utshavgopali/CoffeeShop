import { Router } from "express";
import { listBeans, getBean } from "../controllers/bean.controller";
const router = Router();
router.get("/", listBeans);
router.get("/:id", getBean);
export default router;