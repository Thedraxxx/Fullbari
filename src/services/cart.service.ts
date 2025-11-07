import mongoose from "mongoose";
import { Cart } from "../model/cart.model";
import { ICartData } from "../Schema/cart.schema";
import apiError from "../utils/apiErrors";

const addCartService = async (data: ICartData) => {
  try {
    const { userId, products, status = "active", isDeleted = false } = data;

    // Step 1: Validate incoming data
    if (!userId || !Array.isArray(products) || products.length === 0) {
      throw new apiError(400, "Invalid cart data");
    }

    // Step 2: Find active cart
    let existingCart = await Cart.findOne({ userId, status: "active", isDeleted: false });

    // Step 3: Calculate new product total
    const newProducts = products.map((p) => ({
      productId: new mongoose.Types.ObjectId(p.productId),
      quantity: p.quantity,
      price: p.price,
    }));

    if (existingCart) {
      // Debug log
      console.log("🛒 Updating existing cart:", existingCart._id);

      // Update or add each new product
      for (const newProduct of newProducts) {
        const index = existingCart.products.findIndex(
          (item) => item.productId.toString() === newProduct.productId.toString()
        );

        if (index !== -1) {
          // ✅ Update existing product quantity and price
          existingCart.products[index].quantity += newProduct.quantity;
          existingCart.products[index].price = newProduct.price;
        } else {
          // 🆕 Add new product
          existingCart.products.push(newProduct);
        }
      }

      // Step 4: Recalculate total price and total quantity
      existingCart.totalPrice = existingCart.products.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      existingCart.totalQunatity = existingCart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // Step 5: Save the updated cart
      await existingCart.save();
      console.log("✅ Cart updated successfully:", existingCart._id);
      return existingCart;
    } else {
      // 🆕 Step 6: Create new cart
      const totalPrice = newProducts.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const totalQuantity = newProducts.reduce((acc, item) => acc + item.quantity, 0);

      const newCart = await Cart.create({
        userId,
        products: newProducts,
        totalPrice,
        totalQuantity,
        status,
        isDeleted,
      });

      console.log("🆕 New cart created:", newCart._id);
      return newCart;
    }
  } catch (error: any) {
    console.error("❌ Add to cart error:", error.message || error);
    throw new apiError(500, error.message || "Failed to add to cart");
  }
};


const getCartService = async () => {
  try {
    const cartDatas = await Cart.find({ status: "active" }).select(
      "userId products totalPrice status isDeleted"
    );
    console.log("cart----", cartDatas);
    return cartDatas;
  } catch (error) {
    throw new apiError(401, "faild to fetch the cart");
  }
};
export { addCartService, getCartService };
