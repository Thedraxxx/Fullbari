import { Router } from "express";
import { createCategory, getAllCategory, getSingleCategory } from "../controller/category.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
import upload from "../middleware/multer.middleware";
const categoryRouter = Router();
categoryRouter.route("/create").post(upload.none(),jwtVerify,isAdmin,createCategory);
categoryRouter.route("/getCategory").get(getAllCategory);
categoryRouter.route("/getSingle/:categoryId").get(jwtVerify,isAdmin,getSingleCategory)
export default categoryRouter;