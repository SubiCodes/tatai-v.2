import { Router } from "express";
import { createDestroyBookmark } from "../controllers/bookmark.controller.js";

const bookmarkUserRouter = Router();

bookmarkUserRouter.get('/:userId/:guideId')
bookmarkUserRouter.post('/', createDestroyBookmark)

export default bookmarkUserRouter