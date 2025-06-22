import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import { productValidate, querySchema, productIdSchema } from "../Schema/product.schema";
import { createProductService, getProductService, getSingleProductService,deleteProductService} from "../services/product.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiErrors";
import uploadOnCloudnary from "../utils/cloudnary";
import { ZodError } from "zod";

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
});
const fetchSingleProduct = asyncHandler(async(req: Request, res: Response)=>{
      try {
        const validParams = productIdSchema.parse(req.params)
         const productDetails = await getSingleProductService(validParams);
         return res.status(200).json(
          new apiResponse(200,productDetails,"Product fetched sucessfylly")
         )
      } catch (error) {
         if(error instanceof ZodError){
           throw new apiError(400," Invaldi product ID",)
         }
         else{
          throw error;
         }
      }
});
const deleteProduct = asyncHandler(async (req: Request,res: Response)=>{
      const validateId = productIdSchema.parse(req.params);
           const deletedProduct = await deleteProductService(validateId);

           return res.status(200).json(new apiResponse(200,deletedProduct,"Product deleted Successfully"))
});
const editProduct = asyncHandler(async(req: Request,res: Response)=>{
      
})



export { insertProduct, fetchAllProduct, fetchSingleProduct, deleteProduct, editProduct };
