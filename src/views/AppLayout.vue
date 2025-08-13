<template>
  <div class="dashboard-container">
    <TheSidebar />
    <main class="main-content">
        <router-view />
    </main>
  </div>
</template>

<script setup>
// MUDANÇA: Importamos o componente com o novo nome
import TheSidebar from '../components/TheSidebar.vue';
</script>

<style>
/* Reset Básico e Estilos Globais */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: #181529;
    color: #f0f0f0;
    height: 100vh;
    overflow: hidden;
}

/* Estilos do Layout Principal */
.dashboard-container {
    display: flex;
    width: 100%;
    height: 100vh;
}

.main-content {
    flex-grow: 1;
    padding: 2rem 3rem;
    overflow-y: auto;
}
</style>