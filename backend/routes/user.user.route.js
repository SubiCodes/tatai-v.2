import { Router } from "express";
import { createAccout, fetchUser, updatePreferences, updateUserProfile } from "../controllers/user.user.controller.js";

const userUserRouter = Router();

userUserRouter.post('/', createAccout);
userUserRouter.get('/:id', fetchUser);
userUserRouter.post('/profile', updateUserProfile);
userUserRouter.post('/preference', updatePreferences);

export default userUserRouter;