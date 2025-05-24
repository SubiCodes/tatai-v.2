import { Router } from "express";
import { getCookie, signInAdmin } from "../controllers/auth.admin.controller.js";

const authAdminRouter = Router();

authAdminRouter.get("/cookie", getCookie);
authAdminRouter.post("/signin", signInAdmin);

export default authAdminRouter;