import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
        required: false
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guide",
        required: false
    },
    type: {
        type: String,
        enum: ["feedback", "guide"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviewed: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    collection: "report",
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

export default Report;