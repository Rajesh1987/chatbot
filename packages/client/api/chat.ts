// Use fetch directly to call OpenAI Responses API to avoid SDK/runtime incompatibilities in Vercel
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
  try {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: prompt,
        temperature: 0.2,
        max_output_tokens: 300,
      }),
    });

    const json: any = await r.json();
    if (!r.ok) {
      console.error('OpenAI API error', json);
      const errMsg = json.error?.message || JSON.stringify(json);
      return res.status(502).json({ error: 'OpenAI API error', details: errMsg });
    }

    // Try to extract text from common response shapes
    let message = json.output_text || '';
    if (!message && Array.isArray(json.output)) {
      message = json.output.map((o: any) => {
        if (typeof o === 'string') return o;
        if (o.content && Array.isArray(o.content)) {
          return o.content.map((c: any) => (typeof c === 'string' ? c : c?.text || '')).join('');
        }
        return '';
      }).join('\n');
    }
    if (!message) message = JSON.stringify(json);

    return res.json({ id: json.id, message });
  } catch (err: any) {
    console.error('Chat function error:', err);
    const message = err?.message || String(err) || 'Error generating response';
    return res.status(500).json({ error: 'Error generating response', details: message });
  }
}
