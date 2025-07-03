import express from "express";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", contactRoutes);

const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
