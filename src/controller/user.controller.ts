import User from "../model/user.model";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import register from "../services/user.service";
import apiError from "../utils/apiErrors";
import apiResponse from "../utils/apiResponse";
const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const safeData = await register(req.body);

  return res
    .status(201)
    .json(new apiResponse(200, safeData, "User created Successfully"));
});
export default userRegister;