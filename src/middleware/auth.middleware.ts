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

      if (!token) {
        throw new apiError(401, "Authentication token missing.");
      }
      const verifiedToken = jwt.verify(
        token,
        envConfig.access_token_secret as string
      );

      if (typeof verifiedToken !== "string") {
        // Find user from DB
        const user = await User.findById(verifiedToken?._id).select(
          "-password -refreshToken"
        );

        if (!user) {
          throw new apiError(403, "No user found for this token");
        }

        req.user = user;

        next();
      }
    } catch (error) {
      throw new apiError(401, "Invalid access token");
    }
  }
);

export default jwtVerify;
