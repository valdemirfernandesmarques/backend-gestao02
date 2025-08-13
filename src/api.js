import axios from 'axios';

// Criamos uma instância do Axios com a configuração base
const api = axios.create({
  // MUDANÇA IMPORTANTE: Apontamos para o novo endereço do seu servidor na nuvem
  baseURL: 'https://jardim-servidor.onrender.com' 
});

// Este interceptor anexa o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('user-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;