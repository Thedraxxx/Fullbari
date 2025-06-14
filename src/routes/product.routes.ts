import { Router } from "express";
import { insertProduct } from "../controller/product.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
const productRouter = Router();

productRouter.route("/insertProduct").post(jwtVerify,isAdmin,insertProduct);

export {productRouter};