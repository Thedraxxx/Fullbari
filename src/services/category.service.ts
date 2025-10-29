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
console.log(categories);
return categories
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
      const { categoryId } = params;
      const {categoryName, discription} = data;  
       const category = await Category.findById(categoryId);
       if(!category){
            throw new apiError(404,"Categoryu not found!");
       }
      const updateData: Record<string , any> = {
            categoryName,
            discription,
           
      };
    const cleanData =  Object.fromEntries( Object.entries(updateData).filter(([_, v]) => v !== undefined));
    if(Object.keys(cleanData).length === 0){
      throw new apiError(401,"at least 1 field is required to update data")
    }
    if(cleanData.categoryName){
      cleanData.slug = slugify(cleanData.categoryName,{lower: true});
    }
    const updatedResponse = await Category.findByIdAndUpdate(params.categoryId,{
      $set: cleanData
    },{
      new: true
    });
    if(!updateCategoryService){
      throw new apiError(401,"falid to update")
    }
    return updatedResponse;



}
const deleteCategoryService = async(params: ICategoryId)=>{
    
      const deletedCategory = await Category.findByIdAndUpdate(params.categoryId,{
        isActive: false
      },{
        new: true
      });
      if(!deletedCategory){
        throw new apiError(401,"faild to delete catogory");
      }
      return deletedCategory;
}
const restoreCategoryService = async(params: ICategoryId)=>{
       const restoredCategory = await Category.findByIdAndUpdate(params.categoryId,{
        isActive: true
       },{
        new: true
       });
       if(!restoredCategory){
         throw new apiError(401,"faild to restore catogory");
       }
       return restoredCategory;
}
export {createCategoryService, getAllCategoryService, getSingleCategoryService, updateCategoryService, deleteCategoryService,restoreCategoryService}