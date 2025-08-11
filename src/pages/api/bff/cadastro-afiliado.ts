// src/pages/api/bff/cadastro-afiliado.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Encaminha para seu backend/HUB
    const response = await axios.post(
      `${process.env.BACKEND_API_URL}/api/cadastro-afiliado`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BACKEND_API_KEY || "",
        },
        timeout: 20000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || "Erro inesperado";
    return res.status(status).json({ message });
  }
}
