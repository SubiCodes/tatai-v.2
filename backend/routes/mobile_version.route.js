import { Router } from "express";
import { getCurrentMobileVersion, updateMobileVersion } from "../controllers/mobile_version.controller.js";

const mobileVersionRouter = Router();

mobileVersionRouter.get('/', getCurrentMobileVersion);
mobileVersionRouter.post('/', updateMobileVersion);

export default mobileVersionRouter;
