import { AddCart, getCart } from "../controller/cart.controller";
import { Router } from "express";
import jwtVerify from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";


 const cartRouter = Router();

cartRouter.route("/add").post(upload.none(),jwtVerify,AddCart);
cartRouter.route("/carts").get(upload.none(),jwtVerify,getCart);

export {cartRouter}

