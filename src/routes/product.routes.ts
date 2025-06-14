import { Router } from "express";
import { insertProduct } from "../controller/product.controller";
import jwtVerify from "../middleware/auth.middleware";
const productRouter = Router();

productRouter.route("/insertProduct").post(jwtVerify,insertProduct);

export {productRouter};