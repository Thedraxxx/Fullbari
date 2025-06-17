import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate } from "../Schema/product.schema";
import { createProductService } from "../services/product.service";
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
const fetchAllProduct = asyncHandler(async (req: Request, res: Response) => {
  //first ma query string bata page, limits, query, sortBy, sortType lai destructure garne
  //ani aggrigate query banaune 
  //aggrigate query ma match, sort, skip, limit use garne
  const {
    page = 1,
    limits = 10,
    query = "",
    categorry,
    sort= "newest",
    minPrice,
    maxPrice,
    minRating
  } = req.query;
  const matchStage: any = {
      isAvailabel: true
  }
  if(query){
    matchStage.productName = {$reges: query, $options: "i"}
  }
  if(categorry){
    matchStage.prductCategory = categorry
  }
  if(minPrice || maxPrice){
    matchStage.productPrice = {};
    if(minPrice) matchStage.productPrice.$gre = Number(minPrice);
    if(maxPrice) matchStage.productPrice.$lte = Number(maxPrice)
  }
  if(minRating){
    matchStage.rating = {$gre: Number(minRating)}
  }

});

export { insertProduct, fetchAllProduct };
