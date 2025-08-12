import axios from 'axios';

// Criamos uma instância do Axios com a configuração base
const api = axios.create({
  baseURL: 'http://localhost:3334' // MUDANÇA: Nosso novo endereço do backend
});

// Adicionamos um "interceptor" que anexa o token de autenticação em TODAS as requisições
// que usarem esta instância 'api'.
api.interceptors.request.use(async (config) => {
  // Pega o token do localStorage
  const token = localStorage.getItem('user-token');
  // Se o token existir, adiciona ao cabeçalho 'Authorization'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;