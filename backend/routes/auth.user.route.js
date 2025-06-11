import { Router } from "express";
import { validateUserAccess, resendVerificationToken, resetPassword, sendResetPasswordToken, signIn, verifyResetPassword, verifyUser } from "../controllers/auth.user.controller.js";

const authUserRouter = Router();

authUserRouter.post("/", signIn);
authUserRouter.post("/verify", verifyUser);
authUserRouter.post("/verify-resend", resendVerificationToken);
authUserRouter.get("/forgot-password/:email", sendResetPasswordToken);
authUserRouter.post("/forgot-password", verifyResetPassword);
authUserRouter.post("/reset-password", resetPassword);
authUserRouter.post("/validate-access/:id", validateUserAccess);

export default authUserRouter;