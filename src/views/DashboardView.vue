<template>
    <header class="main-header">
        <h2>{{ welcomeMessage }}</h2>
        <div class="user-profile">
            <img src="https://i.pravatar.cc/40" alt="Foto do Usuário">
        </div>
    </header>

    <section class="quick-access">
        <h3>Acesso Rápido</h3>
        <div class="cards-container">
            <div class="card">
                <i class="fas fa-user-plus"></i>
                <span>Nova Matrícula</span>
            </div>
            <div class="card">
                <i class="fas fa-money-bill-wave"></i>
                <span>Registrar Pagamento</span>
            </div>
            <div class="card">
                <i class="fas fa-calendar-check"></i>
                <span>Agenda de Hoje</span>
            </div>
        </div>
    </section>
    
    <section class="main-view">
        <h3>Visão Geral das Turmas</h3>
        <div class="content-placeholder">
            <p>O conteúdo principal de cada módulo, como a lista de alunos, o calendário de turmas ou o fluxo de caixa, aparecerá aqui.</p>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Criamos uma variável reativa para a nossa mensagem
const welcomeMessage = ref('Seja bem-vindo(a)!');

// onMounted é uma função do Vue que roda assim que o componente é "montado" na tela
onMounted(() => {
  // 1. Buscamos os dados do usuário que salvamos no localStorage
  const userDataString = localStorage.getItem('user-data');
  
  if (userDataString) {
    // 2. Convertemos a string de volta para um objeto
    const userData = JSON.parse(userDataString);
    
    // 3. Pegamos o email e extraímos o nome antes do '@' para uma mensagem mais amigável
    //    (No futuro, quando tivermos um campo 'nome', usaremos ele aqui)
    const name = userData.email.split('@')[0];
    
    // 4. Atualizamos a nossa mensagem
    welcomeMessage.value = `Seja bem-vindo(a), ${name}!`;
  }
});
</script>

<style scoped>
/* Estilos do Conteúdo Principal */
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

/* --- NOVA REGRA DE ESTILO --- */
/* Deixamos o H2 com a cor magenta do seu design para dar mais destaque */
.main-header h2 { 
    font-weight: 600;
    color: #e45da9; /* Magenta */
}

.user-profile img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.quick-access h3, .main-view h3 { margin-bottom: 1rem; font-weight: 600; color: #c799df; }
.cards-container { display: flex; gap: 1.5rem; margin-bottom: 3rem; }
.card { background-color: #1f1c3a; padding: 1.5rem; border-radius: 12px; flex-grow: 1; text-align: center; cursor: pointer; transition: transform 0.3s, background-color 0.3s; }
.card:hover { transform: translateY(-5px); background-color: #2b2850; }
.card i { font-size: 2rem; color: #e45da9; margin-bottom: 1rem; }
.card span { display: block; font-size: 1rem; font-weight: 600; }
.content-placeholder { background-color: #1f1c3a; border-radius: 12px; padding: 4rem; text-align: center; color: #c799df; border: 2px dashed #332f54; }
</style>