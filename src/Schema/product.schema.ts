import mongoose from "mongoose";
import z from "zod";

const productValidate = z.object({
  productName: z.string().min(2, "Product name is too short"),
  productPrice: z.coerce.number().min(0, "Price must be at least 0"),
  productDiscription: z.string().min(10, "Description is too short"),
  productImage: z
    .union([
      z.string().url("Invalid image URL"),
      z.array(z.string().url("Invalid image URL")),
    ])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .refine((arr) => arr.length > 0, {
      message: "At least one image is required",
    }),

  productDiscountPrice: z.coerce
    .number()
    .min(0, "Discount must be positive")
    .optional(),
  prductCategory: z.string().min(1, "Category is required").toLowerCase(),
  inStock: z.coerce.number().int().min(0, "Stock must be zero or more"),
  isAvailable: z.coerce.boolean(),
  rating: z.coerce.number().min(0).max(5),
  numReviews: z.coerce.number().optional().default(0),
  tags: z.array(z.string()).optional(),
});
const querySchema = z.object({
  queries: z
    .string()
    .default("")
    .transform((q) => q.trim()),
  page: z.coerce.number().int().min(1).max(100).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z
    .string()
    .default("")
    .transform((c) => c.trim()),
  sort: z
    .enum(["newest", "oldest", "priceDsc", "priceAsc"])
    .default("newest")
    .transform((s) => s.trim()),
});
const productIdSchema = z.object({
    productId: z.string().min(1,"product id is required").refine((id)=> mongoose.Types.ObjectId.isValid(id),{
      message: "Incvalid product Id formet"
    })
});
export type IQueries = z.infer<typeof querySchema>;
export type IProductId = z.infer<typeof productIdSchema>
export { productValidate, querySchema, productIdSchema };
