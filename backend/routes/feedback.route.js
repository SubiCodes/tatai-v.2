import { Router } from "express";
import { createFeedback, deleteFeedback, editFeedback, fetchFeedback, fetchFeedbacks, fetchGuideFeedbacks, fetchLatestFeedback } from "../controllers/feedback.controller.js";

const feedbackRouter = Router();

feedbackRouter.get('/', fetchFeedbacks);
feedbackRouter.get('/latest', fetchLatestFeedback);
feedbackRouter.get('/:id', fetchFeedback);
feedbackRouter.get('/guide/:guideId', fetchGuideFeedbacks);
feedbackRouter.post('/', createFeedback);
feedbackRouter.put('/', editFeedback);
feedbackRouter.delete('/:id', deleteFeedback);

export default feedbackRouter;