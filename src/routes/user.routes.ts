import userRegister from "../controller/user.controller";

import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post(userRegister);

export default userRouter;