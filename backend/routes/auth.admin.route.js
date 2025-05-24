import { Router } from "express";
import { createUser } from "../controllers/auth.admin.controller.js";

const authAdminRouter = Router();

authAdminRouter.post("/create", createUser)

export default authAdminRouter;