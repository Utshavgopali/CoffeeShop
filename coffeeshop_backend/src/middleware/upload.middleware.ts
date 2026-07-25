import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export { UPLOAD_DIR };

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const multerUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files (jpeg, png, webp, gif) are allowed"));
  },
});

// Wraps multer.single so errors come back as clean 400 JSON.
export function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  multerUpload.single("avatar")(req, res, (err: any) => {
    if (err) {
      const status = err instanceof multer.MulterError ? 400 : err.status ?? 400;
      res.status(status).json({ message: err.message });
      return;
    }
    next();
  });
}
