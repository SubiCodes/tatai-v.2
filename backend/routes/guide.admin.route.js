import { Router } from "express";
import { uploadMedia, deleteMedia, createGuide, deleteGuide, getGuides, updateStatus} from "../controllers/guide.admin.controller.js";

const guideAdminRouter = Router();

guideAdminRouter.get('/guide', getGuides)
guideAdminRouter.post('/guide', createGuide);
guideAdminRouter.delete('/guide/:id', deleteGuide);
guideAdminRouter.put('/guide/status/:id', updateStatus);
guideAdminRouter.post('/media', uploadMedia);
guideAdminRouter.delete('/media', deleteMedia);


export default guideAdminRouter;