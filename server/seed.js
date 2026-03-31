import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import Product from "./models/Product.js";
import { sampleProducts } from "./data/sampleProducts.js";

dotenv.config();

const runSeed = async () => {
  await connectDatabase(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("Products reseeded successfully.");
  process.exit(0);
};

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
