import { cloudinary, hasCloudinaryConfig } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";

export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!hasCloudinaryConfig()) {
    throw createHttpError(
      503,
      "Cloudinary is not configured yet. Add your credentials in server/.env to enable uploads.",
    );
  }

  if (!req.file?.buffer) {
    throw createHttpError(400, "Image upload failed. Please choose a valid image file.");
  }

  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "fireworks-shop/products",
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { fetch_format: "auto", quality: "auto" },
    ],
  });

  res.status(201).json({ url: uploadResult.secure_url });
});
