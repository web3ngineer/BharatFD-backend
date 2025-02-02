import request from "supertest";
import app from "../../src/app";
import redisClient from "../../src/config/redisClient";
import FaqModel from "../../src/models/faq.model";
import mongoose from "mongoose";

jest.mock("../../src/config/redisClient", () => ({
  get: jest.fn(),
  set: jest.fn(),
  flushAll: jest.fn(),
}));

jest.mock("../../src/models/faq.model");

describe("FAQ Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /faqs", () => {
    it("should return FAQs from the database when cache is empty", async () => {
      const mockFaqs = [
        { _id: "64e5f8c9b2d5c71d9f3f31a1", question: "What is this?", answer: "A test FAQ", getTranslatedQuestion: jest.fn(), getTranslatedAnswer: jest.fn() },
      ];

      (FaqModel.find as jest.Mock).mockResolvedValue(mockFaqs);
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/faqs");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(redisClient.set).toHaveBeenCalled();
    });
  });

  describe("POST /faqs", () => {
    it("should create a new FAQ", async () => {
      const newFaq = { question: "New question?", answer: "New answer." };
      (FaqModel.prototype.save as jest.Mock).mockResolvedValue(newFaq);
      (redisClient.flushAll as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/faqs").send(newFaq);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Faq created successfully");
    });
  });

  describe("GET /faqs/:id", () => {
    it("should return a single FAQ by ID", async () => {
      const mockFaq = { _id: "64e5f8c9b2d5c71d9f3f31a1", question: "What is this?", answer: "A test FAQ", getTranslatedQuestion: jest.fn(), getTranslatedAnswer: jest.fn() };

      (FaqModel.findById as jest.Mock).mockResolvedValue(mockFaq);

      const res = await request(app).get("/faqs/64e5f8c9b2d5c71d9f3f31a1");
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("64e5f8c9b2d5c71d9f3f31a1");
    });
  });

  describe("DELETE /faqs/:id", () => {
    it("should delete an FAQ by ID", async () => {
      (FaqModel.findByIdAndDelete as jest.Mock).mockResolvedValue(true);
      (redisClient.flushAll as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete("/faqs/64e5f8c9b2d5c71d9f3f31a1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Faq deleted successfully");
    });
  });
});
