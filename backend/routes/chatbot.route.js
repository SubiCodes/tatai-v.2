import { Router } from "express";
import { askChatbot, uploadGuidesToChatbot } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.post('/data', uploadGuidesToChatbot);
chatbotRouter.post('/ask', askChatbot)

export default chatbotRouter;