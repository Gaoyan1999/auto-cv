import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { createAgent } from 'langchain';
import { getQwen35FlashModel } from './model-provider';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const modelCode = process.env.MODEL_OPENAI_MODEL_CODE;
const apiKey = process.env.MODEL_DASHSCOPE_API_KEY;

console.log('model', modelCode);
console.log('apiKey loaded:', Boolean(apiKey));

if (!apiKey) {
  throw new Error('Missing MODEL_DASHSCOPE_API_KEY in app/.env');
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const inputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1),
    }),
  ),
});

app.get('/api/chat', async (_req, res) => {

  try {
    const qwen35Flash = getQwen35FlashModel();
    const agent = createAgent({
      model: qwen35Flash,
    });
    
    const completion = await agent.invoke({
      messages: inputSchema.parse({
        messages: [{ role: 'user', content: 'Hello, how are you?' }],
      }).messages,
    });
    const text = completion;
    return res.json({ text });
  } catch (error) {
    console.error('Chat request failed', error);
    return res.status(500).json({ error: 'LLM request failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend app listening on http://localhost:${port}`);
});
