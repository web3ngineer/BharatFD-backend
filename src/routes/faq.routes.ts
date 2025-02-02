import { Router } from "express";
import { getFaqs, getFaqById, createFaq } from "../controllers/faq.controller";

const faqRouter = Router();

faqRouter.route('/').get(getFaqs);
faqRouter.route('/:id').get(getFaqById);
faqRouter.route('/').post(createFaq);

export default faqRouter;