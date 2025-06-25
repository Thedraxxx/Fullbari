import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { categoryValidate, categoryIdSchema, updateCategorySchema } from "../Schema/category.schema";
import { createCategoryService, deleteCategoryService, getAllCategoryService,getSingleCategoryService,restoreCategoryService,updateCategoryService} from "../services/category.service";
import apiResponse from "../utils/apiResponse";
const createCategory = asyncHandler(async(req:Request,res: Response)=>{
        const validData = categoryValidate.parse(req.body);
          const categoryData= await createCategoryService(validData);
         return res.status(200).json(new apiResponse(200,categoryData,"category successfuly created."))
});
const getAllCategory = asyncHandler(async(req: Request,res: Response)=>{
      const categories = await getAllCategoryService();
      return res.status(200).json(new apiResponse(200,categories,"Categories aayo..."))
});
const getSingleCategory = asyncHandler(async(req: Request,res: Response)=>{
      console.log(req.params)
         const validId = categoryIdSchema.parse(req.params);
      const category = await getSingleCategoryService(validId);
      return res.status(200).json(new apiResponse(200,category,"fetched successfully"))
});
const updateCategory = asyncHandler(async(req: Request,res: Response)=>{
      const validId = categoryIdSchema.parse(req.params);
      const ValidData = updateCategorySchema.parse(req.body);

      const updatedData = await updateCategoryService(validId,ValidData);
      return res.status(200).json(new apiResponse(200,updatedData,"Category successfully Updated"))
});
const deleteCategory = asyncHandler(async(req: Request,res: Response)=>{
      const validId = categoryIdSchema.parse(req.params);
      const deletedData = await deleteCategoryService(validId);
      return res.json(new apiResponse(400,deletedData,"category deleted successfully"));
});
const restoreCategory = asyncHandler(async(req: Request,res: Response)=>{
      const validId = categoryIdSchema.parse(req.params);
      const restoredData = await restoreCategoryService(validId);
      return res.json(new apiResponse(400,restoredData,"category restored successfully"));
});
export {createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory, restoreCategory};