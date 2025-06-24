import { Router } from "express";
import { getGuides, getGuide } from "../controllers/guide.user.controller.js";

const guideUserRouter = Router();

guideUserRouter.get('/guides/:id', getGuide);
guideUserRouter.get('/guides', getGuides);

export default guideUserRouter;