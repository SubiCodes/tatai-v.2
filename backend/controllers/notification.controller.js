import Notification from "../models/notification.model.js";

export const createNotification = async (userId, type, display, title, message) => {
    if (!userId || !type || !display || !title || !message) {
        return;
    }
    try {
        const newNotification = new Notification({ userId, type, display, title, message });
        await newNotification.save();
        return (newNotification);
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    } 
} 