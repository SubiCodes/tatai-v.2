import { Router } from "express";

import { createUser, getAdminData, getUsers, updateStatus } from "../controllers/user.admin.controller.js";

const userAdminRouter = Router();

userAdminRouter.get("/admin", getAdminData);
userAdminRouter.get("/user", getUsers);
userAdminRouter.post("/user", createUser);
userAdminRouter.post("/status/:id", updateStatus);

export default userAdminRouter;