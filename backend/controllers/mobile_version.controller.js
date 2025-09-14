import MobileVersion from "../models/mobile_version.model.js";

export const getCurrentMobileVersion = async (req, res) => {
    try {
        const version = await MobileVersion.findOne().sort({ createdAt: -1 });
        if (!version) { return res.status(404).json({ success: false, message: "No version found.", data: null }); }
        return res.status(200).json({ success: true, message: "Current version for mobile fetched successfully.", data: version });
    } catch (error) {
        console.error("Error in fetching latest version.", error);
        return res.status(500).json({ success: false, message: `Error in fetching latest version: ${error}` });
    }
}

export const updateMobileVersion = async (req, res) => {
    const { data } = req.body;

    try {
        const existingVersion = await MobileVersion.findOne().sort({ createdAt: -1 });
        if (existingVersion) {
            existingVersion.version = data;
            await existingVersion.save();
            return res.status(200).json({
                success: true,
                message: "Current version for mobile updated successfully.",
                data: existingVersion
            });
        } else {
            const newVersion = await MobileVersion.create({ version: data });
            return res.status(201).json({
                success: true,
                message: "New version for mobile created successfully.",
                data: newVersion
            });
        }
    } catch (error) {
        console.error("Error in updating latest version.", error);
        return res.status(500).json({
            success: false,
            message: `Error in updating latest version: ${error.message}`
        });
    }
};