import { Product, IProductDocument } from "../model/product.model";
import slugify from "slugify";
import apiError from "../utils/apiErrors";
import { IQueries } from "Schema/product.schema";
import type { FilterQuery } from "mongoose";

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
    $or: [{ productName }, { slug }],
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
const getProductService = async (query: IQueries) => {
//   Frontend bata query aauxa
// matchStage banauxa
// sortStage banauxa
// Pagination calculate garincha
// Aggregation pipeline run garincha
// – $match → $sort → $facet (products + totalCount)
// Result destructure garincha
// – products + totalCount
// – Pagination metadata banaera frontend lai pathauncha
  const { queries, page, limit, category, sort } = query;
  console.log(queries);
       const matchStage: FilterQuery<IProductDocument> = {
          isAvailable: true,
       }
       if(queries){
         matchStage.$text = {$search: queries};

       }
       if(category){
        matchStage.$text = {$search: category};
       }
       const sortStage: Record<string, 1|-1> = {}
       if (sort) {
    switch (sort) {
      case "oldest":
        sortStage.createdAt = 1;
        break;
      case "newest":
        sortStage.createdAt = -1;
        break;
      case "priceDsc":
        sortStage.productPrice = -1;
        break;
      case "priceAsc":
        sortStage.productPrice = 1;
        break;
      default:
        sortStage.createdAt = -1;
        break;
    }
  } else {
    sortStage.create = -1;
  }
  const safePage = Array.isArray(page)? page[0]: page ?? 1;
  const pageNumber = parseInt(safePage.toString());
  const limitNumber = limit ? parseInt(limit.toString()): 10;
  const skip = (pageNumber -1) * limitNumber;

  const pipeline = [
         {$match: matchStage},
         {$sort: sortStage},
         {
          $facet: {
                products: [{$skip: skip},{$limit: limitNumber}],
                totalCount: [{$count: "count"}]
          }
        }
      ]
  const [result] = await Product.aggregate(pipeline)
  const totalProduct = result.totalCount[0]?.count || 0;
  const products = result.products;

  const totalPages = Math.ceil(totalProduct/limitNumber);
  const hasPrevPage = 1 < pageNumber;
  const hasNextPage = totalPages > pageNumber;

  return{
    products,
    pagination: {
      totalProduct,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limitNumber,
    }
  }
};
export { createProductService, getProductService };
