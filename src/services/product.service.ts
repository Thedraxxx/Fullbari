import { Product, IProductDocument } from "../model/product.model";
import slugify from "slugify";
import apiError from "../utils/apiErrors";
import { IQueries, IProductId, IUpdateProduct } from "Schema/product.schema";
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
  isDeleted: boolean;
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
    isDeleted: false,
  };
  if (queries) {
    matchStage.$text = { $search: queries };
  }
  if (category) {
    matchStage.$text = { $search: category };
  }
  const sortStage: Record<string, 1 | -1> = {};
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
  const safePage = Array.isArray(page) ? page[0] : page ?? 1;
  const pageNumber = parseInt(safePage.toString());
  const limitNumber = limit ? parseInt(limit.toString()) : 10;
  const skip = (pageNumber - 1) * limitNumber;

  const pipeline = [
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        products: [{ $skip: skip }, { $limit: limitNumber }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];
  const [result] = await Product.aggregate(pipeline);
  const totalProduct = result.totalCount[0]?.count || 0;
  const products = result.products;

  const totalPages = Math.ceil(totalProduct / limitNumber);
  const hasPrevPage = 1 < pageNumber;
  const hasNextPage = totalPages > pageNumber;

  return {
    products,
    pagination: {
      totalProduct,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limitNumber,
    },
  };
};
const getSingleProductService = async (params: IProductId) => {
  const { productId } = params;

  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new apiError(400, "the product does not exist!");
  }
  return product;
};
const deleteProductService = async (params: IProductId) => {
  const deletedProduct = await Product.findByIdAndUpdate(params.productId, {
    isDeleted: true,
  }); //soft delete ...
  if (!deletedProduct) {
    throw new apiError(404, "Product not found or already deleted.");
  }
  return deletedProduct;
};
const updateProductService = async (
  data: IUpdateProduct,
  params: IProductId
) => {
  //     req.params → productId extract gara
  //    req.body → updated fields receive gara
  // Zod Validation → .partial() le optional banaune
  // Destructure updated fields
  // If productName cha → slug pani slugify() garera update gara
  // findByIdAndUpdate → { new: true } le updated doc return garxa
  // Return updated product to frontend
  const {
    productName,
    productPrice,
    productDiscription,
    productImage,
    productDiscountPrice,
    prductCategory,
    inStock,
    isAvailable,
  } = data;

  const product = await Product.findById(params.productId);
  if (!product) {
    throw new apiError(404, "Product Not found.");
  }
  // console.log(product)

  const updateData: Record<string, any> = {
    productName,
    productPrice,
    productDiscription,
    productImage,
    productDiscountPrice,
    prductCategory,
    inStock,
    isAvailable,
  };
  //removed undefinded field
    const cleanedUpdate = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );
   if (Object.keys(cleanedUpdate).length === 0) {
    throw new apiError(400, "Atleat one field is required to update");
  }
  if (cleanedUpdate.productName) {
    cleanedUpdate.slug = slugify(cleanedUpdate.productName, { lower: true });
  }
  if(cleanedUpdate.inStock === 0){
    cleanedUpdate.isAvailable =false;
  }
   
 

  const updatedProduct = await Product.findByIdAndUpdate(
    params.productId,
    {
      $set: cleanedUpdate,
    },
    {
      new: true,
    }
  ).lean();
  return updatedProduct;
};
export {
  createProductService,
  getProductService,
  getSingleProductService,
  deleteProductService,
  updateProductService,
};
