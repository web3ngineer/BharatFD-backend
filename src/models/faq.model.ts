import mongoose, { Document, Schema, Model } from "mongoose";

interface IFaq extends Document {
  question: string;
  answer: string;
  question_hi?: string;
  question_bn?: string;
  answer_hi?: string;
  answer_bn?: string;
  getTranslatedQuestion(lang?: string): string;
  getTranslatedAnswer(lang?: string): string;
}

const faqSchema = new Schema<IFaq>({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  question_hi: {
    type: String,
    default: "",
  },
  question_bn: {
    type: String,
    default: "",
  },
  answer_hi: {
    type: String,
    default: "",
  },
  answer_bn: {
    type: String,
    default: "",
  },
});

// Methods
faqSchema.methods.getTranslatedQuestion = function (lang: string = "en"): string {
  return this[`question_${lang}` as keyof IFaq] || this.question;
};

faqSchema.methods.getTranslatedAnswer = function (lang: string = "en"): string {
  return this[`answer_${lang}` as keyof IFaq] || this.answer;
};

// Export model
const FaqModel: Model<IFaq> = mongoose.model<IFaq>("Faq", faqSchema);
export default FaqModel;
