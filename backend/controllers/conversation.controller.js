import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
    const { userId, title } = req.body;
    try {
        const newConversation = await Conversation.create({
            userId: userId,
            title: title
        });
        return res.status(200).json({ success: true, message: "Successfully created a conversation.", data: newConversation })
    } catch (error) {
         console.log("Someting went wrong while creating conversation", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};