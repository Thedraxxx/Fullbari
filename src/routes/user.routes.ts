import { userRegister,userLogin } from "../controller/user.controller";

import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);

export default userRouter;