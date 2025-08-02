import { Router } from "express";
import { uploadGuidesToChatbot } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.get('/data', uploadGuidesToChatbot);

export default chatbotRouter;