import mongoose, { Model, Document } from "mongoose";
import apiError from "../utils/apiErrors";
import { StringValue } from "ms";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/cofig";
interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateRefreshToken(): string;
  generateAccessToken(): string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

userSchema.methods.generateAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role
    },
    envConfig.access_token_secret as string,
    {
      expiresIn: envConfig.access_token_expire as StringValue,
    }
  );
};
userSchema.methods.generateRefreshToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
    },
    envConfig.refresh_token_secret as string,
    {
      expiresIn: envConfig.refresh_token_expire as StringValue, // yo chi millisecond ma convert garna ko lagi tsc ma ..
    }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;