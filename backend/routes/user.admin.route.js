import { Router } from "express";

import { createUser, getUsers, updateRole, updateStatus } from "../controllers/user.admin.controller.js";

const userAdminRouter = Router();

userAdminRouter.get("/user", getUsers);
userAdminRouter.post("/user", createUser);
userAdminRouter.post("/status/:id", updateStatus);
userAdminRouter.post("/role/:id", updateRole);

export default userAdminRouter;