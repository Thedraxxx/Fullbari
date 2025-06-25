import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { categoryValidate } from "../Schema/category.schema";
import { createCategoryService } from "../services/category.service";
import apiResponse from "../utils/apiResponse";
const createCategory = asyncHandler(async(req:Request,res: Response)=>{
        const validData = categoryValidate.parse(req.body);
          const categoryData= await createCategoryService(validData);
         return res.status(200).json(new apiResponse(200,categoryData,"category successfuly created."))
});

export {createCategory};