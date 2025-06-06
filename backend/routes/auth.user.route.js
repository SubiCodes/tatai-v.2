import { Router } from "express";
import { signIn } from "../controllers/auth.user.controller.js";

const authUserRouter = Router();

authUserRouter.post("/", signIn);

export default authUserRouter;