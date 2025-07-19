import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guide",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    collection: "feedback",
    timestamps: true
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;