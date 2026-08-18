import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

//middlware
app.use(express.json());
app.use(
  cors({
    origin: true, // http://localhost:5173
    credentials: true,
  }),
);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port : ${PORT}`);
});
