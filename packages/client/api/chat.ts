import OpenAI from 'openai';

// Vercel maps /api/chat to this file when project root is packages/client
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: OPENAI_API_KEY missing' });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 300,
    });

    return res.json({ id: response.id, message: response.output_text });
  } catch (err: any) {
    console.error('Chat function error:', err);
    const message = err?.message || String(err) || 'Error generating response';
    return res.status(500).json({ error: 'Error generating response', details: message });
  }
}
