import { Router } from "express";

const viewUserAdminRouter = Router();

viewUserAdminRouter.get("/:id", getViewUserData);

export default viewUserAdminRouter;