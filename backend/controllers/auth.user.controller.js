import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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
        return res.status(200).json({ success: true, message: "Successfully signed in.", data:{ ...user.toObject(), password: undefined}})
    } catch (error) {
        console.error("Error in Signin", error);
        return res.status(500).json({ success: false, message: `Error Signing in: ${error}` });
    }
};