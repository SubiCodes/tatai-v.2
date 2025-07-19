import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";
import Feedback from "../models/feedback.model.js";

export const fetchGuideFeedbacks = async (req, res) => {
    const { guideId } = req.params;
    try {
        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        };
        const feedbacks = await Feedback.find({ guideId: guideId }).populate({ path: "userId", select: "firstName lastName email profileIcon" });
        res.status(200).json({ success: true, message: "Feedbacks fetched!", data: feedbacks });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error fetching feedbacks' });
    }
};

export const fetchFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedbacks = await Feedback.findById(id).populate({ path: "userId", select: "firstName lastName email profileIcon" });
        res.status(200).json({ success: true, message: "Feedback fetched!", data: feedbacks });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error fetching feedback' });
    }
};

export const fetchFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate({ path: "userId", select: "firstName lastName email profileIcon" }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, message: "Feedback fetched!", data: feedbacks });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error fetching feedback' });
    }
};

export const fetchLatestFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate({ path: "userId", select: "firstName lastName email profileIcon" }).sort({ updatedAt: -1 }).limit(1);
        res.status(200).json({ success: true, message: "Feedback fetched!", data: feedbacks });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error fetching feedback' });
    }
};

export const createFeedback = async (req, res) => {
    const { userId, guideId, rating, comment } = req.body;
    try {
        console.log(userId, guideId, rating, comment)
        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        };
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        };
        const existingFeedback = await Feedback.findOne({ userId: userId, guideId: guideId });
        if (existingFeedback) {
            return res.status(404).json({ success: false, message: 'A feedback from user in this guide already exists.' });
        };
        const feedback = await Feedback.create({ userId: userId, guideId: guideId, rating: rating, comment: comment });
        const populatedFeedback = await feedback.populate({
            path: "userId",
            select: "firstName lastName email profileIcon"
        });
        res.status(200).json({ success: true, message: "Thank you for your feedback!", data: populatedFeedback });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error creating feedback' });
    }
};

export const editFeedback = async (req, res) => {
    const { userId, guideId, rating, comment, hidden } = req.body;
    try {
        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        };
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        };
        const feedback = await Feedback.findOne({ userId: userId, guideId: guideId }).populate({ path: "userId", select: "firstName lastName email profileIcon" });
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'A feedback from user in this guide already exists.' });
        };
        if (rating) { feedback.rating = rating }
        if (comment) { feedback.comment = comment }
        if (hidden) { feedback.hidden = !feedback.hidden }
        await feedback.save()
        res.status(200).json({ success: true, message: "Feedback successfully edited!", data: feedback });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error editing feedback' });
    }
}

export const deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        await feedback.deleteOne();
        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error deleting feedback' });
    }
}