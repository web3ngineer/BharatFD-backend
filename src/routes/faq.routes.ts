import { Router } from "express";
import { getFaqs, getFaqById, createFaq } from "../controllers/faq.controller";

const faqRouter = Router();

faqRouter.route('/')
.get(getFaqs)
.post(createFaq);

faqRouter.route('/:id').get(getFaqById);

export default faqRouter;