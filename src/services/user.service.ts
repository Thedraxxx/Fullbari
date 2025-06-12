import apiError from "../utils/apiErrors";
import User from "../model/user.model";

const register = async(data: {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}) =>{
     {
    console.log(data);
    if(data === undefined){
      throw new apiError(400,"undefined aairaxa");
    }
    const { fullName, phoneNumber, email, password } = data;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new apiError(400, "This user already exist.");
      }
      const user = await User.create({
        fullName,
        phoneNumber,
        email,
        password,
      });
      const existedUser = await User.findOne(user._id).select(" -password ");
      return existedUser;
    } catch (error) {
      if(error instanceof apiError)
      {
        throw error;
      }
      throw new apiError(401,"Faild to register.")
    }
  };
}
export default register;
 

