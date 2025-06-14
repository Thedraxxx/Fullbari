import z from "zod";

const productValidate = z.object({
  productName: z.string().min(2, "Product name is too short"),
  productPrice: z.number().min(0, "Price must be at least 0"),
  productDiscription: z.string().min(10, "Description is too short"),
  productImage: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  productDiscountPrice: z
    .number()
    .min(0, "Discount must be positive")
    .optional(),
  prductCategory: z.string().min(1, "Category is required").toLowerCase(),
  inStock: z.number().int().min(0, "Stock must be zero or more"),
  isAvailable: z.boolean(),
  rating: z.number().min(0).max(5),
  numReviews: z.number().int().min(0),
  tags: z.array(z.string()).optional(),
});

export { productValidate };
