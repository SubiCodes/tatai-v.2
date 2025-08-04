import Guide from "../models/guide.model.js";
import EmbeddedChunk from "../models/embeddedchunks.model.js";
import openai from "../utils/openaiClient.js";

// --- Utility Functions ---
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dot / (magA * magB);
};

const embedBatch = async (texts) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts,
    });
    return response.data.map(obj => obj.embedding);
};

const embedText = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data[0].embedding;
};

// --- Main Upload Function (with batching) ---
export const uploadGuidesToChatbot = async (req, res) => {
    try {
        const acceptedGuides = await Guide.find({ status: 'accepted' }).populate({
            path: 'posterId',
            select: "firstName lastName email profileIcon",
        });

        if (!acceptedGuides.length) {
            return res.status(404).json({ success: false, message: "No accepted guides found." });
        }

        // 1. Chunk all guide texts
        let allChunks = [];
        acceptedGuides.forEach((guide) => {
            const steps = guide.stepTitles.map((title, index) => ({
                stepTitle: title,
                stepDescription: guide.stepDescriptions[index] || "",
            }));

            const guideText = `
            Title: ${guide.title}
            By: ${guide.posterId.firstName} ${guide.posterId.lastName}
            Description: ${guide.description}
            Materials: ${typeof guide.materials === 'string' ? guide.materials : ''}
            Tools: ${typeof guide.tools === 'string' ? guide.tools : ''}

            ${steps.map((s, i) => `Step ${i + 1}: ${s.stepTitle}\n${s.stepDescription}`).join('\n\n')}
            `;

            const chunks = guideText.match(/(.|[\r\n]){1,500}/g) || [];
            allChunks.push(...chunks);
        });

        // 2. Clear old embeddings
        await EmbeddedChunk.deleteMany();

        // 3. Batch embeddings for speed
        const batchSize = 100;
        const embeddedChunks = [];

        for (let i = 0; i < allChunks.length; i += batchSize) {
            const batch = allChunks.slice(i, i + batchSize);
            const embeddings = await embedBatch(batch);
            for (let j = 0; j < batch.length; j++) {
                embeddedChunks.push({
                    text: batch[j],
                    embedding: embeddings[j],
                    author: currentGuide.posterId.firstName + " " + currentGuide.posterId.lastName,
                    guideTitle: currentGuide.title,
                });
            }
        }

        // 4. Save all embeddings
        await EmbeddedChunk.insertMany(embeddedChunks);

        return res.status(200).json({
            success: true,
            message: "Guides uploaded and embedded into chatbot memory.",
            embeddedChunks: embeddedChunks.length,
        });

    } catch (error) {
        console.error("Error uploading guides:", error);
        return res.status(500).json({ success: false, message: "Failed to upload guide data." });
    }
};

//Ask the bot questions
export const askChatbot = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    const latestUserMessage = messages[messages.length - 1]?.content;
    if (!latestUserMessage) {
        return res.status(400).json({ success: false, message: "User's latest question is missing." });
    }

    try {
        const allChunks = await EmbeddedChunk.find();
        if (!allChunks.length) {
            return res.status(400).json({
                success: false,
                message: "Chatbot memory is empty. Please upload guides first."
            });
        }

        const questionEmbedding = await embedText(latestUserMessage);

        const topMatches = allChunks
            .map(obj => ({
                text: obj.text,
                author: obj.author,
                guideTitle: obj.guideTitle,
                score: cosineSimilarity(obj.embedding, questionEmbedding),
            }))
            .filter(m => m.score > 0.75)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const contextText = topMatches
            .map(m => `From "${m.guideTitle}" by ${m.author}:\n${m.text}`)
            .join('\n---\n');

        const finalMessages = [
            {
            role: "system",
            content: `You are TatAi, a helpful home assistant chatbot using user-submitted guides. Only answer using the context provided below.

            Each snippet comes with the guide title and the author. If a question is asked, only answer using this content and always say which guide and author it came from.

            If no matching content is found, respond: "Sorry, I couldn't find that in the guides."

            --- CONTEXT START ---
            ${contextText}
            --- CONTEXT END ---`
            },
            ...messages
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: finalMessages,
        });

        return res.status(200).json({
            success: true,
            answer: completion.choices[0].message.content
        });

    } catch (error) {
        console.error("Error answering chatbot question:", error);
        return res.status(500).json({ success: false, message: "Error answering question." });
    }
};