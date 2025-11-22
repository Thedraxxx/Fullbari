import { AddCart, getCart, updateCart } from "../controller/cart.controller";
import { Router } from "express";
import jwtVerify from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";


 const cartRouter = Router();

cartRouter.route("/add").post(upload.none(),jwtVerify,AddCart);
cartRouter.route("/carts").get(upload.none(),jwtVerify,getCart);
cartRouter.route("/update").post(upload.none(),jwtVerify,updateCart)
export {cartRouter}

