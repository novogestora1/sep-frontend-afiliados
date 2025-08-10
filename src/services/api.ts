// src/services/api.ts
import axios from 'axios';

export const bffApi = axios.create({
  baseURL: '/api/bff',
});
