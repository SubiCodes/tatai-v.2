import { Router } from "express";
import { askChatbot, transcribeAudio, uploadGuidesToChatbot } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.post('/data', uploadGuidesToChatbot);
chatbotRouter.post('/ask', askChatbot)
chatbotRouter.post('/transcribe', transcribeAudio);

export default chatbotRouter;