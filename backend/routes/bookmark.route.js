import { Router } from "express";
import { createDestroyBookmark } from "../controllers/bookmark.controller.js";

const bookmarkUserRouter = Router();

bookmarkUserRouter.post('/', createDestroyBookmark)

export default bookmarkUserRouter