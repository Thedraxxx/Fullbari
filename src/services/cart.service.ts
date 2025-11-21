import mongoose from "mongoose";
import { Cart } from "../model/cart.model";
import { ICartData } from "../Schema/cart.schema";
import apiError from "../utils/apiErrors";
import { Product } from "../model/product.model";
import User from "../model/user.model";

const addCartService = async (data: ICartData) => {
  try {
    const { userId, products, status = "active", isDeleted = false } = data;

   
    if (!userId || !Array.isArray(products) || products.length === 0) {
      throw new apiError(400, "Invalid cart data");
    }
    const userExists = await User.findById(userId);
    if(!userExists){
      throw new apiError(404,"User does not exists");
    }
    let existingCart = await Cart.findOne({ userId, status: "active", isDeleted: false });

    const newProducts = [];

for (const p of products) {
  const dbProduct = await Product.findById(p.productId).select("productPrice productDiscountPrice");

  if (!dbProduct) {
    throw new apiError(404, "Product does not exist");
  }
  const finalPrice = dbProduct.productDiscountPrice || dbProduct.productPrice;
  newProducts.push({
    productId: new mongoose.Types.ObjectId(p.productId),

    quantity: p.quantity,
    price: finalPrice
  });
}

    if (existingCart) {
    
      console.log("🛒 Updating existing cart:", existingCart._id);

   
      for (const newProduct of newProducts) {
        const index = existingCart.products.findIndex(
          (item) => item.productId.toString() === newProduct.productId.toString()
        );

        if (index !== -1) {
         
          existingCart.products[index].quantity += newProduct.quantity;
          existingCart.products[index].price = newProduct.price;
        } else {
 
          existingCart.products.push(newProduct);
        }
      }

      // Step 4: Recalculate total price and total quantity
      existingCart.totalPrice = existingCart.products.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );

      existingCart.totalQuantity = existingCart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      // Step 5: Save the updated cart
      await existingCart.save();
      console.log("✅ Cart updated successfully:", existingCart._id);
      return existingCart;
    } else {

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
    const cartDatas = await Cart.find({ status: "active", isDeleted: false })
      .populate(
        "products.productId",
        "productName productImage productPrice productDiscountPrice"
      )
      .select("userId products totalPrice status isDeleted");

    console.log("cart----", cartDatas);

    // If cart is empty
    if (!cartDatas || cartDatas.length === 0) {
      return {
        cart: [],
        message: "Cart is empty",
      };
    }

    return cartDatas;
  } catch (error) {
    throw new apiError(401, "Failed to fetch the cart");
  }
};

export { addCartService, getCartService };
