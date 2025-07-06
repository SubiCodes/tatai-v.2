import Guide from "../models/guide.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

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
  const data = req.body;
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
    if (poster.role !== "user") {
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

export const getUserGuides = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Please pass a user id.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist.' });
    }

    const guides = await Guide.find({ posterId: id, status: status })
      .sort({ createdAt: -1 })
      .populate({
        path: 'posterId',
        select: 'firstName lastName email profileIcon createdAt',
      });

    if (!guides) {
      return res.status(200).json({ success: true, message: 'User has no guides posted.', data: [] });
    } else {
      return res.status(200).json({ success: true, message: 'User has no guides posted.', data: guides });
    }
    
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: 'Error fetching user guides' });
  }
}
