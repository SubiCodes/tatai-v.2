import { Router } from "express";
import { getAdminData, updateIcon, updateProfile, updatePassword } from "../controllers/profile.admin.controller.js";

const profileAdminRouter = Router();

profileAdminRouter.get("/admin", getAdminData);
profileAdminRouter.post("/admin/:id", updateProfile);
profileAdminRouter.post("/icon/:id", updateIcon);
profileAdminRouter.post("/password/:id", updatePassword);

export default profileAdminRouter;