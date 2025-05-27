import { Router } from "express";
import { getCookie, deleteCookie, signInAdmin, sendResetPasswordLink, checkTokenValidity, resetPassword } from "../controllers/auth.admin.controller.js";

const authAdminRouter = Router();

authAdminRouter.get("/cookie", getCookie);
authAdminRouter.post("/cookie", deleteCookie);
authAdminRouter.post("/signin", signInAdmin);
authAdminRouter.post("/password", sendResetPasswordLink);
authAdminRouter.post("/password/:token", checkTokenValidity);
authAdminRouter.post("/reset/:token", resetPassword);

export default authAdminRouter;