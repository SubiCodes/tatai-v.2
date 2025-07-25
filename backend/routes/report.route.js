import { Router } from "express";
import { changeReviewedStatus, createReport, getReportById, getReports } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.get('/', getReports);
reportRouter.get('/:id', getReportById);
reportRouter.post('/', createReport);
reportRouter.put('/:id', changeReviewedStatus);

export default reportRouter;