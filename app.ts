import express from "express";
import errorHandler from "./src/middleware/errorHandler";
import userRouter from "./src/routes/user.routes";
import { productRouter } from "./src/routes/product.routes";

const app = express();

app.use(express.json({limit: "1mb"}));
app.use("/api/v2/users",userRouter);
app.use("/api/v2/products",productRouter);
app.use(errorHandler);
export default app;