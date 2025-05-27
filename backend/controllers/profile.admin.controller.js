import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAdminData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.userId;

    console.log(id);

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving user data.",
        error: error.message,
      });
  }
};

export const updateIcon = async (req, res) => {
  const { icon } = req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.profileIcon = icon;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: `You're Icon was changed successfully!`,
      });
  } catch (error) {
    console.error("Error updating icon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { data } = req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.birthday = data.birthday;
    user.gender = data.gender;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: `Your profile was updated successfully!`,
      data: userObj,
    });
  } catch (error) {
    console.error("Error updating icon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    };
    const currentPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!currentPasswordMatch) {
      return res.status(400).json({ success: false, message: "Current password input does not match with your current password." });
    };
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await user.updateOne({ password: encryptedPassword });
    res.status(200).json({ success: true, message: "Your password was updated successfully!"});
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
