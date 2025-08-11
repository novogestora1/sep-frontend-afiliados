// src/services/api.ts
import axios from "axios";

/**
 * Quando estamos em /afiliado, chamadas relativas para /api precisam
 * começar com /afiliado. Aqui a gente injeta isso automaticamente.
 *
 * Em prod, na Vercel do Afiliado, crie a env:
 *   NEXT_PUBLIC_BASE_PATH = /afiliado
 *
 * Em dev local, pode deixar vazia.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const api = axios.create({
  baseURL: BASE, // ex.: "" (dev) ou "/afiliado" (prod)
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // ative se precisar enviar cookies
});

export default api;
