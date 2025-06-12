import User from "../model/user.model";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import register from "../services/user.service";
import apiError from "../utils/apiErrors";
import apiResponse from "../utils/apiResponse";
import userValidate from "../Schema/user.schema";
const userRegister = asyncHandler(async (req: Request, res: Response) => {
   const validateData = userValidate.parse(req.body);
  const userData = await register(validateData);
  return res
    .status(201)
    .json(new apiResponse(200, userData, "User created Successfully"));
});
export default userRegister;