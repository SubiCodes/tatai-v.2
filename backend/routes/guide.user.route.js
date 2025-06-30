import { Router } from "express";
import { getGuides, getGuide, createGuide, uploadMedia, deleteMedia } from "../controllers/guide.user.controller.js";

const guideUserRouter = Router();

guideUserRouter.post('/media', uploadMedia);
guideUserRouter.delete('/media', deleteMedia);
guideUserRouter.post('/', createGuide);
guideUserRouter.get('/guides/:id', getGuide);
guideUserRouter.get('/guides', getGuides);

export default guideUserRouter;