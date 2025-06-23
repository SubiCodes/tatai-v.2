import { Router } from "express";
import { getGuides } from "../controllers/guide.user.controller.js";

const guideUserRouter = Router();

guideUserRouter.get('/guides', getGuides)

export default guideUserRouter;