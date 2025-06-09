import { Router } from "express";
import { resendVerificationToken, resetPassword, sendResetPasswordToken, signIn, verifyResetPassword, verifyUser } from "../controllers/auth.user.controller.js";

const authUserRouter = Router();

authUserRouter.post("/", signIn);
authUserRouter.post("/verify", verifyUser);
authUserRouter.post("/verify-resend", resendVerificationToken);
authUserRouter.get("/forgot-password/:email", sendResetPasswordToken);
authUserRouter.post("/forgot-password", verifyResetPassword);
authUserRouter.post("/reset-password", resetPassword);

export default authUserRouter;