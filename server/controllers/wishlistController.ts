import { Request, Response } from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Products.js"; // Assuming your file is Products.js

// Get user's wishlist
// GET /api/wishlist
export const getWishlist = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id; // Adjust based on your auth middleware

    let wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
    );

    if (!wishlist) {
      // If user doesn't have a wishlist yet, return an empty one
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product to wishlist
// POST /api/wishlist
export const addToWishlist = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Create new wishlist with the product
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
    } else {
      // Check if product is already in the wishlist
      if (wishlist.products.includes(productId)) {
        return res
          .status(400)
          .json({ success: false, message: "Product already in wishlist" });
      }

      // Add product to existing wishlist
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(201).json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    // Remove the product from the array
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );
    await wishlist.save();

    res.json({ success: true, data: wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
