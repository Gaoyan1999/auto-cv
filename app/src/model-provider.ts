import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';

let qwen35FlashModel: ChatOpenAI | null = null;

export function getQwen35FlashModel() {
  if (!qwen35FlashModel) {
    qwen35FlashModel = new ChatOpenAI({
      model: process.env.MODEL_OPENAI_MODEL_CODE,
      temperature: 0,
      apiKey: process.env.MODEL_DASHSCOPE_API_KEY,
      configuration: {
        baseURL: process.env.MODEL_BASE_URL,
      },
    });
  }
  return qwen35FlashModel;
}
