import express from "express";
import errorHandler from "./src/middleware/errorHandler";
const app = express();

app.use(errorHandler);
export default app;