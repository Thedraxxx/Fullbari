

import mongoose from "mongoose";
import { Model } from "mongoose";
  interface IExtendDocument extends Document{
     categoryName: string,
     slug: string,
     discription: string,
     isActive: boolean
  }
const categorySchema= new mongoose.Schema<IExtendDocument> ({
    categoryName: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    discription: {
        type: String,
    },
    isActive: {
        default: true,
    }
},{timestamps: true});

const Category: Model<IExtendDocument> = mongoose.model<IExtendDocument>("categories",categorySchema);

export default Category;