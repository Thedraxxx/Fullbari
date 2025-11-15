import mongoose, { Model, Document } from "mongoose";
import { StringValue } from "ms";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
interface IUser extends Document {
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
  userName: string,
  isPasswordCorrect(password: string): Promise<boolean>;
  generateRefreshToken(): string;
  generateAccessToken(): string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    userName: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      minlength: [3,"username must be atleast 3 characters long"],
      maxlength: [10,'usernmae must be less then 10 characters'],
      match: [/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers and underscores"],
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
  console.log("entered password",password);
  console.log("database password",this.password)
  const isValid = await bcrypt.compare(password, this.password);
  console.log("milyo",isValid)
  return isValid;
};

userSchema.methods.generateAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
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
      userName: this.userName,
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