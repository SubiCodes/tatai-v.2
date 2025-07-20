export const createReport = async (req, res) => {
    const { userId, feedbackId, guideId, type, description } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'The id of the reporter not found.' });
    }
    if (!feedbackId && !guideId) {
        return res.status(400).json({ success: false, message: 'The id of the reported instance not found.' });
    }
    if (!type || !description) {
        return res.status(400).json({ success: false, message: 'Type and description are required.' });
    }

    try {
        // const report = await Report
    } catch (error) {
        console.error('Error details on createReport:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
}