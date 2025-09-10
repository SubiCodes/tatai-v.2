import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["guide", "report", "status", "role"],
        required: true
    },
    display: {
        type: String,
        enum: ["success", "info", "danger"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    collection: "notification",
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;