import { Router } from "express";
import { createGuide, uploadMedia } from "../controllers/guide.admin.controller.js";

const guideAdminRouter = Router();

guideAdminRouter.post('/media', uploadMedia);
guideAdminRouter.post('/guide', createGuide);

export default guideAdminRouter;