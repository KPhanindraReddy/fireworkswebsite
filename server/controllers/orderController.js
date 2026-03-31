import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { createOrderNumber } from "../utils/createOrderNumber.js";

const allowedStatuses = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

const normalizeCustomer = (payload) => ({
  name: payload.name?.trim(),
  phone: payload.phone?.trim(),
  address: payload.address?.trim(),
  pincode: payload.pincode?.trim(),
});

const validateCustomer = (customer) => {
  if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
    throw createHttpError(400, "Full name, mobile number, address, and pincode are required.");
  }

  if (!/^\d{6}$/.test(customer.pincode)) {
    throw createHttpError(400, "Enter a valid 6-digit pincode.");
  }

  if (!/^\d{10}$/.test(customer.phone)) {
    throw createHttpError(400, "Enter a valid 10-digit mobile number.");
  }
};

const getRequestedItems = (body) => body.items ?? body.products ?? [];

export const createOrder = asyncHandler(async (req, res) => {
  const items = getRequestedItems(req.body);
  const customer = normalizeCustomer(req.body.customer ?? req.body);
  const optionalPassword = req.body.password?.trim();

  validateCustomer(customer);

  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, "Your cart is empty.");
  }

  const productIds = items.map((item) => item.productId ?? item.product ?? item._id);

  const products = await Product.find({
    _id: {
      $in: productIds.filter((id) => mongoose.isValidObjectId(id)),
    },
  });

  const productsById = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];
  let total = 0;

  for (const requestedItem of items) {
    const productId = requestedItem.productId ?? requestedItem.product ?? requestedItem._id;
    const product = productsById.get(String(productId));
    const quantity = Number(requestedItem.quantity ?? requestedItem.qty ?? 1);

    if (!product) {
      throw createHttpError(400, "One or more cart items are no longer available.");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw createHttpError(400, `Invalid quantity for ${product.name}.`);
    }

    if (product.stock < quantity) {
      throw createHttpError(400, `${product.name} has only ${product.stock} item(s) left.`);
    }

    total += product.price * quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      quantity,
    });
  }

  const order = await Order.create({
    orderNumber: createOrderNumber(),
    customer,
    items: orderItems,
    total,
    paymentMethod: "COD",
    notes: req.body.notes?.trim() ?? "",
    createdAccount: Boolean(optionalPassword),
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      }),
    ),
  );

  if (optionalPassword) {
    const password = await bcrypt.hash(optionalPassword, 10);

    await User.findOneAndUpdate(
      { phone: customer.phone },
      {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        pincode: customer.pincode,
        password,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );
  }

  const populatedOrder = await Order.findById(order._id);
  res.status(201).json(populatedOrder);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const filters = [{ orderNumber: orderId }];

  if (mongoose.isValidObjectId(orderId)) {
    filters.push({ _id: orderId });
  }

  const order = await Order.findOne({ $or: filters });

  if (!order) {
    throw createHttpError(404, "Order not found.");
  }

  res.json(order);
});

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    throw createHttpError(400, "Invalid order status.");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw createHttpError(404, "Order not found.");
  }

  order.status = status;
  await order.save();

  res.json(order);
});
