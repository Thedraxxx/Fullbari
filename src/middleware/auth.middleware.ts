import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import apiError from "../utils/apiErrors";
import { envConfig } from "../config/cofig";
import { Request,Response, NextFunction } from "express";
import User from "../model/user.model";
interface IRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}
const jwtVerify = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Authentication token messing.");
    }

    const verifiedToken = jwt.verify(
      token,
      envConfig.access_token_secret as string
    );
    if (typeof verifiedToken !== "string") {
      //payload nai hunxa yo token
      const user = await User.findById(verifiedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new apiError(403, "No user Found");
      }
      req.user = user;
      next();
    }
  }
);
 
export default jwtVerify;
