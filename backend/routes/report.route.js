import { Router } from "express";
import { changeReviewedStatus, createReport } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.post('/', createReport);
reportRouter.put('/:id', changeReviewedStatus);

export default reportRouter;