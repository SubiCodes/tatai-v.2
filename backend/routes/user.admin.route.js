import { Router } from "express";

import { createUser, getAdminData } from "../controllers/user.admin.controller.js";

const userAdminRouter = Router();

userAdminRouter.get("/admin", getAdminData);
userAdminRouter.post("/user", createUser);

export default userAdminRouter;