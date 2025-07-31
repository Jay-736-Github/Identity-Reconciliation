import { Request, Response } from "express";
import orderService from "../services/order.service";

/**
 * Controller to handle the creation of a new order.
 */
export const createOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phoneNumber, productName, orderValue } = req.body;

    // Basic validation to ensure we have the necessary order details
    if (!productName || !orderValue) {
      res
        .status(400)
        .json({ error: "productName and orderValue are required." });
      return;
    }

    if (!email && !phoneNumber) {
      res
        .status(400)
        .json({
          error: "email or phoneNumber is required to identify the contact.",
        });
      return;
    }

    const newOrder = await orderService.createOrder({
      email,
      phoneNumber,
      productName,
      orderValue,
    });

    res.status(201).json(newOrder); // 201 Created is a more appropriate status code here
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
