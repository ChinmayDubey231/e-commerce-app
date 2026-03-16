import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const WishlistRouter = express.Router();

// Apply the protect middleware to all wishlist routes
WishlistRouter.use(protect);

WishlistRouter.route("/").get(getWishlist).post(addToWishlist);

WishlistRouter.route("/:productId").delete(removeFromWishlist);

export default WishlistRouter;
