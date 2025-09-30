import { Router } from "express";
import { createConversation, deleteConversation, getConversations, updateConversation } from "../controllers/conversation.controller.js";

const conversationRouter = Router();

conversationRouter.post('/', createConversation);
conversationRouter.patch('/:id', updateConversation);
conversationRouter.delete('/:id', deleteConversation);
conversationRouter.get('/user/:userId', getConversations);

export default conversationRouter;