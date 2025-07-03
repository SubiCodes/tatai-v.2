import { Router } from "express";
import { searchReccomendations, searchResults } from "../controllers/search.user.controller.js";

const searchUserRouter = Router();

searchUserRouter.post('/reccomendations', searchReccomendations);
searchUserRouter.post('/results', searchResults);

export default searchUserRouter;
