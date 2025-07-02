import { Router } from "express";
import { searchReccomendations } from "../controllers/search.user.controller.js";

const searchUserRouter = Router();

searchUserRouter.post('/reccomendations', searchReccomendations);

export default searchUserRouter;
