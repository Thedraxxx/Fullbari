export interface IProduct {
  productName: string;
  productPrice: number;
  productDiscription: string;
  productImage: string[];
  productCategory: string;
  inStock: number;
  isAvailable: boolean;
  rating: number;
  numReviews: number;
  productDiscountPrice?: number | undefined;
  tags?: string[] | undefined;
  isDeleted: boolean;
}

