import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate } from "../Schema/product.schema";
import { createProductService } from "../services/product.service";
import apiResponse from "../utils/apiResponse";
const insertProduct = asyncHandler(async (req: Request, res: Response) => {
  const validProduct = productValidate.parse(req.body);
  const productData = await createProductService(validProduct);
  return res
    .status(200)
    .json(new apiResponse(200, productData, "Product inserted Successfully"));
});

export { insertProduct };
