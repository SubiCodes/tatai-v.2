import { Router } from "express";
import { deleteNotification, getNotifications, viewNotification } from "../controllers/notification.controller.js";


const notificationRouter = Router();

notificationRouter.get('/:userId', getNotifications);
notificationRouter.patch('/:notificationId', viewNotification);
notificationRouter.delete('/:notificationId', deleteNotification);


export default notificationRouter;