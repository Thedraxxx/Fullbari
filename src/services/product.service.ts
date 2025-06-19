import { Product, IProductDocument } from "model/product.model";
import slugify from "slugify";
import apiError from "../utils/apiErrors";
import { IQueries } from "Schema/product.schema";
import type { FilterQuery } from "mongoose"
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
const getProductService = async (query: IQueries) => {
      const {queries,page,limit,category,sort,} = query;
       //searching| filtering ko lagi vo
      const matchStage: FilterQuery<IProductDocument>= { isAvailable: true } // yo chi document lai extend garako chainxa
      if(queries){
         matchStage.productName = { $regex : queries, $options: "i"};
      }
      if(category){
        matchStage.prductCategory = category;
      }
      //sorting ko lagi vo
      let sortStage: Record<string , 1|-1> = {}
      if(sort){
        switch(sort){
           case "oldest": 
                sortStage.createdAt = 1;
                break;
            case "newest":
               sortStage.createdAt =-1;
               break;
            case "priceDsc": 
              sortStage.productPrice = -1
              break; 
            case "priceAsc": 
               sortStage.productPrice = 1;
               break;
            default: 
              sortStage.createdAt = -1
              break;
        }
      }else{
        sortStage.create =-1;
      }
      //pagination ko lagi
       const pageNumber = page ? parseInt(page.toString()) : 1;
       const limitNumber = limit ? parseInt(limit.toString()) :10;
       const skip = (pageNumber-1)*limitNumber;
       //pipelin
         const pipeline = [
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        products: [
          { $skip: skip },
          { $limit: limitNumber }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    }
  ];

  const [result] = await Product.aggregate(pipeline);
  
  const products = result.products;
  const totalProducts = result.totalCount[0]?.count || 0;
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(totalProducts / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return {
    products,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      hasNextPage,
      hasPrevPage,
      limit: limitNumber
    }
  }
}
export { createProductService, getProductService };
