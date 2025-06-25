import { Router } from "express";
import { createCategory } from "../controller/category.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
import upload from "../middleware/multer.middleware";
const categoryRouter = Router();
categoryRouter.route("/create").post(upload.none(),jwtVerify,isAdmin,createCategory);
export default categoryRouter;