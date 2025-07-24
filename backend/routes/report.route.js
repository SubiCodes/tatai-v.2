import { Router } from "express";
import { changeReviewedStatus, createReport, getReports } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.get('/', getReports);
reportRouter.post('/', createReport);
reportRouter.put('/:id', changeReviewedStatus);

export default reportRouter;