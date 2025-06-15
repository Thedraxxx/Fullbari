import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate } from "../Schema/product.schema";
import { createProductService } from "../services/product.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiErrors";
import uploadOnCloudnary from "../utils/cloudnary";

const insertProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new apiError(401, "Product images are required");
  }

  const imagePaths = files.map((file) => file.path);
  console.log("Uploaded paths:", imagePaths);

  const uploadedURLs: string[] = [];

  for (const path of imagePaths) {
    const url = await uploadOnCloudnary(path);
    if (url) {
      uploadedURLs.push(url);
    }
  }
     console.log(uploadedURLs)
  if (uploadedURLs.length === 0) {
    throw new apiError(401, "Failed to upload images to Cloudinary.");
  }

  // ✅ Attach uploaded image URLs to req.body before validation
  req.body.productImage = uploadedURLs;

  // Coerce values like number, boolean etc. if needed (Zod can handle this)
  const validProduct = productValidate.parse(req.body);
  console.log("Valid vayo ✅");

  const productData = await createProductService(validProduct);

  return res
    .status(200)
    .json(new apiResponse(200, productData, "Product inserted successfully"));
});

export { insertProduct };
