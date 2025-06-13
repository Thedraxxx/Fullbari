import apiError from "../utils/apiErrors";
import User from "../model/user.model";
import { string } from "zod";
import { envConfig } from "../config/cofig";
import { CookieOptions } from "express";
interface IUser {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}
const register = async (data: IUser) => {
  {
    // console.log(data);
    if (data === undefined) {
      throw new apiError(400, "undefined aairaxa");
    }
    const { fullName, phoneNumber, email, password } = data;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new apiError(400, "This user already exist.");
      }
      // console.log(existingUser)
      const user = await User.create({
        fullName,
        phoneNumber,
        email,
        password,
      });
      
      const existedUser = await User.findOne({ _id: user._id }).select(
        " -password "
      );
      // console.log(existedUser);
      return existedUser;
    } catch (error) {
      if (error instanceof apiError) {
        throw error;
      }
      throw new apiError(401, "Faild to register.");
    }
  }
};
const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const existedUser = await User.findOne({ email: email }).select("+password"); // kinavana maila model ma select false garya xu for security reason
  if (!existedUser) {
    throw new apiError(404, "User not found !");
  }
  const validPasswoed = await existedUser.isPasswordCorrect(password);
  if (!validPasswoed) {
    throw new apiError(400, "Invalid credentials");
  }
  const accessToken = existedUser.generateAccessToken();
  const refreshToken = existedUser.generateRefreshToken();

  existedUser.refreshToken = refreshToken;
  await existedUser.save({ validateBeforeSave: false });

  const loggedUser = existedUser.toObject();
  const {
    password: _password,
    refreshToken: _refreshToken,
    ...safeLoggedUser
  } = loggedUser;
  
  const options: CookieOptions = {
    httpOnly: true ,
    secure: envConfig.node_env === "production"? true : false,
    sameSite: "none",  // Added this line for cross-domain cookie transmission
    maxAge: 24 * 60 * 60 * 1000 // or whatever expiration you prefer
  };
  return {
    user: safeLoggedUser,
    accessToken,
    refreshToken,
    options
  };
};

export { register, login };
