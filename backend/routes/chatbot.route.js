import { Router } from "express";
import { askChatbot, textToSpeech, transcribeAudio, uploadGuidesToChatbot } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.post('/data', uploadGuidesToChatbot);
chatbotRouter.post('/ask', askChatbot)
chatbotRouter.post('/transcribe', transcribeAudio);
chatbotRouter.post('/toSpeech', textToSpeech);

export default chatbotRouter;