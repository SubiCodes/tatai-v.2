import Report from "../models/report.model.js";

export const createReport = async (req, res) => {
    const { userId, reportedUserId, feedbackId, guideId, type, description } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'The id of the reporter not found.' });
    }
    if (!reportedUserId) {
        return res.status(400).json({ success: false, message: 'The id of the reported user not found.' });
    }
    if (!feedbackId && !guideId) {
        return res.status(400).json({ success: false, message: 'The id of the reported instance not found.' });
    }
    if (!type || !description) {
        return res.status(400).json({ success: false, message: 'Type and description are required.' });
    }

    try {

        const existingReport = await Report.findOne({
            userId,
            reportedUserId,
            feedbackId: feedbackId || null,
            guideId: guideId || null,
        });

        if (existingReport) {
            return res.status(200).json({
                success: true,
                message: 'You have already submitted a report for this instance.',
                data: existingReport
            });
        }

        const report = await Report.create({
            userId,
            reportedUserId,
            feedbackId: feedbackId || null,
            guideId: guideId || null,
            type: type,
            description: description,
            reviewed: false
        });
        return res.status(201).json({ success: true, message: 'Report created successfully.', data: report });
    } catch (error) {
        console.error('Error details on createReport:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
};

export const changeReviewedStatus = async (req, res) => {
    const { id } = req.params;
    const { reviewed } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'The id of the report instance not found.' });
    }

    try {
        const report = await Report.findById(id);
        if (!report) {
            return res.status(400).json({ success: false, message: 'The report no longer exists.' });
        }
        report.reviewed = reviewed;
        await report.save();
        return res.status(200).json({ success: true, message: 'Report reviewed status changed successfully.' });
    } catch (error) {
        console.error('Error details on markAsReviewed:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
}