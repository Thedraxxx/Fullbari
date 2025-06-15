import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate } from "../Schema/product.schema";
import { createProductService } from "../services/product.service";
import apiResponse from "../utils/apiResponse";
import apiError from "utils/apiErrors";
import uploadOnCloudnary from "utils/cloudnary";
const insertProduct = asyncHandler(async (req: Request, res: Response) => {
  const validProduct = productValidate.parse(req.body);
  
   const image = req.file?.path;
  if(!image){
    throw new apiError(401,"Product Image is required")
  }
  const imageURL = await uploadOnCloudnary(image);

  if(!imageURL){
    throw new apiError(401,"Failed to upload on the cloudnary.")
  }
   validProduct.productImage = [imageURL];

  const productData = await createProductService(validProduct);
  return res
    .status(200)
    .json(new apiResponse(200, productData, "Product inserted Successfully"));
});

export { insertProduct };
