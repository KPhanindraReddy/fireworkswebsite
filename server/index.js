import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./config/db.js";
import { seedProductsIfNeeded } from "./data/seedProducts.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 5000;

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    return new URL(trimmedValue).origin;
  } catch {
    return trimmedValue.replace(/\/+$/, "");
  }
};

const extractConfiguredOrigins = (...values) =>
  values.flatMap((value) => {
    if (!value) {
      return [];
    }

    const matches = value.match(/https?:\/\/[^\s,;]+/gi);
    const candidates = matches?.length ? matches : value.split(/[\s,;]+/);

    return candidates.map(normalizeOrigin).filter(Boolean);
  });

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildVercelPreviewPatterns = (origins) =>
  origins.flatMap((origin) => {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol !== "https:" || !hostname.endsWith(".vercel.app")) {
        return [];
      }

      const projectName = hostname.replace(/\.vercel\.app$/i, "");
      return [new RegExp(`^https://${escapeRegExp(projectName)}(?:-[a-z0-9-]+)?\\.vercel\\.app$`, "i")];
    } catch {
      return [];
    }
  });

const allowedOrigins = [
  ...new Set([...extractConfiguredOrigins(process.env.CLIENT_URL, process.env.CLIENT_URLS), "http://localhost:5173"]),
];
const allowedVercelPreviewOrigins = buildVercelPreviewPatterns(allowedOrigins);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  return (
    allowedOrigins.includes(normalizedOrigin) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(normalizedOrigin) ||
    allowedVercelPreviewOrigins.some((pattern) => pattern.test(normalizedOrigin))
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS is blocked for this origin."));
    },
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ message: "Fireworks API is running." });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase(process.env.MONGODB_URI);

  if (process.env.AUTO_SEED !== "false") {
    await seedProductsIfNeeded();
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exit(1);
});
