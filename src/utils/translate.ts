import { translate } from '@vitalets/google-translate-api';

export const translateText = async (
  text: string,
  targetLang: string
): Promise<string> => {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (error) {
    console.error('Translation error: ', error);
    // fallback to original text if translation fails
    return text;
  }
};
