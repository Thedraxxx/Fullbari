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

const fetchAllProduct = asyncHandler(async (req: Request,res: Response)=>{
      //user la queris halxa...
      //yo queiris chi app huda trigger hunxa, user la search garda , search filter user garda with differnet category,
      // ani differnt typs la sort garda chi yo queris haru trigger hunxa ...
      //this is the public route ho...

      const {
          queris = "", //search garda aauxa 
          page = 1, //kun page for pagination
          limit = 10, 
          category= "",
          sort = "newest",
          tags= "",
      } = req.query;
      //matching
    const matchStage: any = {
       isAvailable: true
    }
    if(queris){
      matchStage.productName = { $regex: queris, $options: "i"}; //matching garxa regex la i=ignore
    }
    if(category){
      matchStage.productCategory = category;
    }
    //sorting 
    const sortStage: Record<string, 1|-1> = {}
    if(sort){
      switch(sort){
            case "newest": 
               sortStage.createdAt = -1;
               break;
            case "oldest":
              sortStage.createdAt = 1;
              break;
            case "priceDesc": 
              sortStage.productPrice = -1;
              break;
            case "priceAsc": 
              sortStage.productPrice = 1;
              break;
            default:
              sortStage.createdAt =-1;
              break;
      }
    }
    




})



export { insertProduct, fetchAllProduct };
