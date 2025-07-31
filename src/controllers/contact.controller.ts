import { Request, Response } from "express";
import contactService from "../services/contact.service";

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;
    const result = await contactService.identify(email, phoneNumber);
    res.status(200).json({ contact: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
