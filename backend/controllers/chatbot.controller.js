import Guide from "../models/guide.model.js";
import EmbeddedChunk from "../models/embeddedchunks.model.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Utility Functions ---
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dot / (magA * magB);
};

const embedText = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data[0].embedding;
};


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