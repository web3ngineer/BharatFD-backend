import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import  FaqModel  from "../models/faq.model";
import  redisClient  from "../config/redisClient";
import { ApiResponse } from "../utils/apiResponse";

const getFaqs = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const lang = (req.query.lang as string | undefined) || "en";
  const cacheKey = `faqs:${lang}`;


  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.status(200).json(new ApiResponse(200, JSON.parse(cached), "Data fetched from cache"));
  }

  const faqs = await FaqModel.find();

 
  const response = faqs.map((faq) => ({
    id: faq._id,
    question: lang === "en" ? faq.question : faq.getTranslatedQuestion(lang),
    answer: faq.answer,
  }));


  await redisClient.set(cacheKey, JSON.stringify(response), {
    EX: 3600, // Expiration time in seconds (1 hour)
  });


  return res.status(200).json(new ApiResponse(200, response, "Data fetched from database"));
});


export { getFaqs };
