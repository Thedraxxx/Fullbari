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

  const slug = slugify(productName, { lower: true });

  const existedProduct = await Product.findOne({
    $or: [{ productName }, { slug }]
  });

  if (existedProduct) {
    throw new apiError(401, "Product with this name or slug already exists.");
  }

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
