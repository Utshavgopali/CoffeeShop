import { Router } from "express";
import { protect } from "../../middleware/auth";
import { adminOnly } from "../../middleware/admin";
import { uploadBeanImage } from "../../middleware/uploads";
import {
  createBean,
  updateBean,
  deleteBean,
  adminListBeans,
  adminGetBean,
} from "../../controllers/admin/bean.controller";

const router = Router();

router.use(protect, adminOnly);

router.get("/", adminListBeans);
router.get("/:id", adminGetBean);
router.post("/", uploadBeanImage.array("images", 5), createBean);
router.put("/:id", uploadBeanImage.array("images", 5), updateBean);
router.delete("/:id", deleteBean);

export default router;