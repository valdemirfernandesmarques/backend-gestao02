<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h1>Gestão <span>em</span> Dança</h1>
    </div>
    <ul class="menu">
      <li><router-link to="/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link></li>
      <li><router-link to="/alunos"><i class="fas fa-users"></i> Alunos</router-link></li>
      <li><router-link to="/professores"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link></li>
      <li><router-link to="/funcionarios"><i class="fas fa-briefcase"></i> Funcionários</router-link></li>
      <li><router-link to="/modalidades"><i class="fas fa-shapes"></i> Modalidades</router-link></li>
      <li><router-link to="/turmas"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link></li>
      <li><a href="#"><i class="fas fa-hand-holding-dollar"></i> Financeiro</a></li>
      <li><a href="#"><i class="fas fa-bullhorn"></i> Comunicação</a></li>
      <li><a href="#"><i class="fas fa-chart-pie"></i> Relatórios</a></li>
    </ul>
    <div class="sidebar-footer">
      <a href="#"><i class="fas fa-cog"></i> Configurações</a>
      <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('user-data');
  localStorage.removeItem('user-token');
  router.push('/login');
}
</script>

<style scoped>
/* Nenhum estilo novo é necessário */
.sidebar { width: 260px; background-color: #1f1c3a; padding: 2rem 1.5rem; display: flex; flex-direction: column; transition: width 0.3s ease; }
.sidebar-header h1 { font-family: 'Great Vibes', cursive; color: #f0f0f0; font-size: 2.5rem; text-align: center; margin-bottom: 2rem; font-weight: 500; }
.sidebar-header h1 span { color: #e45da9; }
.menu { list-style: none; flex-grow: 1; }
.menu li { margin-bottom: 1rem; }
.menu li a { color: #c799df; text-decoration: none; font-size: 1rem; display: flex; align-items: center; padding: 0.8rem; border-radius: 8px; transition: background-color 0.3s, color 0.3s; }
.menu li a i { margin-right: 15px; font-size: 1.2rem; width: 20px; text-align: center; }
.menu li a:hover,
.menu li a.router-link-exact-active { 
  background-color: #e45da9;
  color: #fff;
}
.sidebar-footer { padding-top: 1rem; border-top: 1px solid #332f54; }
.sidebar-footer a { color: #c799df; text-decoration: none; display: flex; align-items: center; padding: 0.8rem 0; font-size: 0.9rem; cursor: pointer; }
.sidebar-footer a i { margin-right: 15px; }
</style>