import { Router } from "express";
import { uploadMedia, createGuide, getGuides} from "../controllers/guide.admin.controller.js";

const guideAdminRouter = Router();

guideAdminRouter.get('/guide', getGuides)
guideAdminRouter.post('/guide', createGuide);
guideAdminRouter.post('/media', uploadMedia);


export default guideAdminRouter;