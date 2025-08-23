import { Router } from "express";
import { getAdminDashboard } from "../controllers/dashboard.admin.controller.js";

const dashboardRouter = Router();

dashboardRouter.get('/', getAdminDashboard);

export default dashboardRouter;