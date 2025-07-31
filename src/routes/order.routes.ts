import { Router } from "express";
import { createOrderHandler } from "../controllers/order.controller";

const router = Router();

/**
 * @route   POST /order
 * @desc    Create a new order and link it to a contact
 * @access  Public
 */
router.post("/order", createOrderHandler);

export default router;
