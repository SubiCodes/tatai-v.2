import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendPasswordResetEmail } from '../nodemailer/email.js';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

export const signInAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "Invalid Credentials."})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid Credentials."})
        }

        if(user.role !== "admin" && user.role !== 'super admin'){
            return res.status(400).json({success: false, message: "Your account dont have access to this website."})
        }

        generateTokenAndSetCookie(res, user._id);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            user:{
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.error("Error in Login", error);
        return res.status(500).json({success: false, message: `Error Logging in: ${error}`});
    }
};

export const getCookie = async (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
        return res.status(401).json({ authenticated: false });
    }
    
    try {
        JWT.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ authenticated: true, message: "User is authenticated." });
    } catch (error) {
        return res.status(401).json({ authenticated: false, message: error.message });
    }
};

export const deleteCookie = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
          });
          res.status(200).json({ success: true, message: "Successfully Logged Out" });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email: email});
        if (user.length === 0) {
            return res.status(400).json({ success: false, message: "User not found." });
        };
        const linkExtender = crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
        const resetLink = `${process.env.REACT_URI}reset-password/${linkExtender}`;
        console.log("LINK: ", resetLink);

        sendPasswordResetEmail(email, resetLink);

        user.passwordResetId = linkExtender;
        await user.save();

        res.status(200).json({ success: true, message: `Email sent successfully to "${email}"` });
    } catch (error) {
        console.error("Error sending reset password link", error);
        return res.status(401).json({ success: false, message: error.message });
    }
};

export const checkTokenValidity = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ passwordResetId: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }
        return res.status(200).json({ success: true, message: "Token is valid." });
    } catch (error) {
        console.error("Error checking token validity", error);
        return res.status(500).json({ success: false, message: `Error checking token validity: ${error}` });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ passwordResetId: token });
         if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        };
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetId = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password", error);
        return res.status(500).json({ success: false, message: `Error checking resetting password: ${error}` });
    }
}