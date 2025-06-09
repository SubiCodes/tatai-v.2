import User from '../models/user.model.js';
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
            return res.status(400).json({ success: false, message: `User has no verification token.` });
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
}