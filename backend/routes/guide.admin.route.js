import { Router } from "express";
import { uploadMedia, createGuide, getGuides, updateStatus} from "../controllers/guide.admin.controller.js";

const guideAdminRouter = Router();

guideAdminRouter.get('/guide', getGuides)
guideAdminRouter.post('/guide', createGuide);
guideAdminRouter.put('/guide/status/:id', updateStatus);
guideAdminRouter.post('/media', uploadMedia);


export default guideAdminRouter;