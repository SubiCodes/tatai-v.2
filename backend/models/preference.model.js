import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    preferredName: {
        type: String,
        required: true
    },
    preferredTone: {
        type: String,
        enum: ["formal", "casual", "soft spoken", "strict"],
        required: true
    },
    toolFamiliarity:{
        type: String,
        enum: ["unfamiliar", "recognizes basics", "functionally knowledgeable", "knowledgeable", "expert"],
        required: true
    },
    skillLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advance", "expert", "professional"],
        required: true
    },
    previousSearches: {
        type: [String],
        default: [] 
    }
}, {
    collection: "UserPreferences",
    timestamps: true
});

const Preference = mongoose.model("Preference", preferenceSchema);

export default Preference;