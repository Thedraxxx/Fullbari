import Product from "../model/product.model";
import slugify from "slugify";
import apiError from "../utils/apiErrors";
interface IProduct {
  productName: string;
  productPrice: number;
  productDiscription: string;
  productImage: string[];
  prductCategory: string;
  inStock: number;
  isAvailable: boolean;
  rating: number;
  numReviews: number;
  productDiscountPrice?: number | undefined;
  tags?: string[] | undefined;
}
const createProductService = async (data: IProduct) => {
  const {
    productName,
    productPrice,
    productDiscription,
    productImage,
    productDiscountPrice,
    prductCategory,
    inStock,
    isAvailable,
    rating,
    numReviews,
  } = data;
   
  const existedProduct =  await Product.findOne({productName: productName});
  if(existedProduct){
    throw new apiError(401,"Product already exist.")
  }

   const slug = slugify(productName,{lower: true})
  const product = await Product.create({
    productName,
    slug,
    productPrice,
    productDiscription,
    productImage,
    productDiscountPrice,
    prductCategory,
    inStock,
    isAvailable,
    rating,
    numReviews,
  });

  return product;
};

export { createProductService };
