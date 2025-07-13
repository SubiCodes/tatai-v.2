import Guide from "../models/guide.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Bookmark from "../models/bookmark.model.js";

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

    // Update the guide fields with the new data
    guide.status = data.status;
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
    return res
      .status(200)
      .json({ success: true, message: "Guide deleted successfully." });
  } catch (error) {
    console.error("Error deleting guide: ", error);
    return res
      .status(500)
      .json({ success: false, message: `Error deleting guide: ${error}` });
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

    return res.status(200).json({ success: true, message: `Guide fetched successfully.`, data: guide });

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
    if (status === 'all') {
      const guides = await Guide.find({ posterId: id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'posterId',
          select: 'firstName lastName email profileIcon createdAt role',
        });
      return res.status(200).json({ success: true, message: 'User guides fetched.', data: { user: user, guides: guides } });
    } else {
      const guides = await Guide.find({ posterId: id, status: status })
        .sort({ createdAt: -1 })
        .populate({
          path: 'posterId',
          select: 'firstName lastName email profileIcon createdAt role',
        });

      if (!guides) {
        return res.status(200).json({ success: true, message: 'User has no guides posted.', data: { user: user, guides: [] } });
      } else {
        return res.status(200).json({ success: true, message: 'User guides fetched.', data: { user: user, guides: guides } });
      }
    }
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: 'Error fetching user guides' });
  }
}

export const getBookmarkedGuides = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ success: false, message: 'Missing paramater' });
  }

  try {
    const bookmarks = await Bookmark.find({ userId: userId });
    if (!bookmarks.length) {
      return res.status(200).json({ success: true, data: [], message: 'No bookmarked guides found' })
    };

    const guides = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const guide = await Guide.findById(bookmark.guideId).sort({ createdAt: -1 })
          .populate({
            path: 'posterId',
            select: 'firstName lastName email profileIcon createdAt role',
          });
        return guide;
      })
    );

    // Filter out nulls if any guide not found
    const validGuides = guides.filter(Boolean);
    return res.status(200).json({ success: true, data: validGuides, message: 'Fetched bookmarked guides' });

  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookmarked guides' });
  }
}
