import User from '../models/user.model.js';
import { sendVerificationToken, sendUserStatusUpdate, sendUserRoleUpdate } from '../nodemailer/email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createNotification } from './notification.controller.js';

export const createUser = async (req, res) => {
  const { firstName, lastName, gender, birthday, email, password, role } = req.body;

  let status = "Unverified";

  const checkExists = await User.findOne({ email: email });

  if (checkExists) {
    return res.status(400).json({ success: false, message: "Email already exists." });
  };

  if (!firstName || !lastName || !gender || !birthday || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "There is an empty field." });
  };

  if (role === "admin" || role === "super admin") {
    status = "Verified";
  };

  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ firstName: firstName, lastName: lastName, gender: gender, birthday: birthday, email: email, password: encryptedPassword, status: status, role: role, verificationToken: verificationToken });
    if (status !== "Verified") {
      sendVerificationToken(email, verificationToken);
    };
    res.status(201).json({ success: true, message: "User created successfully.", data: user, verificationToken: verificationToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot create user.", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, message: "User fetched successfully.", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot fetch user.", error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist." });
    }
    user.status = status;
    sendUserStatusUpdate(user.firstName + user.lastName, status, user.email);
    await user.save();
    const notificationDisplay = (status === 'Unverified' ? 'info' : status === 'Verified' ? 'success' : 'danger');
    await createNotification(user._id, 'status', notificationDisplay, 'User status has been updated by an Admin', `Your status has been updated to '${status}'. If you think this is a mistake please contact us at tataihomeassistant.gmail.com`);
    res.status(202).json({ success: true, message: "Status updated successfully.", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot change user status.", error: error.message });
  }
}

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (role === "super admin") {
    return res.status(403).json({ success: false, message: "Cannot assign super admin role." });
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist." });
    }
    user.role = role;
    await user.save();
    sendUserRoleUpdate(user.firstName + user.lastName, role, user.email);
    await createNotification(user._id, 'role', 'info', 'User role has been updated by an Admin', `Your role has been updated to '${role}'. If you think this is a mistake please contact us at tataihomeassistant.gmail.com`);
    res.status(202).json({ success: true, message: "Role updated successfully.", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot change user role.", error: error.message });
  }
};


