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

  if (!faqs || faqs.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "FAQs not found!"));
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
  // console.log("createFaq -> req.body", req.body);

  if (!question || !answer) {
    return res.status(400).json(new ApiResponse(400, null, "Question and answer are required"));
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

const getFaqById = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const lang = (req.query.lang as string | undefined) || "en";

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid FAQ ID format"));
  }

  const faq = await FaqModel.findById(id);

  if (!faq) {
    return res.status(400).json(new ApiResponse(400, null, "FAQ not exists with given id"));
  }

  const resData = {
    id: faq._id,
    question: lang === "en" ? faq.question : faq.getTranslatedQuestion(lang),
    answer: lang === "en" ? faq.answer : faq.getTranslatedAnswer(lang),
  };

  return res.status(200).json(new ApiResponse(200, resData, "Data fetched successfully"));
});

const updateFaq = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid FAQ ID format"));
  }

  if (!question || !answer) {
    return res.status(400).json(new ApiResponse(400, null, "Question and answer are required"));
  }

  const faq = await FaqModel.findById(id);

  if (!faq) {
    return res.status(400).json(new ApiResponse(400, null, "FAQ not exists with given id"));
  }

  faq.question = question;
  faq.answer = answer;

  const languages = ["hi", "bn"]; // Add more as needed

  for (const lang of languages) {
    try {
      const translatedQuestion = await translateText(question, lang);
      const translatedAnswer = await translateText(answer, lang);
      
      const translation = faq.translations.find((t: any) => t.lang === lang);
      if (translation) {
        translation.question = translatedQuestion;
        translation.answer = translatedAnswer;
      } else
        faq.translations.push({
          lang,
          question: translatedQuestion,
          answer: translatedAnswer,
        });
    } catch (error) {
      console.error(`Translation failed for ${lang}, using original text.`);
      // fallback to original text if translation fails
      const translation = faq.translations.find((t: any) => t.lang === lang);
      if (translation) {
        translation.question = question;
        translation.answer = answer;
      } else
        faq.translations.push({
          lang,
          question,
          answer,
        });
    }
  }

  await faq.save();

  // Clear FAQ cache to update the latest data
  await redisClient.flushAll();

  return res.status(200).json(new ApiResponse(200, faq, "Faq updated successfully"));
});

const deleteFaq = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const faq = await FaqModel.findByIdAndDelete(id);

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid FAQ ID format"));
  }

  if (!faq) {
    return res.status(400).json(new ApiResponse(400, null, "FAQ not exists with given id"));
  }

  // Clear FAQ cache to update the latest data
  await redisClient.flushAll();

  return res.status(200).json(new ApiResponse(200, faq, "Faq deleted successfully"));
});

const deleteAllFaqs = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const data = await FaqModel.deleteMany({});
  await redisClient.flushAll();
  return res.status(200).json(new ApiResponse(200, data, "All FAQs deleted successfully"));
});

export { getFaqs, createFaq, getFaqById, updateFaq, deleteFaq, deleteAllFaqs };
