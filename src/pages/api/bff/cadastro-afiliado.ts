import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post(
      `${process.env.BACKEND_API_URL}/api/cadastro-afiliado`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.BACKEND_API_KEY || '',
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'Erro inesperado';
    res.status(status).json({ message });
  }
}
