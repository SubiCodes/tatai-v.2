import { Router } from "express";
import { resendVerificationToken, signIn, verifyUser } from "../controllers/auth.user.controller.js";

const authUserRouter = Router();

authUserRouter.post("/", signIn);
authUserRouter.post("/verify", verifyUser);
authUserRouter.post("/verify-resend", resendVerificationToken);

export default authUserRouter;