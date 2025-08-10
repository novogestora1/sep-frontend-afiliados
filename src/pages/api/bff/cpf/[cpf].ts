// src/pages/api/bff/cpf/[cpf].ts
import type { NextApiRequest, NextApiResponse } from 'next';

const HUB_DEVELOPER_API_TOKEN = process.env.HUB_DEVELOPER_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cpf } = req.query;

  const rawCpf = typeof cpf === 'string' ? cpf.replace(/\D/g, '') : '';

  if (!rawCpf || rawCpf.length !== 11) {
    return res.status(400).json({ message: 'CPF inválido fornecido.' });
  }

  if (!HUB_DEVELOPER_API_TOKEN) {
    console.error('HUB_DEVELOPER_API_TOKEN não configurado nas variáveis de ambiente.');
    return res.status(500).json({ message: 'Erro de configuração do servidor.' });
  }

  try {
    const hubApiUrl = `https://ws.hubdodesenvolvedor.com.br/v2/nome_cpf/?cpf=${rawCpf}&token=${HUB_DEVELOPER_API_TOKEN}`;
    const response = await fetch(hubApiUrl);
    const data = await response.json();

    console.log('Resposta da API da Hub (CPF):', data); // Mantenha esta linha para depuração

    if (data.status === true && data.return === "OK" && data.result) {
      const fullName = data.result.nome;
      const firstName = fullName.split(' ')[0];
      const surname = fullName.split(' ').slice(1).join(' ');

      res.status(200).json({
        firstName: firstName,
        surname: surname,
        // CORREÇÃO AQUI: usar data.result.data_de_nascimento
        dateOfBirth: data.result.data_de_nascimento,
      });
    } else {
      const errorMessage = data.message || 'Dados do CPF não encontrados ou erro na API da Hub do Desenvolvedor.';
      const statusCode = data.return === "NOK" && (errorMessage.includes("CPF Inválido") || errorMessage.includes("Parametro Invalido") || errorMessage.includes("Nome não encontrado")) ? 404 : 500;
      res.status(statusCode).json({ message: errorMessage });
    }
  } catch (error) {
    console.error('Erro ao chamar a API da Hub do Desenvolvedor (CPF):', error);
    res.status(500).json({ message: 'Erro interno ao buscar dados do CPF.' });
  }
}