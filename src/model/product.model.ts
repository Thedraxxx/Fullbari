
import mongoose, {Document, Model, ObjectId, Types} from "mongoose";
import { boolean } from "zod";
interface IProductDocument extends Document{
    productName: string;
    slug: string;  //SEO friendly banauna routes haruma use garinxa
    productPrice: number;
    productDiscription: string;
    productImage: string[];
    productDiscountPrice?: number;
    productCategory: Types.ObjectId;
    inStock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
    isDeleted: boolean
}
const productScehma = new mongoose.Schema<IProductDocument>(
{
    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    productDiscountPrice: {
      type: Number,
      min: 0,
    },
    productDiscription: {
      type: String,
      required: true,
    },
    productImage: {
      type: [String], // Cloudinary URLs
      required: true,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    inStock: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
},{timestamps: true});
productScehma.index({
  productName:"text",
  productDiscription: "text",
  tags: "text"
});
productScehma.index({
isAvailable: 1, 
  rating: -1 
})
productScehma.index({ 
  productCategory: 1, 
  isAvailable: 1, 
  productPrice: 1 
});

const Product: Model<IProductDocument> = mongoose.model<IProductDocument>("Product",productScehma);

export {Product, IProductDocument};
