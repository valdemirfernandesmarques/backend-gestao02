<template>
  <div class="modalidades-container">
    <header class="main-header">
      <h2>Gestão de Modalidades</h2>
      <button class="btn-novo" @click="openCreateModal">Nova Modalidade</button>
    </header>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="3" class="status-message">Carregando modalidades...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="3" class="status-message error">{{ error }}</td>
          </tr>
          <tr v-else-if="modalidades.length === 0">
            <td colspan="3" class="status-message">Nenhuma modalidade encontrada.</td>
          </tr>
          <tr v-else v-for="modalidade in modalidades" :key="modalidade.id">
            <td>{{ modalidade.nome }}</td>
            <td>{{ modalidade.descricao || 'Sem descrição' }}</td>
            <td class="acoes">
              <button class="btn-acao editar" @click="openEditModal(modalidade)"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-acao excluir" @click="confirmDeleteModalidade(modalidade.id, modalidade.nome)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalidadeFormModal 
      :visible="isModalVisible"
      :title="modalTitle"
      :initial-data="modalidadeEmEdicao"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ModalidadeFormModal from '../components/ModalidadeFormModal.vue';
import api from '@/api'; // MUDANÇA

const modalidades = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const modalidadeEmEdicao = ref(null);
const modalTitle = ref('');

function closeModal() { isModalVisible.value = false; modalidadeEmEdicao.value = null; }
function openCreateModal() { modalidadeEmEdicao.value = null; modalTitle.value = 'Cadastrar Nova Modalidade'; isModalVisible.value = true; }
function openEditModal(modalidade) { modalidadeEmEdicao.value = { ...modalidade }; modalTitle.value = 'Editar Modalidade'; isModalVisible.value = true; }
function handleSave(modalidadeData) { if (modalidadeEmEdicao.value) { updateModalidade(modalidadeData); } else { addModalidade(modalidadeData); } }

async function fetchModalidades() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/modalidades'); // MUDANÇA
    modalidades.value = response.data;
  } catch (err) { error.value = 'Não foi possível carregar as modalidades.'; } finally { isLoading.value = false; }
}
async function addModalidade(novaModalidade) {
  try {
    await api.post('/modalidades', novaModalidade); // MUDANÇA
    closeModal();
    await fetchModalidades();
  } catch (err) { alert('Não foi possível cadastrar a modalidade.'); }
}
async function updateModalidade(modalidadeData) {
  try {
    await api.put(`/modalidades/${modalidadeData.id}`, modalidadeData); // MUDANÇA
    closeModal();
    await fetchModalidades();
  } catch (err) { alert('Não foi possível atualizar a modalidade.'); }
}
async function confirmDeleteModalidade(modalidadeId, modalidadeNome) {
  if (confirm(`Você tem certeza que deseja excluir a modalidade "${modalidadeNome}"?`)) {
    try {
      await api.delete(`/modalidades/${modalidadeId}`); // MUDANÇA
      alert('Modalidade excluída com sucesso!');
      await fetchModalidades();
    } catch (err) { alert('Não foi possível excluir a modalidade.'); }
  }
}
onMounted(fetchModalidades);
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