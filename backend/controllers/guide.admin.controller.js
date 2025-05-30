import Guide from "../models/guide.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

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

export const getGuides = async (req, res) => {
  try {
    const guides = await Guide.find().populate({
      path: "posterId",
      select: "firstName lastName email profileIcon",
    });

    return res.status(200).json({
      success: true,
      message: "Guide fetched successfully.",
      data: guides,
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
  const { status } = req.body;
  const { id } = req.params;
  try {
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(400).json({success: false, message: `No guide found`,}); 
    };
    if (!status) {
      return res.status(400).json({success: false, message: `Please choose a new status`}); 
    };
    guide.status = status.trim();
    await guide.save();
    return res.status(200).json({success: true, message: `Successfully changed guide status to ${status}.`}); 
  } catch (error) {
    console.error("Error updating guide status: ", error);
    return res.status(500).json({success: false, message: `Error updating guide status: ${error.message}`,});
  }
};
