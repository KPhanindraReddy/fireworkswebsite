import mongoose from "mongoose";

const createSlug = (value) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      trim: true,
      default: "All Ages",
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    specs: {
      packSize: String,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", function assignSlug(next) {
  if ((this.isModified("name") || !this.slug) && this.name) {
    this.slug = createSlug(this.name);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
