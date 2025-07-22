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
        const guides = await Guide.find({ posterId: id }).populate({ path: 'posterId', select: 'firstName lastName email profileIcon' }).sort({ updatedAt: -1 });
        const categoryCounts = {
            diy: 0,
            tool: 0,
            repair: 0,
        };
        for (const guide of guides) {
            const cat = guide.category?.toLowerCase();
            if (categoryCounts.hasOwnProperty(cat)) {
                categoryCounts[cat]++;
            }
        }
        return res.status(200).json({ success: true, message: 'User data fetched successfully', user: user, guides: guides, count: categoryCounts });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}