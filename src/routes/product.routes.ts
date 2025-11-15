import { Router } from "express";
import { insertProduct, fetchAllProduct, fetchSingleProduct, deleteProduct, updateProduct, restoreProduct, getDeletedProducts, hardDeleteProduct } from "../controller/product.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
import upload from "../middleware/multer.middleware";
const productRouter = Router();

productRouter.route("/insertProduct").post(upload.array("productImage"),isAdmin,insertProduct);
productRouter.route("/fetchProduct").get(upload.none(),fetchAllProduct);
productRouter.route("/fetchProduct/:productId").get(upload.none(),fetchSingleProduct);
productRouter.route("/deleteProduct/:productId").delete(upload.none(),jwtVerify,isAdmin,deleteProduct);
productRouter.route("/updateProduct/:productId").patch(upload.none(),jwtVerify,isAdmin,updateProduct);
productRouter.route("/restoreProduct/:productId").patch(upload.none(),jwtVerify,isAdmin,restoreProduct);
productRouter.route("/getDeletedProducts").get(upload.none(),jwtVerify,isAdmin,getDeletedProducts);
productRouter.route("/hardDeleteProduct/:productId").delete(upload.none(),jwtVerify,isAdmin,hardDeleteProduct)
export {productRouter};