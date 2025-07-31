import prisma from "../prisma/client";
import contactService from "./contact.service";
import { Order as OrderModel } from "@prisma/client";

// structure of the data needed to create an order
interface CreateOrderDto {
  email?: string;
  phoneNumber?: string;
  productName: string;
  orderValue: number;
}

const orderService = {
  /**
   * This identifies the primary contact and creates a new order linked to them.
   * @param orderData - The details of the order to be created.
   * @returns The newly created order record.
   */
  async createOrder(orderData: CreateOrderDto): Promise<OrderModel> {
    const { email, phoneNumber, productName, orderValue } = orderData;

    // 1. To reuse our existing service to find the primary contact ID
    const identity = await contactService.identify(email, phoneNumber);
    const primaryContactId = identity.primaryContactId;

    // 2. To create the new order and link it using the primary contact ID
    const newOrder = await prisma.order.create({
      data: {
        productName,
        orderValue,
        contactId: primaryContactId,
      },
    });

    return newOrder;
  },
};

export default orderService;
