import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) return console.error("ADMIN_EMAIL is not defined in .env file");
    const user = await User.findOneAndUpdate({ email }, { role: "admin" });
    if (user) {
      await clerkClient.users.updateUserMetadata(user.clerkId as string, {
        publicMetadata: {
          role: "admin",
        },
      });
    }
  } catch (error: any) {
    console.error("Admin promotion failed:", error);
  }
};

export default makeAdmin;
