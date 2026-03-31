import Product from "../models/Product.js";
import {
  invalidateProductQueryCache,
  readProductQueryCache,
  writeProductQueryCache,
} from "../utils/productQueryCache.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";

const normalizeImages = (payload) => {
  const imageList = Array.isArray(payload.images)
    ? payload.images
    : typeof payload.images === "string"
      ? payload.images
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [];

  if (payload.imageUrl) {
    imageList.unshift(payload.imageUrl);
  }

  return [...new Set(imageList.filter(Boolean))];
};

const mapProductPayload = (payload) => ({
  name: payload.name?.trim(),
  price: Number(payload.price),
  description: payload.description?.trim(),
  category: payload.category?.trim(),
  audience: payload.audience?.trim() || "All Ages",
  images: normalizeImages(payload),
  stock: Number(payload.stock),
  featured: payload.featured === true || payload.featured === "true",
  tags:
    typeof payload.tags === "string"
      ? payload.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : Array.isArray(payload.tags)
        ? payload.tags
        : [],
  specs: {
    packSize: payload.specs?.packSize ?? payload.packSize ?? "",
  },
});

const validateProductPayload = (product) => {
  if (!product.name || !product.description || !product.category) {
    throw createHttpError(400, "Name, description, and category are required.");
  }

  if (Number.isNaN(product.price) || product.price < 0) {
    throw createHttpError(400, "Price must be a valid positive number.");
  }

  if (Number.isNaN(product.stock) || product.stock < 0) {
    throw createHttpError(400, "Stock must be a valid positive number.");
  }

  if (!product.images.length) {
    throw createHttpError(400, "Add at least one image URL or upload one image.");
  }
};

const PRODUCT_CACHE_HEADER = "public, max-age=60, stale-while-revalidate=300";

const parsePositiveInteger = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

export const getProducts = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const category = req.query.category?.trim();
  const audience = req.query.audience?.trim();
  const featured = req.query.featured;
  const inStock = req.query.inStock;
  const includeFacets = req.query.includeFacets !== "false";
  const limit = parsePositiveInteger(req.query.limit);

  const filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    filters.category = category;
  }

  if (audience && audience !== "All") {
    filters.audience = audience;
  }

  if (featured === "true") {
    filters.featured = true;
  }

  if (inStock === "true") {
    filters.stock = { $gt: 0 };
  }

  const cacheKey = {
    audience,
    category,
    featured: featured === "true" ? "true" : "",
    inStock: inStock === "true" ? "true" : "",
    includeFacets,
    limit: limit ?? "",
    search,
  };
  const cachedResponse = readProductQueryCache(cacheKey);

  if (cachedResponse) {
    res.set("Cache-Control", PRODUCT_CACHE_HEADER);
    res.json(cachedResponse);
    return;
  }

  const productsQuery = Product.find(filters).sort({ featured: -1, createdAt: -1 }).lean();

  if (limit) {
    productsQuery.limit(limit);
  }

  const response = includeFacets
    ? await Promise.all([productsQuery, Product.distinct("category"), Product.distinct("audience")]).then(
        ([products, categories, audiences]) => ({
          products,
          categories: ["All", ...categories.filter(Boolean).sort()],
          audiences: ["All", ...audiences.filter(Boolean).sort()],
        }),
      )
    : {
        products: await productsQuery,
      };

  const payload = writeProductQueryCache(cacheKey, response);
  res.set("Cache-Control", PRODUCT_CACHE_HEADER);
  res.json(payload);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    throw createHttpError(404, "Product not found.");
  }

  res.set("Cache-Control", PRODUCT_CACHE_HEADER);
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = mapProductPayload(req.body);
  validateProductPayload(payload);

  const product = await Product.create(payload);
  invalidateProductQueryCache();
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);

  if (!existingProduct) {
    throw createHttpError(404, "Product not found.");
  }

  const payload = mapProductPayload({
    ...existingProduct.toObject(),
    ...req.body,
    specs: {
      ...existingProduct.specs,
      ...req.body.specs,
    },
  });

  validateProductPayload(payload);

  Object.assign(existingProduct, payload);
  const updatedProduct = await existingProduct.save();
  invalidateProductQueryCache();

  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw createHttpError(404, "Product not found.");
  }

  await product.deleteOne();
  invalidateProductQueryCache();
  res.json({ message: "Product deleted successfully." });
});
