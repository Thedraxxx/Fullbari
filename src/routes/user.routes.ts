import { userRegister,userLogin,userLogout } from "../controller/user.controller";
import jwtVerify from "../middleware/auth.middleware";
import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(jwtVerify,userLogout)

export default userRouter;