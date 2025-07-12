import { Router } from "express";
import { createDestroyBookmark, findBookmark } from "../controllers/bookmark.controller.js";

const bookmarkUserRouter = Router();

bookmarkUserRouter.get('/:userId/:guideId', findBookmark)
bookmarkUserRouter.post('/', createDestroyBookmark)

export default bookmarkUserRouter