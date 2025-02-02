import { Router } from "express";
import { getFaqs, getFaqById, createFaq, updateFaq, deleteFaq, deleteAllFaqs } from "../controllers/faq.controller";

const faqRouter = Router();

faqRouter.route('/')
.get(getFaqs)
.post(createFaq);

faqRouter.route('/:id').get(getFaqById)
.put(updateFaq)
.delete(deleteFaq);

faqRouter.route('/deleteAll').delete(deleteAllFaqs);

export default faqRouter;