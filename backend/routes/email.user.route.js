import { Router } from "express";
import { sendUserConcern } from "../controllers/email.user.controller.js";

const emailUserRouter = Router();

emailUserRouter.post('/concern/:id', sendUserConcern);

export default emailUserRouter;