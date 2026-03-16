import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const AdminRouter = express.Router();

//Get dashboard stats (Admin only)
AdminRouter.get("/stats", protect, authorize("admin"), getDashboardStats);

export default AdminRouter;
