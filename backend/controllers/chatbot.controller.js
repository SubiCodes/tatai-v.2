import Guide from "../models/guide.model.js";

export const getAcceptedGuidesData = async (req, res) => {
    try {
        let cleanedData = [];
        const acceptedGuides = await Guide.find({ status: 'accepted' }).populate({ path: 'posterId', select: "firstName lastName email profileIcon", });
        acceptedGuides?.map((guide) => {
            let steps = guide.stepTitles.map((title, index) => ({
                stepTitle: title,
                stepDescription: guide.stepDescriptions[index] || "",
            }));
            let newData = {
                poster: `${guide.posterId.firstName} ${guide.posterId.lastName}`,
                title: guide.title,
                description: guide.description,
                materials: guide.materials,
                tools: guide.tools,
                steps: steps
            }
            cleanedData.push(newData);
        });
        return res.status(200).json({ success: true, message: "Data ready to be fed to chatbot.", data: cleanedData });
    } catch (error) {
        console.log("Unable to fetch accepted guides.", error);
        return res.status(500).json({ success: false, message: "Unable to collect guides data." })
    }
}