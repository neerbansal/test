import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.VINTER || process.env.OPENROUTER_API_KEY;

app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "tencent/hy3:free",
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "stream": true
      })
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    response.body.on('data', chunk => {
      const text = chunk.toString();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.includes('data: [DONE]')) return;
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            const content = data.choices[0]?.delta?.content || '';
            res.write(content);
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    });

    response.body.on('end', () => res.end());
  } catch (error) {
    console.error(error);
    res.status(500).send('AI Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
