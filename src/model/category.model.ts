

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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

const Category = mongoose.model("categories",categorySchema);

export default Category;