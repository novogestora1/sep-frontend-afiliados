import type { NextApiRequest, NextApiResponse } from "next";

// Token da Hub (configure na Vercel, projeto Afiliado)
const HUB_DEVELOPER_API_TOKEN = process.env.HUB_DEVELOPER_API_TOKEN;

// Helper para mapear mensagens da Hub em status coerentes
function mapHubErrorToStatus(message: string) {
  const msg = (message || "").toLowerCase();
  if (
    msg.includes("cpf inválido") ||
    msg.includes("cpf invalido") ||
    msg.includes("parametro invalido") ||
    msg.includes("parâmetro inválido")
  ) {
    return 400; // parâmetro ruim
  }
  if (msg.includes("nome não encontrado") || msg.includes("nao encontrado")) {
    return 404; // não encontrado
  }
  return 502; // erro a jusante (hub)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Preflight (seguro para futuros cenários de CORS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Sanitiza CPF
  const cpfParam = req.query.cpf;
  const rawCpf = typeof cpfParam === "string" ? cpfParam.replace(/\D/g, "") : "";

  if (!rawCpf || rawCpf.length !== 11) {
    return res.status(400).json({ message: "CPF inválido fornecido." });
  }

  if (!HUB_DEVELOPER_API_TOKEN) {
    console.error("HUB_DEVELOPER_API_TOKEN ausente nas variáveis de ambiente.");
    return res.status(500).json({ message: "Erro de configuração do servidor." });
  }

  try {
    // monta URL com segurança
    const url = new URL("https://ws.hubdodesenvolvedor.com.br/v2/nome_cpf/");
    url.searchParams.set("cpf", rawCpf);
    url.searchParams.set("token", HUB_DEVELOPER_API_TOKEN);

    // timeout de 12s usando AbortController
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const resp = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);

    // Pode falhar com não-JSON; protegemos
    let data: any = null;
    try {
      data = await resp.json();
    } catch (e) {
      console.error("Resposta não-JSON da Hub:", e);
      return res.status(502).json({ message: "Resposta inválida do serviço de CPF." });
    }

    // Log de depuração (mantenha enquanto testa)
    console.log("Hub CPF response:", JSON.stringify(data));

    // Estrutura esperada: { status: true/false, return: "OK"/"NOK", result: {...}, message?: string }
    if (data?.status === true && data?.return === "OK" && data?.result) {
      const fullName: string = data.result.nome || "";
      const [firstName, ...rest] = fullName.trim().split(/\s+/);
      const surname = rest.join(" ");

      // Alguns retornos usam "data_de_nascimento", outros "nascimento" — fazemos fallback
      const dateOfBirth: string =
        data.result.data_de_nascimento ||
        data.result.nascimento ||
        data.result.data_nascimento ||
        "";

      return res.status(200).json({
        firstName: firstName || "",
        surname: surname || "",
        dateOfBirth, // formato da Hub (ex.: "27/04/1988")
      });
    }

    // Caso NOK / erro sem result válido
    const hubMessage: string = data?.message || "Dados do CPF não encontrados ou erro na API da Hub.";
    const status = mapHubErrorToStatus(hubMessage);
    return res.status(status).json({ message: hubMessage });
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ message: "Tempo excedido ao consultar o serviço de CPF." });
    }
    console.error("Erro ao chamar a Hub de Desenvolvedor (CPF):", error);
    return res.status(502).json({ message: "Falha ao consultar o serviço de CPF." });
  }
}
