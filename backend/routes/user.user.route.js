import { Router } from "express";
import { createAccout, fetchUser, updatePreferences } from "../controllers/user.user.controller.js";

const userUserRouter = Router();

userUserRouter.post('/', createAccout);
userUserRouter.get('/:id', fetchUser);
userUserRouter.post('/preference', updatePreferences);

export default userUserRouter;