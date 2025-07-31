import express from "express";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes";
import orderRoutes from "./routes/order.routes"; // <-- 1. Import the new order routes

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", contactRoutes);
app.use("/", orderRoutes); 

const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
