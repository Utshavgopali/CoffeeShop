import { Router } from "express";
import { listBeans, getBean, getBeanFacetsHandler } from "../controllers/bean.controller";
const router = Router();
router.get("/", listBeans);
router.get("/facets", getBeanFacetsHandler);
router.get("/:id", getBean);
export default router;