import { Router } from "express";
import prisma from "../prisma/client";
import { identifyContact } from "../controllers/contact.controller";

const router = Router();

router.post("/identify", identifyContact);

export default router;
