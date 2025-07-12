import Bookmark from "../models/bookmark.model.js";

export const createDestroyBookmark = async (req, res) => {
    const { userId, guideId } = req.body;

    if (!userId || !guideId) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    try {
        const bookmark = await Bookmark.findOne({ userId: userId, guideId: guideId });
        if (!bookmark) {
            //create one
            await Bookmark.create({ userId, guideId });
            return res.status(200).json({ success: true, message: 'Bookmark added successfully' });
        } else {
            //delete existing
            await Bookmark.deleteOne({_id: bookmark._id});
            return res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
        }
    } catch (error) {
        console.log("Someting went wrong while creating / destroying bookmark", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};