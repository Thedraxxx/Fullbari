import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate, querySchema, productIdSchema } from "../Schema/product.schema";
import { createProductService, getProductService, getSingleProductService } from "../services/product.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiErrors";
import uploadOnCloudnary from "../utils/cloudnary";

const insertProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  // console.log(req.files);
  if (!files || files.length === 0) {
    throw new apiError(401, "Product images are required");
  }

  const imagePaths = files.map((file) => file.path);
  // console.log("Uploaded paths:", imagePaths);

  const uploadedURLs: string[] = [];

  for (const path of imagePaths) {
    const url = await uploadOnCloudnary(path);
    if (url) {
      uploadedURLs.push(url);
    }
  }
  //  console.log(uploadedURLs)
  if (uploadedURLs.length === 0) {
    throw new apiError(401, "Failed to upload images to Cloudinary.");
  }

  //  Attach uploaded image URLs to req.body before validation
  req.body.productImage = uploadedURLs;

  const validProduct = productValidate.parse(req.body);
  // console.log("Valid vayo");

  const productData = await createProductService(validProduct);

  return res
    .status(200)
    .json(new apiResponse(200, productData, "Product inserted successfully"));
});

const fetchAllProduct = asyncHandler(async (req: Request,res: Response)=>{
      const validatedQueries = querySchema.parse(req.query);
      const productData = await getProductService(validatedQueries);
      res.status(200).json(
         new apiResponse(200,productData,"successfully fetched data")
      )
})
const fetchSingleProduct = asyncHandler(async(req: Request, res: Response)=>{
      const productId = productIdSchema.parse(req.params)
       const productDetails = await getSingleProductService(productId);
       return res.status(200).json(
        new apiResponse(200,productDetails,"Single video is fetchd!")
       )
})



export { insertProduct, fetchAllProduct, fetchSingleProduct };
