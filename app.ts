import express from "express";
import errorHandler from "./src/middleware/errorHandler";
import userRegister from "./src/controller/user.controller";


const app = express();

app.use(express.json({limit: "1mb"}));
app.use("/api/v2/users",userRegister)
app.use(errorHandler);
export default app;