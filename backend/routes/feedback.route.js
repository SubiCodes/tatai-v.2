import { Router } from "express";
import { createFeedback, deleteFeedback, editFeedback, fetchFeedback, fetchFeedbacks, fetchGuideFeedbacks } from "../controllers/feedback.controller.js";

const feedbackRouter = Router();

feedbackRouter.get('/', fetchFeedbacks);
feedbackRouter.get('/:id', fetchFeedback);
feedbackRouter.get('/guide/:guideId', fetchGuideFeedbacks);
feedbackRouter.post('/', createFeedback);
feedbackRouter.put('/', editFeedback);
feedbackRouter.delete('/:id', deleteFeedback);

export default feedbackRouter;