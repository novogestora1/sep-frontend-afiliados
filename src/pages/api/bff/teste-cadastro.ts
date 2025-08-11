import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Método recebido:', req.method);
  if (req.method === 'POST') {
    return res.status(200).json({ message: 'Requisição POST recebida com sucesso!' });
  }
  return res.status(405).json({ message: 'Method Not Allowed' });
}