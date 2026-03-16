import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";

const CartRouter = express.Router();

//Get user cart
CartRouter.get("/", protect, getCart);

//Add product to cart
CartRouter.post("/aa", protect, addToCart);

//Update cart quantity
CartRouter.put("/item/:productId", protect, updateCartItem);

//Delete cart item
CartRouter.delete("/item/:productId", protect, removeCartItem);

//Clear cart
CartRouter.delete("/", protect, clearCart);

export default CartRouter;
