import Report from "../models/report.model.js";
import { sendReportReviewed } from "../nodemailer/email.js";
import { createNotification } from "./notification.controller.js";

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

        if (existingReport && !existingReport.reviewed) {
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
        const report = await Report.findById(id).populate({
            path: 'userId',
            select: 'firstName lastName email profileIcon',
        });;
        report.reviewed = reviewed;
        await report.save();
        if (reviewed === true) {
            sendReportReviewed(report.userId.email);
            await createNotification(report.userId._id, 'report', 'info', `Your report has been reviewed.`, `Your report regarding a ${report.type} has been reviewed by an admin. TatAI is proud of you for keeping our community safe.`);
        }
        return res.status(200).json({ success: true, message: 'Report reviewed status changed successfully.', data: report });
    } catch (error) {
        console.error('Error details on markAsReviewed:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
}

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate({ path: 'userId', select: 'email firstName lastName profileIcon' });
        return res.status(200).json({ success: true, message: 'Fetched all reports successfully', data: reports });
    } catch (error) {
        console.error('Error details on getReports:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
}

export const getReportById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: 'The id of the report instance not found.' });
    }

    try {
        const report = await Report.findById(id)
            .populate({
                path: 'userId',
                select: 'email firstName lastName profileIcon'
            })
            .populate({
                path: 'guideId',
                select: 'title coverImage category status posterId',
                populate: {
                    path: 'posterId',
                    select: 'email firstName lastName profileIcon'
                }
            })
            .populate({
                path: 'feedbackId',
                select: 'comment rating hidden userId guideId'
            })
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found.', data: {} });
        }
        return res.status(200).json({ success: true, message: 'Fetched report successfully', data: report });
    } catch (error) {
        console.error('Error details on getReportById:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occured.' });
    }
}