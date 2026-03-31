import express from "express";
import multer from "multer";
import { uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/image", upload.single("image"), uploadProductImage);

export default router;
