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
                        select: 'firstName lastName email profileIcon',});
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            } else {
                const guides = await Guide.find({ status: 'accepted' })
                    .sort({ createdAt: -1 })
                    .limit(amount)
                    .populate({path: 'posterId', select: 'firstName lastName email profileIcon',});
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            }
        } else {
            if (!amount) {
                const guides = await Guide.find({ status: 'accepted', category: category })
                    .sort({ createdAt: -1 })
                    .populate({path: 'posterId', select: 'firstName lastName email profileIcon',});
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            } else {
                const guides = await Guide.find({ status: 'accepted', category: category })
                    .sort({ createdAt: -1 })
                    .limit(amount)
                    .populate({path: 'posterId',select: 'firstName lastName email profileIcon',});
                return res.status(201).json({ success: true, message: `Guide fetched successfully.`, data: guides });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong fetching guides." });
    }
};
