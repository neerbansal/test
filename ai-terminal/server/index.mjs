import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const getApiKey = (req) => {
  const reqKey = req.headers['x-api-key'] || req.body?.apiKey;
  if (reqKey && typeof reqKey === 'string' && reqKey.trim().length > 0) {
    return reqKey.trim();
  }
  return process.env.OPENROUTER_API_KEY || process.env.VINTER || "yoyo";
};

app.post('/api/ai/chat', async (req, res) => {
  const { prompt, messages, model, reasoning } = req.body;

  const apiKey = getApiKey(req);
  const selectedModel = model || "stealth/ox-alpha";

  let requestMessages = [];
  if (Array.isArray(messages) && messages.length > 0) {
    requestMessages = messages;
  } else if (prompt) {
    requestMessages = [{ role: 'user', content: prompt }];
  } else {
    return res.status(400).json({ error: 'Either messages or prompt must be provided.' });
  }

  try {
    const payload = {
      model: selectedModel,
      messages: requestMessages,
      stream: true,
      reasoning: reasoning !== undefined ? reasoning : { enabled: true }
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);

      if (response.status === 401 || response.status === 403) {
        return res.status(401).send(`Authentication failed (401/403). Please enter a valid OpenRouter API key in the Chatbot settings input bar at the top.`);
      }

      return res.status(response.status).send(`AI Error (${response.status}): ${errorText}`);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.body.on('data', chunk => {
      res.write(chunk);
    });

    response.body.on('end', () => {
      res.end();
    });

    response.body.on('error', (err) => {
      console.error('Stream error:', err);
      res.end();
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('AI Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
