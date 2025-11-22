import { Request, Response } from "express";
import { cartValidate } from "../Schema/cart.schema";
import { addCartService, getCartService, updateCartService } from "../services/cart.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import apiError from "../utils/apiErrors";


const AddCart = asyncHandler(async(req: Request,res: Response)=>{
     const validCartData = cartValidate.parse(req.body);
     const cartData = await addCartService(validCartData);
     console.log(cartData);
     return res.status(200).json(new apiResponse(200,cartData,"added to cart successfully"))
})
const getCart = asyncHandler(async(req:Request, res: Response)=>{
     const cartData = await getCartService();
     return res.status(200).json(new apiResponse(200,cartData,"Carts data fetched succesfully"));
})
// cart.controller.ts - Updated
const updateCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId, productId, action } = req.body;
  
  if (!userId || !productId || !action) {
    throw new apiError(400, "userId, productId, and action are required");
  }
  
  if (!["increase", "decrease"].includes(action)) {
    throw new apiError(400, "Action must be 'increase' or 'decrease'");
  }
  
  
  const updatedCart = await updateCartService(userId, productId, action);
  
  return res
    .status(200)
    .json(new apiResponse(200, updatedCart, "Cart updated successfully"));
});


export {AddCart,getCart,updateCart}