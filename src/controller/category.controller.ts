import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { categoryValidate } from "../Schema/category.schema";
import { createCategoryService, getAllCategoryService } from "../services/category.service";
import apiResponse from "../utils/apiResponse";
const createCategory = asyncHandler(async(req:Request,res: Response)=>{
        const validData = categoryValidate.parse(req.body);
          const categoryData= await createCategoryService(validData);
         return res.status(200).json(new apiResponse(200,categoryData,"category successfuly created."))
});
const getAllCategory = asyncHandler(async(req: Request,res: Response)=>{
      const categories = await getAllCategoryService();
      return res.status(200).json(new apiResponse(200,categories,"Categories aayo..."))
})

export {createCategory, getAllCategory};