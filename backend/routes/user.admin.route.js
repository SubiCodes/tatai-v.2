import { Router } from "express";

import { createUser, getUsers, updateStatus } from "../controllers/user.admin.controller.js";

const userAdminRouter = Router();

userAdminRouter.get("/user", getUsers);
userAdminRouter.post("/user", createUser);
userAdminRouter.post("/status/:id", updateStatus);

export default userAdminRouter;