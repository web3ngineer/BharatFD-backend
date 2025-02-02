import { Router } from "express";
import { getFaqs } from "../controllers/faq.controller";

const faqRouter = Router();

faqRouter.route('/').get(getFaqs);

export default faqRouter;