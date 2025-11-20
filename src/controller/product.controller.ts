import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
  productValidate,
  querySchema,
  productIdSchema,
  updateProductSchema,
} from "../Schema/product.schema";
import {
  createProductService,
  getProductService,
  getSingleProductService,
  deleteProductService,
  updateProductService,
  restoreProductService,
  fetchAllDeletedProduct,
  hardDeleteService
} from "../services/product.service";
import apiResponse from "../utils/apiResponse";
import apiError from "../utils/apiErrors";
import { uploadOnCloudnary } from "../utils/cloudnary";
import { ZodError } from "zod";

const insertProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new apiError(401, "Product images are required");
  }

  const imagePaths = files.map((file) => file.path);


  const uploadedURLs: string[] = [];

  for (const path of imagePaths) {
    const url = await uploadOnCloudnary(path);
    if (url) {
      uploadedURLs.push(url);
    }
  }

  if (uploadedURLs.length === 0) {
    throw new apiError(401, "Failed to upload images to Cloudinary.");
  }


  req.body.productImage = uploadedURLs;

  const validProduct = productValidate.parse(req.body);


  const productData = await createProductService(validProduct);

  return res
    .status(200)
    .json(new apiResponse(200, productData, "Product inserted successfully"));
});
const fetchAllProduct = asyncHandler(async (req: Request, res: Response) => {
  const validatedQueries = querySchema.parse(req.query);
  const productData = await getProductService(validatedQueries);
  res
    .status(200)
    .json(new apiResponse(200, productData, "successfully fetched data"));
});
const fetchSingleProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validParams = productIdSchema.parse(req.params);
    const productDetails = await getSingleProductService(validParams);
    return res
      .status(200)
      .json(
        new apiResponse(200, productDetails, "Product fetched sucessfylly")
      );
  } catch (error) {
    if (error instanceof ZodError) {
      throw new apiError(400, " Invaldi product ID");
    } else {
      throw error;
    }
  }
});
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const validateId = productIdSchema.parse(req.params);
  const deletedProduct = await deleteProductService(validateId);
        
  return res
    .status(200)
    .json(new apiResponse(200, deletedProduct, "Product deleted Successfully"));
});
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    const imagePaths = files.map((file) => file.path);
    const uploadedURLs: string[] = [];
    for (const path of imagePaths) {
      const url = await uploadOnCloudnary(path);
      if (url) {
        uploadedURLs.push(url);
      }
    }
    const existingImages = req.body.existingImages 
      ? JSON.parse(req.body.existingImages) 
      : [];
    
    req.body.productImage = [...existingImages, ...uploadedURLs];
  } else if (req.body.existingImages) {

    req.body.productImage = JSON.parse(req.body.existingImages);
  }
  if (req.body.removeImages) {
    const removeList = req.body.removeImages.split(',');
    req.body.productImage = req.body.productImage.filter(
      (img: string) => !removeList.includes(img)
    );
  
  }
  const validatedProduct = updateProductSchema.parse(req.body);
  const productId = productIdSchema.parse(req.params);

  const updatedProduct = await updateProductService(
    validatedProduct,
    productId
  );
  
  return res
    .status(200)
    .json(new apiResponse(200, updatedProduct, "Product updated successfully"));
});
const getDeletedProducts = asyncHandler(async(req:Request,res:Response)=>{

     const deletedProducts = await fetchAllDeletedProduct();
     return res.status(200).json(new apiResponse(200,deletedProducts,"Successfully fetch the delted product"))
})
const restoreProduct = asyncHandler(async (req: Request,res: Response)=>{
        const productId = productIdSchema.parse(req.params);
        const restoredProduct = await restoreProductService(productId);
        return res.status(200).json(new apiResponse(200,restoredProduct,"Product restored successfully."))

});
const hardDeleteProduct = asyncHandler(async(req:Request, res: Response)=>{
       //id aauaca params bata ...
       //find the product by the id and delete it...
       //before delete chekr the flag in isDelete...
       //find the image in the cloudnary and deltete the image also form the cloudnary ....
       //retrun the product is delete message...
       const productId = productIdSchema.parse(req.params);
       const deletedProduct = await hardDeleteService(productId);
       return res.status(200).json(new apiResponse(200,deletedProduct,"product deleted SuccessFully"));
})

export {
  insertProduct,
  fetchAllProduct,
  fetchSingleProduct,
  deleteProduct,
  updateProduct,
  restoreProduct,
  getDeletedProducts,
  hardDeleteProduct
};
