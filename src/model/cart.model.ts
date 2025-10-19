import mongoose, { Document, Types } from "mongoose";

interface ICartSchema extends Document {
  userId: Types.ObjectId;
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "active" | "ordered";
  isDeleted: boolean;
}

const cartSchema = new mongoose.Schema<ICartSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "ordered"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICartSchema>("Cart", cartSchema);

export { Cart, ICartSchema };
