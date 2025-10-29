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
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        price: z.coerce.number().min(0, "Price must be 0 or more"),
      })
    )
    .min(1, "At least one product is required"),
  status: z.enum(["active", "ordered"]).default("active"),
  totalPrice: z.coerce.number().optional(),
  isDeleted: z.coerce.boolean().default(false),
  totalQunatity: z.coerce.number().optional(),
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
