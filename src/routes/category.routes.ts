import { Router } from "express";
import { createCategory } from "controller/category.controller";
import jwtVerify from "../middleware/auth.middleware";
import isAdmin from "../middleware/roles.middleware";
const categoryRouter = Router();
categoryRouter.route("/createCategory").post(jwtVerify,isAdmin,createCategory);
export default categoryRouter;