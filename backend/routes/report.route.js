import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.post('/', createReport);

export default reportRouter;