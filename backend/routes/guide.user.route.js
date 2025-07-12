import { Router } from "express";
import { getGuides, getGuide, createGuide, uploadMedia, deleteMedia, getUserGuides, getBookmarkedGuides } from "../controllers/guide.user.controller.js";

const guideUserRouter = Router();

guideUserRouter.post('/media', uploadMedia);
guideUserRouter.delete('/media', deleteMedia);
guideUserRouter.post('/', createGuide);
guideUserRouter.get('/guides/:id', getGuide); //fetch individual guides
guideUserRouter.get('/guides', getGuides); //fetch guides
guideUserRouter.post('/user/guides/:id', getUserGuides) //fetch specific user guides using category as body parameter
guideUserRouter.get('/bookmark/:userId', getBookmarkedGuides); //fetch guides that are bookmarked by user

export default guideUserRouter;