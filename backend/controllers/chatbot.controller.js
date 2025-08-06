import Guide from "../models/guide.model.js";
import EmbeddedChunk from "../models/embeddedchunks.model.js";
import openai from "../utils/openaiClient.js";

// --- Enhanced Utility Functions ---
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dot / (magA * magB);
};

const embedText = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
        dimensions: 1536, // Use full dimensions for better precision
    });
    return response.data[0].embedding;
};

const embedBatch = async (texts) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
        encoding_format: "float",
        dimensions: 1536,
    });
    return response.data.map(obj => obj.embedding);
};

// --- Improved Chunking Strategy ---
const semanticChunk = (text, maxChunkSize = 800) => {
    // Split into sentences while preserving punctuation
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
        const cleanSentence = sentence.trim();
        if (!cleanSentence) continue;
        
        // If adding this sentence would exceed limit and we have content
        if ((currentChunk + ' ' + cleanSentence).length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = cleanSentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + cleanSentence;
        }
    }
    
    // Add the last chunk if it exists
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks.length > 0 ? chunks : [text];
};

// --- Query Enhancement ---
const enhanceQuery = async (userQuery) => {
    try {
        const enhancement = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Expand this DIY/home improvement query with related terms, synonyms, and common variations. Keep it concise (max 50 words): "${userQuery}"`
            }],
            max_tokens: 100,
            temperature: 0.3
        });
        
        const expandedQuery = enhancement.choices[0].message.content.trim();
        return `${userQuery} ${expandedQuery}`;
    } catch (error) {
        console.warn("Query enhancement failed, using original query:", error.message);
        return userQuery;
    }
};

// --- Context Formatting ---
const formatContext = (topMatches) => {
    const groupedByGuide = topMatches.reduce((acc, match) => {
        const guideKey = `${match.guideTitle}_${match.author}`;
        if (!acc[guideKey]) {
            acc[guideKey] = {
                author: match.author,
                title: match.guideTitle,
                chunks: [],
                maxScore: match.score
            };
        }
        acc[guideKey].chunks.push({
            text: match.text,
            score: match.score
        });
        acc[guideKey].maxScore = Math.max(acc[guideKey].maxScore, match.score);
        return acc;
    }, {});

    return Object.values(groupedByGuide)
        .sort((a, b) => b.maxScore - a.maxScore) // Sort by relevance
        .map(guide => {
            const relevantChunks = guide.chunks
                .sort((a, b) => b.score - a.score)
                .slice(0, 3) // Limit chunks per guide
                .map(chunk => chunk.text)
                .join('\n\n');
            
            return `GUIDE: "${guide.title}" by ${guide.author}\nRELEVANCE: ${(guide.maxScore * 100).toFixed(1)}%\n\n${relevantChunks}`;
        })
        .join('\n\n--- NEXT GUIDE ---\n\n');
};

// --- Conversation History Management ---
const summarizeHistory = async (messages) => {
    if (messages.length <= 8) return null;
    
    try {
        // Get the middle part of conversation (skip recent messages)
        const historyToSummarize = messages.slice(2, -3);
        const historyText = historyToSummarize
            .map(m => `${m.role}: ${m.content}`)
            .join('\n');
        
        const summary = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Summarize this conversation history in 2-3 sentences, focusing on the main topics discussed: ${historyText}`
            }],
            max_tokens: 150,
            temperature: 0.1
        });
        
        return summary.choices[0].message.content;
    } catch (error) {
        console.warn("History summarization failed:", error.message);
        return null;
    }
};

// --- Response Quality Evaluation ---
const evaluateResponse = (matches, query) => {
    if (!matches.length) {
        return {
            confidence: "none",
            sourceCount: 0,
            avgRelevance: 0,
            qualityScore: 0
        };
    }
    
    const avgScore = matches.reduce((sum, m) => sum + m.score, 0) / matches.length;
    const maxScore = Math.max(...matches.map(m => m.score));
    
    let confidence;
    if (avgScore > 0.8) confidence = "high";
    else if (avgScore > 0.65) confidence = "medium";
    else if (avgScore > 0.5) confidence = "low";
    else confidence = "very_low";
    
    const qualityScore = (avgScore * 0.6) + (maxScore * 0.3) + (Math.min(matches.length, 3) * 0.1);
    
    return {
        confidence,
        sourceCount: matches.length,
        avgRelevance: avgScore,
        maxRelevance: maxScore,
        qualityScore
    };
};

// --- Enhanced System Prompt ---
const getSystemPrompt = () => `You are TatAi, a knowledgeable home assistant chatbot that helps users with DIY projects, home improvement, and repairs using user-submitted guides.

CORE RESPONSIBILITIES:
- Provide practical, step-by-step guidance based on the provided context
- Always credit authors when using their guides: "According to [Author Name]'s guide '[Guide Title]'..."
- Prioritize safety in all recommendations
- Ask clarifying questions when requests are ambiguous

RESPONSE GUIDELINES:
1. Start with a direct answer to the user's question
2. Provide specific steps or instructions when relevant
3. Always mention the source guide and author
4. Include safety warnings when working with tools, electricity, plumbing, etc.
5. If context is insufficient, clearly state limitations and offer general guidance
6. Use a helpful, friendly tone while being informative

SAFETY PRIORITIES:
- Always recommend proper safety equipment
- Warn about potential hazards (electrical, structural, chemical)
- Suggest when to consult professionals for complex/dangerous tasks
- Emphasize the importance of local building codes and permits when relevant

Remember: Be helpful, accurate, and safety-conscious in all responses.`;

// --- Main Upload Function (Enhanced with better chunking) ---
export const uploadGuidesToChatbot = async (req, res) => {
    try {
        const acceptedGuides = await Guide.find({ status: 'accepted' }).populate({
            path: 'posterId',
            select: "firstName lastName email profileIcon",
        });

        if (!acceptedGuides.length) {
            return res.status(404).json({ 
                success: false, 
                message: "No accepted guides found." 
            });
        }

        console.log(`Processing ${acceptedGuides.length} guides...`);

        // 1. Process and chunk all guide texts with better structure
        let allChunks = [];
        let totalGuides = acceptedGuides.length;
        
        acceptedGuides.forEach((guide, index) => {
            const steps = guide.stepTitles.map((title, stepIndex) => ({
                stepTitle: title,
                stepDescription: guide.stepDescriptions[stepIndex] || "",
            }));

            // Create structured guide text
            const guideHeader = `
Title: ${guide.title}
Author: ${guide.posterId.firstName} ${guide.posterId.lastName}
Description: ${guide.description}
${guide.materials ? `Materials needed: ${typeof guide.materials === 'string' ? guide.materials : 'See guide details'}` : ''}
${guide.tools ? `Tools required: ${typeof guide.tools === 'string' ? guide.tools : 'See guide details'}` : ''}
            `.trim();

            const stepsText = steps
                .map((step, i) => `Step ${i + 1}: ${step.stepTitle}\n${step.stepDescription}`)
                .join('\n\n');

            const fullGuideText = `${guideHeader}\n\nInstructions:\n${stepsText}`;

            // Use semantic chunking instead of fixed-size chunks
            const chunks = semanticChunk(fullGuideText, 800);

            // Associate each chunk with metadata
            chunks.forEach((chunk, chunkIndex) => {
                allChunks.push({
                    text: chunk.trim(),
                    author: `${guide.posterId.firstName} ${guide.posterId.lastName}`,
                    guideTitle: guide.title,
                    guideId: guide._id,
                    chunkIndex: chunkIndex,
                    totalChunks: chunks.length,
                });
            });

            if ((index + 1) % 10 === 0) {
                console.log(`Processed ${index + 1}/${totalGuides} guides...`);
            }
        });

        console.log(`Generated ${allChunks.length} semantic chunks`);

        // 2. Clear old embeddings
        await EmbeddedChunk.deleteMany();
        console.log("Cleared existing embeddings");

        // 3. Batch embeddings for efficiency
        const batchSize = 50; // Reduced for stability
        const embeddedChunks = [];

        for (let i = 0; i < allChunks.length; i += batchSize) {
            const batch = allChunks.slice(i, i + batchSize);
            const texts = batch.map(chunk => chunk.text);
            
            try {
                const embeddings = await embedBatch(texts);

                for (let j = 0; j < batch.length; j++) {
                    embeddedChunks.push({
                        text: batch[j].text,
                        embedding: embeddings[j],
                        author: batch[j].author,
                        guideTitle: batch[j].guideTitle,
                        guideId: batch[j].guideId,
                        chunkIndex: batch[j].chunkIndex,
                        totalChunks: batch[j].totalChunks,
                        createdAt: new Date(),
                    });
                }

                console.log(`Embedded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allChunks.length/batchSize)}`);
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (embedError) {
                console.error(`Error embedding batch starting at ${i}:`, embedError);
                throw new Error(`Embedding failed at batch ${Math.floor(i/batchSize) + 1}`);
            }
        }

        // 4. Save all embeddings in batches to avoid memory issues
        const saveBatchSize = 1000;
        for (let i = 0; i < embeddedChunks.length; i += saveBatchSize) {
            const saveChunk = embeddedChunks.slice(i, i + saveBatchSize);
            await EmbeddedChunk.insertMany(saveChunk);
            console.log(`Saved ${Math.min(i + saveBatchSize, embeddedChunks.length)}/${embeddedChunks.length} chunks`);
        }

        console.log("Upload completed successfully");

        return res.status(200).json({
            success: true,
            message: "Guides uploaded and embedded into chatbot memory with enhanced processing.",
            stats: {
                guidesProcessed: acceptedGuides.length,
                chunksCreated: embeddedChunks.length,
                averageChunksPerGuide: Math.round(embeddedChunks.length / acceptedGuides.length),
            }
        });

    } catch (error) {
        console.error("Error uploading guides:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to upload guide data.", 
            error: error.message 
        });
    }
};

// --- Enhanced Ask Chatbot Function ---
export const askChatbot = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ 
            success: false, 
            message: "Messages array is required." 
        });
    }

    const latestUserMessage = messages[messages.length - 1]?.content;
    if (!latestUserMessage) {
        return res.status(400).json({ 
            success: false, 
            message: "User's latest question is missing." 
        });
    }

    try {
        // Check if we have any embedded data
        const totalChunks = await EmbeddedChunk.countDocuments();
        if (totalChunks === 0) {
            return res.status(400).json({
                success: false,
                message: "Chatbot memory is empty. Please upload guides first."
            });
        }

        console.log(`Searching through ${totalChunks} embedded chunks...`);

        // Enhance the user's query for better matching
        const enhancedQuery = await enhanceQuery(latestUserMessage);
        console.log(`Enhanced query: "${enhancedQuery}"`);

        // Get query embedding
        const questionEmbedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: enhancedQuery,
            encoding_format: "float",
            dimensions: 1536,
        });
        const embedding = questionEmbedding.data[0].embedding;

        // Retrieve and score all chunks
        const allChunks = await EmbeddedChunk.find();
        const scoredChunks = allChunks.map(obj => ({
            text: obj.text,
            author: obj.author,
            guideTitle: obj.guideTitle,
            guideId: obj.guideId,
            chunkIndex: obj.chunkIndex,
            score: cosineSimilarity(obj.embedding, embedding),
        }));

        // More flexible matching with multiple thresholds
        let relevantChunks = scoredChunks
            .filter(m => m.score > 0.6) // Lower threshold for broader matching
            .sort((a, b) => b.score - a.score);

        // If no good matches, try with even lower threshold
        if (relevantChunks.length === 0) {
            relevantChunks = scoredChunks
                .filter(m => m.score > 0.4)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
        }

        // Diversify results to avoid too similar chunks
        const diverseChunks = [];
        const usedGuides = new Set();
        
        for (const chunk of relevantChunks) {
            // Prioritize diversity across different guides
            if (diverseChunks.length < 5) {
                if (!usedGuides.has(chunk.guideTitle) || diverseChunks.length < 2) {
                    diverseChunks.push(chunk);
                    usedGuides.add(chunk.guideTitle);
                }
            }
        }

        // Take top matches
        const topMatches = diverseChunks.slice(0, 4);

        console.log(`Found ${topMatches.length} relevant chunks with scores: ${topMatches.map(m => m.score.toFixed(3)).join(', ')}`);

        // Evaluate response quality
        const qualityMetrics = evaluateResponse(topMatches, latestUserMessage);
        console.log(`Response quality: ${qualityMetrics.confidence} confidence (${(qualityMetrics.qualityScore * 100).toFixed(1)}%)`);

        // Format context
        const hasRelevantContext = topMatches.length > 0 && qualityMetrics.avgRelevance > 0.4;
        const contextText = hasRelevantContext ? formatContext(topMatches) : "";

        // Prepare context message
        const contextMessage = {
            role: "user",
            content: hasRelevantContext
                ? `--- RELEVANT GUIDE INFORMATION ---\n${contextText}\n--- END GUIDE INFORMATION ---\n\nUser Question: ${latestUserMessage}`
                : `No highly relevant guide information found for this question. User Question: ${latestUserMessage}`
        };

        // Manage conversation history
        const historySummary = await summarizeHistory(messages);
        
        // Build enhanced messages array
        const finalMessages = [
            { role: "system", content: getSystemPrompt() }
        ];

        // Add history summary if available
        if (historySummary) {
            finalMessages.push({
                role: "system",
                content: `Previous conversation summary: ${historySummary}`
            });
        }

        // Add recent context and conversation
        finalMessages.push(contextMessage);
        
        // Add recent conversation history (last few messages, excluding the latest which is in context)
        const recentMessages = messages.slice(-6, -1); // Last 5 messages before current
        finalMessages.push(...recentMessages);

        // Get enhanced AI response
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using GPT-4 for better reasoning
            messages: finalMessages,
            temperature: 0.1, // Low temperature for consistent, factual responses
            max_tokens: 1200,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            top_p: 0.9
        });

        const aiResponse = completion.choices[0].message.content;

        // Prepare response with metadata
        const response = {
            success: true,
            answer: aiResponse,
            metadata: {
                confidence: qualityMetrics.confidence,
                sourceCount: topMatches.length,
                averageRelevance: Math.round(qualityMetrics.avgRelevance * 100),
                qualityScore: Math.round(qualityMetrics.qualityScore * 100),
                enhancedQuery: enhancedQuery !== latestUserMessage,
            },
            sources: topMatches.map(m => ({
                title: m.guideTitle,
                author: m.author,
                relevance: Math.round(m.score * 100)
            }))
        };

        // Add warning for low-quality responses
        if (qualityMetrics.confidence === "low" || qualityMetrics.confidence === "very_low") {
            response.warning = "This response is based on limited relevant information. Consider rephrasing your question or asking about a different topic.";
        }

        console.log(`Response generated successfully with ${topMatches.length} sources`);
        
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error answering chatbot question:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error generating response.", 
            error: error.message 
        });
    }
};