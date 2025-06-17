import { Router } from "express";
import { insertProduct, fetchAllProduct } from "../controller/product.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
import upload from "../middleware/multer.middleware";
const productRouter = Router();

productRouter.route("/insertProduct").post(upload.array("productImage"),jwtVerify,isAdmin,insertProduct);
productRouter.route("/fetchProduct").post(upload.none(),fetchAllProduct)

export {productRouter};