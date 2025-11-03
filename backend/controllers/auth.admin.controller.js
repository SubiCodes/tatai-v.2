import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie, generateSessionToken } from '../utils/generateTokenAndSetCookie.js';
import { sendPasswordResetEmail } from '../nodemailer/email.js';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

export const signInAdmin = async (req, res) => {
    const { email, password, forceLogin } = req.body;
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

        // Check if there's already an active session (unless force login is requested)
        if(user.activeSessionToken && !forceLogin){
            return res.status(403).json({
                success: false, 
                message: "This account is already logged in from another location.",
                accountInUse: true
            });
        }

        // Generate a unique session token (this will replace any existing session)
        const sessionToken = generateSessionToken();
        
        // Store the session token in the database
        user.activeSessionToken = sessionToken;
        await user.save();

        // Generate JWT token with session token included
        generateTokenAndSetCookie(res, user._id, sessionToken);

        return res.status(200).json({
            success: true,
            message: forceLogin ? "Logged in successfully! Previous session has been terminated." : "Logged in successfully!",
            user:{
                ...user._doc,
                password: undefined,
                activeSessionToken: undefined,
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
        // Get user from request (set by middleware)
        if (req.user && req.user._id) {
            // Clear the active session token in the database
            await User.findByIdAndUpdate(req.user._id, {
                activeSessionToken: undefined
            });
        }
        
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ✅ Same as creation
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ Same as creation
            path: '/' // ✅ Add path to be explicit
        });
        res.status(200).json({ success: true, message: "Successfully Logged Out" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }
        
        // Check if user is admin or super admin
        if(user.role !== "admin" && user.role !== 'super admin'){
            return res.status(400).json({success: false, message: "Only admin accounts can reset password through this page."})
        }
        
        const linkExtender = crypto.randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
        const resetLink = `${process.env.REACT_URI}reset-password/${linkExtender}`;
        console.log("RESET PASSWORD LINK: ", resetLink);

        // Await the email sending
        await sendPasswordResetEmail(email, resetLink);

        user.passwordResetId = linkExtender;
        await user.save();

        res.status(200).json({ success: true, message: `Email sent successfully to "${email}"` });
    } catch (error) {
        console.error("Error sending reset password link", error);
        return res.status(500).json({ success: false, message: error.message });
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
        
        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        
        // Clear the password reset token
        user.passwordResetId = undefined;
        
        // Clear active session token to log out all active sessions
        user.activeSessionToken = undefined;
        
        await user.save();
        
        console.log(`🔐 Password reset successful for user: ${user.email} - All sessions terminated`);
        
        res.status(200).json({ 
            success: true, 
            message: "Password reset successfully. All active sessions have been logged out." 
        });
    } catch (error) {
        console.error("Error resetting password", error);
        return res.status(500).json({ success: false, message: `Error checking resetting password: ${error}` });
    }
}