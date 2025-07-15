import { z } from "zod";

const registerValidate = z.object({
  fullName: z
    .string()
    .min(4, "Full name must be at least 4 characters")
    .max(30, "Full name must not exceed 30 characters")
    .nonempty("Full name is required"),

  phoneNumber: z.string().trim().regex(/^(97|98)\d{8}$/, {
    message: "Phone number must be valid with 97 or 98 or having 10 digit",
  }).nonempty("phone Number is mandatory")
  ,

  email: z.string().trim().email("Invalid email address").nonempty("Email feild is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(14, "Password must not exceed 14 characters")
    .nonempty("password is required"),
});
const loginValidate = z.object({
    
  email: z.string().trim().email("Invalid email address").nonempty("Email feild is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(14, "Password must not exceed 14 characters")
    .nonempty("password is required"), 
});

export {registerValidate,loginValidate};
