import User from '../models/user.model.js';
import Preference from '../models/preference.model.js';
import bcrypt from 'bcryptjs';
import { sendVerificationToken } from '../nodemailer/email.js';
import { sendResetToken } from '../nodemailer/email.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: `Missing field.` });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `User email does not exists.` });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: `Incorrect password.` });
        };
        return res.status(200).json({ success: true, message: "Successfully signed in.", data: { ...user.toObject(), password: undefined } })
    } catch (error) {
        console.error("Error in Signin", error);
        return res.status(500).json({ success: false, message: `Error Signing in: ${error}` });
    }
};

export const verifyUser = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `No user with that email exists.` });
        };
        if (otp !== user.verificationToken) {
            return res.status(400).json({ success: false, message: `Invalid verification token.` });
        };
        user.verificationToken = undefined;
        user.status = 'Verified';
        await user.save();
        return res.status(200).json({ success: true, message: "Your verification was successful. Please log in to continue." })
    } catch (error) {
        console.error("Error in Verify User", error);
        return res.status(500).json({ success: false, message: `Error Verifying user: ${error}` });
    }
};

export const resendVerificationToken = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `No user with that email exists.` });
        };
        if (!user.verificationToken) {
            if (user.status !== 'Verified') {
                const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
                user.verificationToken = verificationToken
                await user.save();
            } else {
                return res.status(400).json({ success: false, message: "User has no verification token." })
            }
        };
        sendVerificationToken(email, user.verificationToken);
        return res.status(200).json({ success: true, message: "Email resent." })
    } catch (error) {
        console.error("Error in Re-Sending Verfication Token", error);
        return res.status(500).json({ success: false, message: `Error in Re-Sending Verfication Token: ${error}` });
    }
};

export const sendResetPasswordToken = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `No user with that email exists.` });
        };
        if (!user.resetPasswordToken) {
            const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
            user.resetPasswordToken = resetPasswordToken;
            await user.save();
        };
        sendResetToken(email, user.resetPasswordToken);
        return res.status(200).json({ success: true, message: `Reset password token sent to ${email}.` })
    } catch (error) {
        console.error("Error in Sending Reset Password Token", error);
        return res.status(500).json({ success: false, message: `Error in Sending Reset Password Token: ${error}` });
    }
};

export const verifyResetPassword = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `No user with that email exists.` });
        };
        if (!user.resetPasswordToken) {
            const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
            user.resetPasswordToken = resetPasswordToken;
            await user.save();
            sendResetToken(email, user.resetPasswordToken);
        };
        if (user.resetPasswordToken !== otp) {
            return res.status(400).json({ success: false, message: `Inavalid Reset Password Token.` });
        }
        if (user.resetPasswordToken === otp) {
            user.resetPasswordToken = undefined;
            return res.status(200).json({ success: true, message: `Succcessfully verified reset token. You can now proceed to create a new password.` })
        }
    } catch (error) {
        console.error("Error in Verifying Reset Password", error);
        return res.status(500).json({ success: false, message: `Error in Verifying Reset Password: ${error}` });
    }
};

export const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: `No user with your email exists.` });
        };
        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
        user.resetPasswordToken = undefined;
        await user.save();
        return res.status(200).json({ success: true, message: `Your password has been successfully reset. Please sign in to continue.` })
    } catch (error) {
        console.error("Error in Resetting Password", error);
        return res.status(500).json({ success: false, message: `Error in Resetting Password: ${error}` });
    }
};

export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body.data;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: `User not found.` });
        };
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: `Incorrect old password.` });
        };
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;
        await user.save();
        return res.status(200).json({ success: true, message: `Password changed successfully.` });
    } catch (error) {
        console.error("Error in Changing Password", error);
        return res.status(500).json({ success: false, message: `Error in Changing Password: ${error}` });
    }
}

export const validateUserAccess = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        };
        if (user.status === 'Banned') {
            return res.status(400).json({ success: false, message: "This user is currently banned. Please contact tataihomeassistant@gmail.com for questions.", errorType: 'banned', user: { _id: user._id, email: user.email } });
        }
        if (user.status === 'Restricted') {
            return res.status(400).json({ success: false, message: "This user is currently restricted. Please contact tataihomeassistant@gmail.com for questions.", errorType: 'restrcited', user: { _id: user._id, email: user.email } });
        }
        if (user.status !== 'Verified') {
            return res.status(400).json({ success: false, message: "User not yet verified. Please verify your account.", errorType: 'unverified', user: { _id: user._id, email: user.email } });
        };
        const preference = await Preference.findOne({ userId: id });
        if (!preference) {
            return res.status(400).json({ success: false, message: "Please setup your preferences.", errorType: 'preference', user: { _id: user._id, email: user.email } });
        };
        return res.status(200).json({ success: true, message: "User validated.", errorType: 'none', user: { _id: user._id, email: user.email } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot fetch user.", error: error.message });
    }
}