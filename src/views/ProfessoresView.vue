<template>
  <div class="professores-container">
    <header class="main-header">
      <h2>Gestão de Professores</h2>
      <button class="btn-novo" @click="openCreateModal">Novo Professor</button>
    </header>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Contratação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="status-message">Carregando professores...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="5" class="status-message error">{{ error }}</td>
          </tr>
          <tr v-else-if="professores.length === 0">
            <td colspan="5" class="status-message">Nenhum professor encontrado.</td>
          </tr>
          <tr v-else v-for="professor in professores" :key="professor.id">
            <td>{{ professor.nomeCompleto }}</td>
            <td>{{ professor.email }}</td>
            <td>{{ professor.telefone }}</td>
            <td>{{ professor.regimeContratacao }}</td>
            <td class="acoes">
              <button class="btn-acao editar" @click="openEditModal(professor)"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-acao excluir" @click="confirmDeleteProfessor(professor.id, professor.nomeCompleto)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProfessorFormModal 
      :visible="isModalVisible"
      :title="modalTitle"
      :initial-data="professorEmEdicao"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProfessorFormModal from '../components/ProfessorFormModal.vue';
import api from '@/api'; // MUDANÇA

const professores = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const professorEmEdicao = ref(null);
const modalTitle = ref('');

function closeModal() { isModalVisible.value = false; professorEmEdicao.value = null; }
function openCreateModal() { professorEmEdicao.value = null; modalTitle.value = 'Cadastrar Novo Professor'; isModalVisible.value = true; }
function openEditModal(professor) { professorEmEdicao.value = { ...professor }; modalTitle.value = 'Editar Professor'; isModalVisible.value = true; }
function handleSave(professorData) { if (professorEmEdicao.value) { updateProfessor(professorData); } else { addProfessor(professorData); } }

async function fetchProfessores() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/professores'); // MUDANÇA
    professores.value = response.data;
  } catch (err) { error.value = 'Não foi possível carregar os professores.'; } finally { isLoading.value = false; }
}
async function addProfessor(novoProfessor) {
  try {
    await api.post('/professores', novoProfessor); // MUDANÇA
    closeModal();
    await fetchProfessores();
  } catch (err) { alert('Não foi possível cadastrar o professor.'); }
}
async function updateProfessor(professorData) {
  try {
    await api.put(`/professores/${professorData.id}`, professorData); // MUDANÇA
    closeModal();
    await fetchProfessores();
  } catch (err) { alert('Não foi possível atualizar o professor.'); }
}
async function confirmDeleteProfessor(professorId, professorNome) {
  if (confirm(`Você tem certeza que deseja excluir o professor "${professorNome}"?`)) {
    try {
      await api.delete(`/professores/${professorId}`); // MUDANÇA
      alert('Professor excluído com sucesso!');
      await fetchProfessores();
    } catch (err) { alert('Não foi possível excluir o professor.'); }
  }
}
onMounted(fetchProfessores);
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
.btn-acao.editar:hover { background-color: #c799df; color: #1f1c3a; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
</style>