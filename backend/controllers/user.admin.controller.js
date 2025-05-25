import User from '../models/user.model.js';
import { sendVerificationToken } from '../nodemailer/email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    const {firstName, lastName, gender, birthday, email, password, role} = req.body;
    
    let status = "Unverified";
    
    const checkExists = await User.findOne({email: email});
    
    if (checkExists) {
        return res.status(400).json({success: false, message: "Email already exists."});
    };

    if (!firstName || !lastName || !gender || !birthday || !email || !password || !role) {
        return res.status(400).json({success: false, message: "There is an empty field."});
    };

    if (role === "admin" || role === "super admin") {
        status = "Verified";
    };

    const verificationToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday,email: email, password: encryptedPassword,status: status, role: role, verificationToken: verificationToken});
        if (status !== "Verified"){
            sendVerificationToken(email, verificationToken);
        };
        res.status(201).json({success: true, message: "User created successfully.", data: user, verificationToken: verificationToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Cannot create user.", error: error.message});
    }
};

export const getAdminData = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.userId;

    console.log(id);
    

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving user data.", error: error.message });
  }
};