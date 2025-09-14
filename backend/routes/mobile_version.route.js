import { Router } from "express";
import { getCurrentMobileVersion } from "../controllers/mobile_version.controller.js";

const mobileVersionRouter = Router();

mobileVersionRouter.get('/reccomndations', getCurrentMobileVersion);

export default mobileVersionRouter;
