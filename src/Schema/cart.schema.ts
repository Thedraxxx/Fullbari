import mongoose from "mongoose";
import z from "zod";

const cartValidate = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid user ID format",
    }),

  products: z
    .array(
      z.object({
        productId: z
          .string({ required_error: "Product ID is required" })
          .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: "Invalid product ID format",
          }),
          productName: z.coerce.string().optional(),
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
      price: z.any().optional(),

      })
    )
    .min(1, "At least one product is required"),
  status: z.enum(["active", "ordered","abandoned"]).default("active"),
  totalPrice: z.coerce.number().optional(),
  isDeleted: z.coerce.boolean().default(false),
  totalQuantity: z.coerce.number().optional(),
});

const cartIdSchema = z.object({
  cartId: z
    .string({ required_error: "Cart ID is required" })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid cart ID format",
    }),
});

export const updateCartSchema = cartValidate.partial();

export type ICartData = z.infer<typeof cartValidate>;
export type IUpdateCart = z.infer<typeof updateCartSchema>;
export type ICartId = z.infer<typeof cartIdSchema>;

export { cartValidate, cartIdSchema };
