import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guide",
        required: true
    }
}, {
    collection: "bookmark",
    timestamps: true
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;