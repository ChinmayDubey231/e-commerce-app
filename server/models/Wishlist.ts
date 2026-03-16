import mongoose, { Document, Schema } from "mongoose";
import { IWishlist } from "../types/index.js";

// export interface IWishlist extends Document {
//   user: mongoose.Types.ObjectId;
//   products: mongoose.Types.ObjectId[];
// }

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
