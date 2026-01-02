// Lightweight debug endpoint for verifying runtime env without exposing secrets
export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyPresent = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0);
  const nodeEnv = process.env.NODE_ENV || null;
  const vercelEnv = process.env.VERCEL ? true : false;

  return res.status(200).json({ keyPresent, nodeEnv, vercelEnv });
}
