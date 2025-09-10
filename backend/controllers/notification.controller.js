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

export const getNotifications = async (req, res) => {
    const { userId } = req.params;
    if (!userId) { return res.status(400).json({ success: false, message: 'User ID missing. Cannot proceed to fetching notifications.' }); }
    try {
        const notifications = await Notification.find({userId: userId}).sort({createdAt: -1});
        return res.status(200).json({ success: true, message: 'Notifications fetched.', data: notifications });
    } catch (error) {
        console.error('Error on fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error while fetching notifications occured.' });
    }
};

export const viewNotification = async (req, res) => {
    const { notificationId } = req.params;
    if (!notificationId) { return res.status(400).json({ success: false, message: 'Notification ID missing. Cannot proceed to editing the viewed status.' }); }
    try {
        const notification = await Notification.findById(notificationId);
        notification.viewed = true;
        await notification.save();
        return res.status(200).json({ success: true, message: 'Notification labeled as viewed.', data: { notification } });
    } catch (error) {
        console.error('Error on updating viewed status for notification:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error while updating the viewed status occured.' });
    }
};

export const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    if (!notificationId) { return res.status(400).json({ success: false, message: 'Notification ID missing. Cannot proceed to deleting the viewed status.' }); }
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }
        await notification.deleteOne();
        return res.status(200).json({success: true, message: 'Notification deleted successfully.'});
    } catch (error) {
        console.error('Error on deleting notification:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error while deleting notification occured.' });
    }
};