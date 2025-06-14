
import mongoose, {Document, Model} from "mongoose";
interface IProduct extends Document{
    productName: string;
    slug: string;  //SEO friendly banauna routes haruma use garinxa
    productPrice: number;
    productDiscription: string;
    productImage: string[];
    productDiscountPrice?: number;
    prductCategory: string;
    inStock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    tags: string[];
}
const productScehma = new mongoose.Schema<IProduct>(
{
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
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
    prductCategory: {
      type: String,
      required: true,
      enum: ["indoor", "outdoor", "succulent", "flowering", "airPurifier"],
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
},{timestamps: true});

const Product: Model<IProduct> = mongoose.model<IProduct>("Product",productScehma);

export default Product;