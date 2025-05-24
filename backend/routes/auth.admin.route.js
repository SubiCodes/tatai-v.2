import { Router } from "express";
import { getCookie, deleteCookie, signInAdmin } from "../controllers/auth.admin.controller.js";

const authAdminRouter = Router();

authAdminRouter.get("/cookie", getCookie);
authAdminRouter.post("/cookie", deleteCookie);
authAdminRouter.post("/signin", signInAdmin);

export default authAdminRouter;