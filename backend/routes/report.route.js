import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";

const reportRouter = Router();

reportRouter.post('/', createReport);
reportRouter.put('/:id', createReport);

export default reportRouter;