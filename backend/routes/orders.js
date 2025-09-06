import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Place order
router.post("/", async (req, res) => {
  try {
    const { user, items } = req.body;
    const total = items.reduce((sum, i) => sum + i.price, 0);
    const order = new Order({ user, items, total });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user orders
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
