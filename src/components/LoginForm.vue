<template>
  <div class="login-container">
    <h2>Login do Sistema</h2>
    <form @submit.prevent>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="senha">Senha:</label>
        <input type="password" id="senha" v-model="senha" required />
      </div>
      <p v-if="mensagem" class="error-message">{{ mensagem }}</p>
      <button type="submit" @click="fazerLogin">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api'; // MUDANÇA: Usamos nosso novo arquivo de API centralizado

const email = ref('');
const senha = ref('');
const mensagem = ref('');
const router = useRouter();

async function fazerLogin() {
  console.log('Função fazerLogin foi chamada!');
  mensagem.value = '';
  try {
    // MUDANÇA: Usamos 'api.post' e passamos apenas o caminho relativo ('/login')
    const response = await api.post('/login', { email: email.value, senha: senha.value });
    
    localStorage.setItem('user-token', response.data.token);
    localStorage.setItem('user-data', JSON.stringify(response.data.usuario));

    router.push('/dashboard');

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    if (error.response && error.response.data && error.response.data.message) {
      mensagem.value = error.response.data.message;
    } else {
      mensagem.value = 'Erro ao conectar com o servidor.';
    }
  }
}
</script>

<style scoped>
.login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background-color: #1f1c3a; }
.form-group { margin-bottom: 15px; text-align: left; }
label { display: block; margin-bottom: 5px; color: #c799df; }
input { width: 100%; padding: 8px; box-sizing: border-box; background-color: #181529; border: 1px solid #332f54; color: #f0f0f0; border-radius: 4px; }
button { width: 100%; padding: 10px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
button:hover { background-color: #369a6e; }
.error-message { color: red; font-weight: bold; }
h2 { color: #f0f0f0; }
</style>