import { Router } from "express";
import { createAccout, fetchUser, updatePreferences, updateUserProfile, fetchPreferences } from "../controllers/user.user.controller.js";

const userUserRouter = Router();

userUserRouter.post('/', createAccout);
userUserRouter.get('/:id', fetchUser);
userUserRouter.post('/profile', updateUserProfile);
userUserRouter.get('/preference/:id', fetchPreferences);
userUserRouter.post('/preference', updatePreferences);

export default userUserRouter;