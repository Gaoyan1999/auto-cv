import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { createAgent } from 'langchain';
import { getQwen35FlashModel } from './model-provider';
import { renderResumePdf } from './resume-pdf';

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
app.use(express.json({ limit: '12mb' }));

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
const resumePdfSchema = z.object({
  html: z.string().min(1),
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

app.post('/api/resume/pdf', async (req, res) => {
  try {
    const { html } = resumePdfSchema.parse(req.body);
    const pdf = await renderResumePdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(pdf));
  } catch (error) {
    console.error('Failed to render resume PDF', error);
    return res.status(400).json({ error: 'Failed to render PDF' });
  }
});

app.listen(port, () => {
  console.log(`Backend app listening on http://localhost:${port}`);
});
