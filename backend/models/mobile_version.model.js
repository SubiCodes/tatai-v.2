import mongoose from "mongoose";

const mobileVersionSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
    }
}, {
    collection: "mobile_version",
    timestamps: true
});

const MobileVersion = mongoose.model("MobileVersion", mobileVersionSchema);

export default MobileVersion;