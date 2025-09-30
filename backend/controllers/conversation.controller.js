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

export const updateConversation = async (req, res) => {
    const { id, message } = req.body;
    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'No conversation found.' });
        };
        conversation.messages.push(message);
        const updatedConversation = await conversation.save();
        return res.status(200).json({ success: true, message: "Successfully updated the conversation.", data: updatedConversation })
    } catch (error) {
        console.log("Someting went wrong while updating conversation", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteConversation = async (req, res) => {
    const { id } = req.params;
    try {
        await Conversation.deleteOne({ _id: id });
        return res.status(200).json({ success: true, message: "Successfully deleted the conversation." });
    } catch (error) {
        console.log("Someting went wrong while deleting conversation", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        const conversations = await Conversation.find({userId: userId});
        return res.status(200).json({ success: true, message: "Successfully fetched conversations.", data: conversations });
    } catch (error) {
        console.log("Someting went wrong while fetching conversations", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};