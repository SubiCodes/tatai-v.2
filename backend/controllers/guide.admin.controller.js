import Feedback from "../models/feedback.model.js";
import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { sendGuideStatusUpdate } from "../nodemailer/email.js";
import { createNotification } from "./notification.controller.js";
import { uploadGuidesToChatbot } from "./chatbot.controller.js";

export const uploadMedia = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "guideUploads",
      resource_type: "auto",
    });

    res.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getResourceTypeFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/");
    return parts[2] || "image";
  } catch {
    return "image";
  }
};

export const deleteMedia = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    const { publicId, url } = req.body;

    if (!publicId || !url) {
      return res.status(400).json({ error: "Missing publicId or url" });
    }

    const resource_type = getResourceTypeFromUrl(url);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    if (result.result === "ok") {
      res.json({ message: "Media deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete media" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const createGuide = async (req, res) => {
  const data = req.body.data;
  try {
    const poster = await User.findById(data.posterId);
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: `Please input information.` });
    }
    if (!poster) {
      return res
        .status(404)
        .json({ success: false, message: `User not found.` });
    }
    const newGuide = new Guide(data);
    if (poster._role !== "user") {
      newGuide.status = "accepted";
    }
    await newGuide.save();
    return res
      .status(201)
      .json({ success: true, message: `Guide posted successfully.` });
  } catch (error) {
    console.error("Error posting guide: ", error);
    return res
      .status(500)
      .json({ success: false, message: `Error posting guide: ${error}` });
  }
};

export const editGuide = async (req, res) => {
  const { data } = req.body;

  try {
    if (!data) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide the updated guide data.",
        });
    }
    const poster = await User.findById(data.posterId);
    if (!poster) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const guide = await Guide.findById(data._id);
    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found." });
    }
    console.log("User Role:", poster.role);

    let status = "accepted";
    if (poster.role === 'user') {
      status = "pending";
      console.log("New status:", status);
    }

    console.log("Final status:", status);

    // Update the guide fields with the new data
    guide.status = status;
    guide.posterId = data.posterId;
    guide.category = data.category;
    guide.title = data.title;
    guide.coverImage = data.coverImage;
    guide.description = data.description;
    guide.tools = data.tools;
    guide.materials = data.materials;
    guide.stepTitles = data.stepTitles;
    guide.stepDescriptions = data.stepDescriptions;
    guide.stepMedias = data.stepMedias;
    guide.closingMessage = data.closingMessage;
    guide.links = data.links;

    // Save the updated guide
    const updatedGuide = await guide.save();

    // Return success
    return res.status(200).json({
      success: true,
      message: "Guide updated successfully.",
      data: updatedGuide,
    });
  } catch (error) {
    console.error("Error editing guide: ", error);
    return res
      .status(500)
      .json({ success: false, message: `Error editing guide: ${error}` });
  }
};

export const deleteGuide = async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id);
    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to find guide." });
    }
    await Guide.deleteOne({ _id: id });
    await uploadGuidesToChatbot();
    return res
      .status(204)
      .json({ success: true, message: "Guide deleted successfully." });
  } catch (error) {
    console.error("Error deleting guide: ", error);
    return res
      .status(500)
      .json({ success: false, message: `Error deleting guide: ${error}` });
  }
};

export const getGuides = async (req, res) => {
  try {
    // Get all guides with populated poster info
    const guides = await Guide.find().populate({
      path: "posterId",
      select: "firstName lastName email profileIcon",
    });

    // Get guide IDs for feedback lookup
    const guideIds = guides.map(guide => guide._id);

    // Get all feedback for these guides
    const allFeedback = await Feedback.find({
      guideId: { $in: guideIds }
    }).populate({
      path: 'userId',
      select: "firstName lastName profileIcon"
    }).sort({ createdAt: -1 });

    // Group feedback by guideId
    const feedbackByGuide = allFeedback.reduce((acc, feedback) => {
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

    return res.status(200).json({
      success: true,
      message: "Guides fetched successfully.",
      data: guidesWithFeedback,
    });
  } catch (error) {
    console.error("Error fetching guides: ", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching guides: ${error.message}`,
    });
  }
};

export const getGuide = async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id).populate({ path: 'posterId', select: "firstName lastName email profileIcon" });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: `Guide no longer exists.`,
      });
    }

    const feedback = await Feedback.find({
      guideId: id,
      hidden: false
    }).populate({
      path: 'userId',
      select: "firstName lastName profileIcon"
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Guide fetched successfully.",
      data: guide,
      feedbacks: feedback
    });
  } catch (error) {
    console.error("Error fetching guides: ", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching guides: ${error.message}`,
    });
  }
};

export const updateStatus = async (req, res) => {
  const { status, reason } = req.body;
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id).populate({ path: 'posterId', select: "firstName lastName email" });
    if (!guide) {
      return res
        .status(400)
        .json({ success: false, message: `No guide found` });
    }
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: `Please choose a new status` });
    }
    guide.status = status.trim();
    await guide.save();
    await sendGuideStatusUpdate(guide.title, status, guide.posterId.email, reason);
    const notificationType = 'guide';
    const notificationDisplay = (status === 'accepted' ? 'success' : status === 'pending' ? 'info' : 'danger');
    await createNotification(guide.posterId._id, notificationType, notificationDisplay, `Your guide '${guide.title}' status has been updated to '${status}'`, reason);
    await uploadGuidesToChatbot();
    return res.status(200).json({
      success: true,
      message: `Successfully changed guide status to ${status}.`,
    });
  } catch (error) {
    console.error("Error updating guide status: ", error);
    return res.status(500).json({
      success: false,
      message: `Error updating guide status: ${error.message}`,
    });
  }
};
