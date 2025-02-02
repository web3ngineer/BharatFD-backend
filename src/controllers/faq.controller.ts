import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import FaqModel from "../models/faq.model";
import redisClient from "../config/redisClient";
import { ApiResponse } from "../utils/apiResponse";
import { translateText } from "../utils/translate";
import { ApiError } from "../utils/apiError";

const getFaqs = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const lang = (req.query.lang as string | undefined) || "en";
  const cacheKey = `faqs:${lang}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(cached), "Data fetched from cache"));
  }

  const faqs = await FaqModel.find();

  if(!faqs){
    throw new ApiError(400, "FAQs not found!" )
  }

  const response = faqs.map((faq) => ({
    id: faq._id,
    question: lang === "en" ? faq.question : faq.getTranslatedQuestion(lang),
    answer: lang === "en" ? faq.answer : faq.getTranslatedAnswer(lang),
  }));

  await redisClient.set(cacheKey, JSON.stringify(response), {
    EX: 3600, // Expiration time in seconds (1 hour)
  });

  return res.status(200).json(new ApiResponse(200, response, "Data fetched from database"));
});

const createFaq = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    throw new ApiError(400, "Question and answer are required");
  }

  const faqData = new FaqModel({
    question,
    answer,
    translations: [],
  });

  const languages = ["hi", "bn"]; // Add more as needed

  for (const lang of languages) {
    try {
      const translatedQuestion = await translateText(question, lang);
      const translatedAnswer = await translateText(answer, lang);
      faqData.translations.push({
        lang,
        question: translatedQuestion,
        answer: translatedAnswer,
      });
    } catch (error) {
      console.error(`Translation failed for ${lang}, using original text.`);
      // fallback to original text if translation fails
      faqData.translations.push({
        lang,
        question,
        answer,
      });
    }
  }

  const faq = new FaqModel(faqData);
  await faq.save();

  // Clear FAQ cache to update the latest data
  await redisClient.flushAll();

  return res.status(201).json(new ApiResponse(201, faq, "Faq created successfully"));
});

export { getFaqs, createFaq };
