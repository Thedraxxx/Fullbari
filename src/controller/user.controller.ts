
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, CookieOptions } from "express";
import { register, login } from "../services/user.service";
import apiResponse from "../utils/apiResponse";
import { registerValidate, loginValidate } from "../Schema/user.schema";

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
    .json(new apiResponse(200,user,"user logged in successfylly"));
});
const userLogout = asyncHandler(async (req: Request,res: Response)=>{
    
})
export { userRegister, userLogin };
