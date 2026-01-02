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
  const keyPresent = Boolean(apiKey && apiKey.length > 0);
  console.log('OPENAI_API_KEY present:', keyPresent);
  if (!keyPresent) {
    return res.status(500).json({ error: 'Server misconfigured: OPENAI_API_KEY missing' });
  }
  try {
    console.log('Received prompt length:', prompt.length);
    const template = `You're a customer support agent for a theme park named WonderWorld.

  Here's some key information about the park:

    {{PARK_INFO}}

  Only answer questions related to WonderWorld.

  Always answer in a cheerful tone and avoid making up information.`;

    const parkInfo = `Welcome to WonderWorld!\n\nTicket Types:\n- General Admission: $129\n- Child Admission: $109\n- Senior: $99\n\nPark Hours:\n- Main Park: 9:00 AM - 10:00 PM\n- Wonder Waterpark: 10:00 AM - 6:00 PM\n\nHighlights:\n- Quest of the Crystal Guardians (4D ride)\n- Dreamlight Express (train)\n- Phantom Vale Coaster (thrill)\n\nDining, Hotels, Shows, Accessibility information available on request.`;

    const instructions = template.replace('{{PARK_INFO}}', parkInfo);
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        instructions,
        input: prompt,
        temperature: 0.2,
        max_output_tokens: 300,
      }),
    });

    const text = await r.text();
    let json: any;
    try {
      json = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      console.error('OpenAI response not JSON:', text);
      return res.status(502).json({ error: 'OpenAI API error', details: text });
    }
    console.log('OpenAI response status:', r.status, 'body:', json);
    if (!r.ok) {
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
