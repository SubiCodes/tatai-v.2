import User from "../models/user.model.js";
import { sendConcern } from "../nodemailer/email.js";

export const sendUserConcern = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: `User does not exists.` });
        };
        await sendConcern(user.email, message);
        return res.status(200).json({ success: true, message: "Email sent successfully!"});
    } catch (error) {
        console.error("Error in Sending Email", error);
        return res.status(500).json({ success: false, message: `Error in Sending Email: ${error}` });
    }
}