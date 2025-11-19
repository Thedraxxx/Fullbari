import { userRegister,userLogin,userLogout } from "../controller/user.controller";
import jwtVerify from "../middleware/auth.middleware";
import { Router } from "express";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(jwtVerify,userLogout);

userRouter.get("/checkAuth", jwtVerify, (req, res) => {
  res.status(200).json({
    success: true,
    authenticated: true,
    user: req.user
  });
}
)
export default userRouter;