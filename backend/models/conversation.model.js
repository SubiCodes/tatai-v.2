import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messages: {
        type: [{role: String, message: String}],
        required: true,
        default: []
    }
}, {
    collection: "conversation",
    timestamps: true
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;