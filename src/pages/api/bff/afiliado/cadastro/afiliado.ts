import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const BACKEND_API_URL = process.env.BACKEND_API_URL;
  const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

  if (!BACKEND_API_URL || !BACKEND_API_KEY) {
    return res.status(500).json({ message: 'Erro de configuração do servidor. Chaves de API não configuradas.' });
  }

  try {
    const response = await axios.post(`${BACKEND_API_URL}/api/cadastro-afiliado`, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BACKEND_API_KEY,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Erro ao chamar a API de cadastro:', error?.response?.data || error?.message);
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'Erro inesperado ao cadastrar afiliado.';
    res.status(status).json({ message });
  }
}