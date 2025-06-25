import apiError from "../utils/apiErrors";
import Category from "../model/category.model";
import { ICategory,ICategoryId, IUpdateCategory } from "../Schema/category.schema";
import slugify from "slugify";


const createCategoryService = async(data: ICategory)=>
{
       const {categoryName, discription} = data;
       const slug = slugify(categoryName,{lower: true});
        const category= await Category.create({
            categoryName,
            slug,
            discription
          });
        return category;

}
const getAllCategoryService = async()=>{
       const categories = Category.find({isActive: true}).select("categoryName discription");
       return categories;
}
const getSingleCategoryService = async(params: ICategoryId)=>{
     const {categoryId} = params
        const category = await Category.findById(categoryId);
        console.log(category)
        if(!category){
          throw new apiError(401,"category not found")
        }
        return category;
}
const updateCategoryService = async(params: ICategoryId,data: IUpdateCategory )=>{
       
}
export {createCategoryService, getAllCategoryService, getSingleCategoryService, updateCategoryService}