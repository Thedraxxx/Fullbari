import asyncHandler from "../utils/asyncHandler";
import { Request, Response, CookieOptions } from "express";
import { register, login } from "../services/user.service";
import apiResponse from "../utils/apiResponse";
import { registerValidate, loginValidate } from "../Schema/user.schema";
import User from "../model/user.model";
import apiError from "../utils/apiErrors";
import { envConfig } from "../config/config";

const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const validateRegisterData = registerValidate.parse(req.body);
  const userData = await register(validateRegisterData);
  return res
    .status(201)
    .json(new apiResponse(200, userData, "User created Successfully"));
});
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const validateUser = loginValidate.parse(req.body);
  const { user, accessToken, refreshToken, options } = await login(
    validateUser
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, user, "user logged in successfylly"));
});
const userLogout = asyncHandler(async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(
      req.user?.id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new apiError(500, "Failed to clear refresh token from the database.");
  }

  // Must match the options used when setting cookies
  const options: CookieOptions = {
    httpOnly: envConfig.node_env ==="production" ? true: false,
    secure:  envConfig.node_env ==="production" ? true: false,
    sameSite: 'lax',
    path: "/", // Important: must match the path used when setting
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});
export { userRegister, userLogin, userLogout };
