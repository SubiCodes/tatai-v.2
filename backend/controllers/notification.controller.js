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
};

export const viewNotification = async (req, res) => {
    const { notificationId } = req.params;
    if (!notificationId) { return res.status(400).json({ success: false, message: 'Notification ID missing. Cannot proceed to editing the viewed status.' }); }
    try {
        const notification = await Notification.findById(notificationId);
        notification.viewed = true;
        await notification.save();
        return res.status(200).json({ success: true, message: 'Notification labeled as viewed.', data: {notification}});
    } catch (error) {
        console.error('Error on updating viewed status for notification:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error while updating the viewed status occured.' });
    }
};