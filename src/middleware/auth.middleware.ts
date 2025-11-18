import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import apiError from "../utils/apiErrors";
import { envConfig } from "../config/config";
import { Request, Response, NextFunction } from "express";
import User from "../model/user.model";

interface IRequest extends Request {
user?: {
    email: string;
    role: string;
  };
}

const jwtVerify = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      console.log("Received Token:", token);

      if (!token) {
        throw new apiError(401, "Authentication token missing.");
      }

      const verifiedToken: any = jwt.verify(
        token,
        envConfig.access_token_secret as string
      );

      console.log("Verified Token Payload:", verifiedToken);

      const user = await User.findById(verifiedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new apiError(403, "No user found for this token");
      }

      req.user = user;
      next();
    }catch (error: any) {
  console.error("JWT Verify Error:", error.message || error);
  throw new apiError(401, error.message || "Invalid access token");
}

  }
);

export default jwtVerify;
