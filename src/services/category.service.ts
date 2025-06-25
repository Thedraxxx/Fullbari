import Category from "../model/category.model";
import { ICategory } from "../Schema/category.schema";
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

export {createCategoryService, getAllCategoryService}