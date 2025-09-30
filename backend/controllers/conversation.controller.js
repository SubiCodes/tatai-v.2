import Conversation from "../models/conversation.model.js";
import openai from "../utils/openaiClient.js";

export const createConversation = async (req, res) => {
    const { userId, message } = req.body;
    try {
        const title = await generateTitle(message.message);
        const newConversation = await Conversation.create({
            userId: userId,
            title: title,
            messages: [message]
        });
        await newConversation.save();
        return res.status(200).json({ success: true, message: "Successfully created a new conversation.", data: newConversation });
    } catch (error) {
        console.log("Someting went wrong while creating conversation", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateConversation = async (req, res) => {
  const { id } = req.params;
  const { messages } = req.body; // <-- expect an array now
  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'No conversation found.' });
    }

    conversation.messages.push(...messages); // append multiple messages
    const updatedConversation = await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Successfully updated the conversation.",
      data: updatedConversation
    });
  } catch (error) {
    console.log("Something went wrong while updating conversation", error.message);
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
        const conversations = await Conversation.find({ userId: userId });
        return res.status(200).json({ success: true, message: "Successfully fetched conversations.", data: conversations });
    } catch (error) {
        console.log("Someting went wrong while fetching conversations", error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const generateTitle = async (message) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `Create a title for a conversation that was started with this message: "${message}". 
                Requirements:
                - Maximum 5 words
                - Only use plain letters and numbers
                - Do not include punctuation, quotation marks, or symbols`
            }
        ],
        max_tokens: 20,
        temperature: 0.1
    });

    return response.choices[0].message.content.trim();
};