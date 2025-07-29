import { Router } from "express";
import { getAcceptedGuidesData } from "../controllers/chatbot.controller.js";

const chatbotRouter = Router();

chatbotRouter.get('/data', getAcceptedGuidesData)

export default chatbotRouter;