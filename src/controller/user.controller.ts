import asyncHandler from "../utils/asyncHandler";
import { Request, Response, CookieOptions } from "express";
import { register, login } from "../services/user.service";
import apiResponse from "../utils/apiResponse";
import { registerValidate, loginValidate } from "../Schema/user.schema";
import User from "../model/user.model";

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
  //user la logout thixhxa
  //endpoint hit garxa .... ani jwtverify garxa ....
  // ani logout controller ma chi User khojxa ra rafreshToken lai unset garxa
  //and res ma cookie clear ganey both at and rt
  await User.findByIdAndUpdate(
    req.user?.id,
    {
      // maila refreshtoken lai save garya xu so rt matra delete garnu paryo db bata
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,//return updated document 
    }
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});
export { userRegister, userLogin, userLogout };
