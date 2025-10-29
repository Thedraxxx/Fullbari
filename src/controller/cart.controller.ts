import { Request, Response } from "express";
import { cartValidate } from "../Schema/cart.schema";
import { addCartService, getCartService } from "../services/cart.service";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";


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

export {AddCart,getCart}