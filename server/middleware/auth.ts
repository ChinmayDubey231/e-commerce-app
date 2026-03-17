import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    // Manually verify the JWT token directly
    const { verifyToken } = await import("@clerk/backend");

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    }).catch((err) => {
      console.error("❌ verifyToken failed:", err.message); // will show "token expired" etc.
      return null;
    });
    if (!payload) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not synced" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("💀 Auth Failed:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "User role not authorized to access this route.",
      });
    }
    next();
  };
};
