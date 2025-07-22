import { Router } from "express";
import { getViewUserData } from "../controllers/viewUser.admin.controller.js";

const viewUserAdminRouter = Router();

viewUserAdminRouter.get("/:id", getViewUserData);

export default viewUserAdminRouter;