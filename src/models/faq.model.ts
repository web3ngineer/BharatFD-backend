import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  translations: Array<{
    lang: string;
    question: string;
    answer: string;
  }>;
  getTranslatedQuestion(lang: string): string;
  getTranslatedAnswer(lang: string): string;
}

const FaqSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: [
    {
      lang: { type: String, required: true },
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

FaqSchema.methods.getTranslatedQuestion = function (lang: string) {
  const translation = this.translations.find((t:any) => t.lang === lang);
  return translation ? translation.question : this.question;
};

FaqSchema.methods.getTranslatedAnswer = function (lang: string) {
  const translation = this.translations.find((t:any) => t.lang === lang);
  return translation ? translation.answer : this.answer;
};

const FaqModel:Model<IFaq> = mongoose.model<IFaq>('Faq', FaqSchema);
export default FaqModel;

