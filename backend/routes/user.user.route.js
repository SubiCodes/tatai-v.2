import { Router } from "express";
import { createAccout } from "../controllers/user.user.controller.js";

const userUserRouter = Router();

userUserRouter.post('/', createAccout);

export default userUserRouter;