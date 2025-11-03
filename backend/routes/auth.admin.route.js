import { Router } from "express";
import { getCookie, deleteCookie, signInAdmin, sendResetPasswordLink, checkTokenValidity, resetPassword } from "../controllers/auth.admin.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const authAdminRouter = Router();

authAdminRouter.get("/cookie", getCookie);
authAdminRouter.post("/cookie", verifyAdmin, deleteCookie);
authAdminRouter.post("/signin", signInAdmin);
authAdminRouter.post("/password", sendResetPasswordLink);
authAdminRouter.post("/password/:token", checkTokenValidity);
authAdminRouter.post("/reset/:token", resetPassword);

export default authAdminRouter;