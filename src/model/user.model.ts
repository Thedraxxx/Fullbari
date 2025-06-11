import mongoose, { Model } from "mongoose";
import apiError from "../utils/apiErrors";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
  
  async register(data: {firstName: string,lastName: string, phoneNumber: string, email: string,password: string}) {
          console.log(data);
          if(!data.firstName || !data.lastName ||!data.phoneNumber || data.email || data.password){
            throw new apiError(400,"These feild are required");
          };
         const existingUser = await User.findOne({email: data.email});
         if(existingUser){
          throw new apiError(400,"This user already exist.");
         }
      const user = await User.create({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          password: data.password
        });
         const existedUser = await User.findOne(user._id).select(" -password ");
  }
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password,salt);
      next();
})
const User = mongoose.model("User", userSchema);

export default User;
