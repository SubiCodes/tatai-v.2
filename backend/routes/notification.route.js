import { Router } from "express";
import { deleteNotification, viewNotification } from "../controllers/notification.controller.js";


const notificationRouter = Router();

notificationRouter.patch('/:notificationId', viewNotification);
notificationRouter.delete('/:notificationId', deleteNotification);


export default notificationRouter;