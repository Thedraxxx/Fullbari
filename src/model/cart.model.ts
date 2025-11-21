import mongoose, { Document, Types } from "mongoose";

interface ICartSchema extends Document {
  userId: Types.ObjectId;
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "active" | "ordered" |"abandoned";
  isDeleted: boolean;
  totalQuantity: number
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
          min:1,
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "ordered","abandoned"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
cartSchema.pre("save", function (next) {
  this.totalPrice = this.products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  this.totalQuantity = this.products.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  next();
});


const Cart = mongoose.model<ICartSchema>("Cart", cartSchema);

export { Cart, ICartSchema };
