<template>
  <div class="turmas-container">
    <header class="main-header">
      <h2>Gestão de Turmas e Agenda</h2>
      <button class="btn-novo" @click="openCreateModal">Nova Turma</button>
    </header>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome da Turma</th>
            <th>Modalidade</th>
            <th>Professor</th>
            <th>Dia e Horário</th>
            <th>Vagas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="status-message">Carregando turmas...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="6" class="status-message error">{{ error }}</td>
          </tr>
          <tr v-else-if="turmas.length === 0">
            <td colspan="6" class="status-message">Nenhuma turma encontrada.</td>
          </tr>
          <tr v-else v-for="turma in turmas" :key="turma.id">
            <td>{{ turma.nome }}</td>
            <td>{{ turma.Modalidade?.nome || 'N/A' }}</td>
            <td>{{ turma.Professor?.nomeCompleto || 'N/A' }}</td>
            <td>{{ turma.diaDaSemana }} ({{ turma.horarioInicio }} - {{ turma.horarioFim }})</td>
            <td>{{ turma.maxAlunos || 'Ilimitadas' }}</td>
            <td class="acoes">
              <router-link :to="`/turmas/${turma.id}`" class="btn-acao detalhes"><i class="fas fa-eye"></i></router-link>
              <button class="btn-acao editar" @click="openEditModal(turma)"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-acao excluir" @click="confirmDeleteTurma(turma.id, turma.nome)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TurmaFormModal 
      :visible="isModalVisible"
      :title="modalTitle"
      :initial-data="turmaEmEdicao"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TurmaFormModal from '../components/TurmaFormModal.vue';
import api from '@/api'; // MUDANÇA

const turmas = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const turmaEmEdicao = ref(null);
const modalTitle = ref('');

function closeModal() { isModalVisible.value = false; turmaEmEdicao.value = null; }
function openCreateModal() { turmaEmEdicao.value = null; modalTitle.value = 'Cadastrar Nova Turma'; isModalVisible.value = true; }
function openEditModal(turma) { turmaEmEdicao.value = { ...turma }; modalTitle.value = 'Editar Turma'; isModalVisible.value = true; }
function handleSave(turmaData) { if (turmaEmEdicao.value) { updateTurma(turmaData); } else { addTurma(turmaData); } }

async function fetchTurmas() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/turmas'); // MUDANÇA
    turmas.value = response.data;
  } catch (err) { error.value = 'Não foi possível carregar as turmas.'; } finally { isLoading.value = false; }
}
async function addTurma(novaTurma) {
  try {
    await api.post('/turmas', novaTurma); // MUDANÇA
    closeModal();
    await fetchTurmas();
  } catch (err) { alert('Não foi possível cadastrar a turma.'); }
}
async function updateTurma(turmaData) {
  try {
    await api.put(`/turmas/${turmaData.id}`, turmaData); // MUDANÇA
    closeModal();
    await fetchTurmas();
  } catch (err) { alert('Não foi possível atualizar a turma.'); }
}
async function confirmDeleteTurma(turmaId, turmaNome) {
  if (confirm(`Você tem certeza que deseja excluir a turma "${turmaNome}"?`)) {
    try {
      await api.delete(`/turmas/${turmaId}`); // MUDANÇA
      alert('Turma excluída com sucesso!');
      await fetchTurmas();
    } catch (err) { alert('Não foi possível excluir a turma.'); }
  }
}
onMounted(fetchTurmas);
</script>

<style scoped>
/* Estilos são 100% reutilizados */
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h2 { font-weight: 600; color: #c799df; }
.btn-novo { background-color: #e45da9; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.table-container { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #332f54; }
th { color: #c799df; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
td { color: #f0f0f0; }
.status-message { text-align: center; padding: 2rem; color: #c799df; }
.acoes { display: flex; gap: 10px; }
.btn-acao { background: none; border: 1px solid #332f54; color: #c799df; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-acao.detalhes { font-size: 1rem; text-decoration: none; } 
.btn-acao.detalhes:hover { background-color: #4a4687; color: #fff; }
.btn-acao.editar:hover { background-color: #c799df; color: #1f1c3a; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
</style>