import z from "zod";
import mongoose from "mongoose";
const categoryValidate = z.object({
  categoryName: z.string().nonempty({ message: "This field cannot be empty." }),
  discription: z.string().optional(),
  isActive: z.boolean().optional().default(true)
});
export const categoryIdSchema = z.object({
  categoryId: z
    .string()
    .min(1, "Category ID is required")
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid Category ID format",
    }),
});
export type ICategoryId =z.infer< typeof categoryIdSchema>
export type ICategory = z.infer<typeof categoryValidate>;
export {categoryValidate}