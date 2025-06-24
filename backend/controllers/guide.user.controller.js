import Guide from "../models/guide.model.js";

export const getGuides = async (req, res) => {
    const { category, amount } = req.query;
    try {
        if (category === 'all') {
            if (!amount) {
                const guides = await Guide.find({ status: 'accepted' })
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'posterId',
                        select: 'firstName lastName email profileIcon',
                    });
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            } else {
                const guides = await Guide.find({ status: 'accepted' })
                    .sort({ createdAt: -1 })
                    .limit(amount)
                    .populate({ path: 'posterId', select: 'firstName lastName email profileIcon', });
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            }
        } else {
            if (!amount) {
                const guides = await Guide.find({ status: 'accepted', category: category })
                    .sort({ createdAt: -1 })
                    .populate({ path: 'posterId', select: 'firstName lastName email profileIcon', });
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            } else {
                const guides = await Guide.find({ status: 'accepted', category: category })
                    .sort({ createdAt: -1 })
                    .limit(amount)
                    .populate({ path: 'posterId', select: 'firstName lastName email profileIcon', });
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching guides' })
    }
};

export const getGuide = async (req, res) => {
    const { id } = req.params;
    try {
        const guide = await Guide.findById(id).populate({
            path: 'posterId',
            select: 'firstName lastName email profileIcon'
        });

        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide no longer exists.' });
        }

        if (guide.status !== 'accepted') {
            return res.status(400).json({ success: false, message: 'Guide status not accepted.' });
        } else {
            return res.status(200).json({ success: true, message: `Guide fetched successfully.`, data: guide });
        }
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Error fetching guide' });
    }
}
