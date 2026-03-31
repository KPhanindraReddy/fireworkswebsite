import Product from "../models/Product.js";
import { sampleProducts } from "./sampleProducts.js";

export const seedProductsIfNeeded = async () => {
  const existingProducts = await Product.countDocuments();

  if (existingProducts > 0) {
    return;
  }

  await Product.insertMany(sampleProducts);
  console.log("Seeded starter fireworks catalog.");
};
