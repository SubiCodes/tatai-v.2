import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import JWT from 'jsonwebtoken';

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