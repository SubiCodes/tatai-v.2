import Feedback from "../models/feedback.model.js";
import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";


export const getViewUserData = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({success: false, message: 'User ID is required' });
    }

    try {
        const user = await User.findById(id).select('-password -__v');
        if (!user) {
            return res.status(400).json({ error: 'User not found!' });
        }

        // Get guides posted by this user
        const guides = await Guide.find({ posterId: id })
            .populate({ path: 'posterId', select: 'firstName lastName email profileIcon' })
            .sort({ updatedAt: -1 });

        // Get guide IDs for feedback lookup
        const guideIds = guides.map(guide => guide._id);

        // Get all feedback for these user's guides
        const allGuideFeedback = await Feedback.find({
            guideId: { $in: guideIds }
        }).populate({
            path: 'userId',
            select: "firstName lastName profileIcon"
        }).sort({ createdAt: -1 });

        // Group feedback by guideId
        const feedbackByGuide = allGuideFeedback.reduce((acc, feedback) => {
            const guideId = feedback.guideId.toString();
            if (!acc[guideId]) {
                acc[guideId] = [];
            }
            acc[guideId].push(feedback);
            return acc;
        }, {});

        // Attach feedback to each guide
        const guidesWithFeedback = guides.map(guide => {
            const guideFeedback = feedbackByGuide[guide._id.toString()] || [];
            const averageRating = guideFeedback.length > 0
                ? parseFloat((guideFeedback.reduce((sum, f) => sum + f.rating, 0) / guideFeedback.length).toFixed(1))
                : 0;

            return {
                ...guide.toObject(),
                feedbacks: guideFeedback,
                averageRating,
                totalFeedback: guideFeedback.length
            };
        });

        // Calculate category counts
        const categoryCounts = {
            diy: 0,
            tool: 0,
            repair: 0,
        };

        for (const guide of guidesWithFeedback) {
            const cat = guide.category?.toLowerCase();
            if (categoryCounts.hasOwnProperty(cat)) {
                categoryCounts[cat]++;
            }
        }

        // Get feedback given by this user (separate from guide feedback)
        const userFeedbacks = await Feedback.find({ userId: id })
            .populate({ path: 'userId', select: 'firstName lastName email profileIcon' })
            .sort({ updatedAt: -1 });

        return res.status(200).json({ 
            success: true, 
            message: 'User data fetched successfully', 
            user: user, 
            guides: guidesWithFeedback,  // Now includes feedback data
            count: categoryCounts, 
            feedbacks: userFeedbacks    // Feedback given by this user
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}