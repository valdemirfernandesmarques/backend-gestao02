<template>
  <div class="funcionarios-container">
    <header class="main-header">
      <h2>Gestão de Funcionários</h2>
      <button class="btn-novo" @click="openCreateModal">Novo Funcionário</button>
    </header>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Cargo</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading"><td colspan="6" class="status-message">Carregando...</td></tr>
          <tr v-else-if="error"><td colspan="6" class="status-message error">{{ error }}</td></tr>
          <tr v-else-if="funcionarios.length === 0"><td colspan="6" class="status-message">Nenhum funcionário encontrado.</td></tr>
          <tr v-else v-for="funcionario in funcionarios" :key="funcionario.id">
            <td>{{ funcionario.nomeCompleto }}</td>
            <td>{{ funcionario.cargo }}</td>
            <td>{{ funcionario.email }}</td>
            <td>{{ funcionario.telefone }}</td>
            <td>
              <span :class="['status-pill', funcionario.ativo ? 'ativo' : 'inativo']">
                {{ funcionario.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="acoes">
              <button class="btn-acao editar" @click="openEditModal(funcionario)"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-acao excluir" @click="confirmDeleteFuncionario(funcionario.id, funcionario.nomeCompleto)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <FuncionarioFormModal 
      :visible="isModalVisible"
      :title="modalTitle"
      :initial-data="funcionarioEmEdicao"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import FuncionarioFormModal from '../components/FuncionarioFormModal.vue';

const funcionarios = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const funcionarioEmEdicao = ref(null);
const modalTitle = ref('');

function closeModal() { isModalVisible.value = false; funcionarioEmEdicao.value = null; }
function openCreateModal() { funcionarioEmEdicao.value = null; modalTitle.value = 'Cadastrar Novo Funcionário'; isModalVisible.value = true; }
function openEditModal(funcionario) { funcionarioEmEdicao.value = { ...funcionario }; modalTitle.value = 'Editar Funcionário'; isModalVisible.value = true; }
function handleSave(funcionarioData) { if (funcionarioEmEdicao.value) { updateFuncionario(funcionarioData); } else { addFuncionario(funcionarioData); } }

async function fetchFuncionarios() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/funcionarios');
    funcionarios.value = response.data;
  } catch (err) { error.value = 'Não foi possível carregar os funcionários.'; } 
  finally { isLoading.value = false; }
}

async function addFuncionario(novoFuncionario) {
  try {
    await api.post('/funcionarios', novoFuncionario);
    closeModal();
    await fetchFuncionarios();
  } catch (err) {
    console.error("Erro ao adicionar funcionário:", err);
    let detailedError = 'Não foi possível cadastrar o funcionário.';
    // Lógica para extrair a mensagem de erro específica do backend
    if (err.response && err.response.data) {
      if (err.response.data.message) {
        detailedError += `\n\nMotivo: ${err.response.data.message}`;
      }
      if (err.response.data.error && err.response.data.error.errors) {
        const fields = err.response.data.error.errors.map(e => `${e.path}: ${e.message}`).join('\n');
        detailedError += `\n\nCampos com problema:\n${fields}`;
      }
    }
    alert(detailedError);
  }
}

async function updateFuncionario(funcionarioData) {
  try {
    await api.put(`/funcionarios/${funcionarioData.id}`, funcionarioData);
    closeModal();
    await fetchFuncionarios();
  } catch (err) { alert('Não foi possível atualizar o funcionário.'); }
}

async function confirmDeleteFuncionario(funcionarioId, funcionarioNome) {
  if (confirm(`Você tem certeza que deseja excluir o funcionário "${funcionarioNome}"?`)) {
    try {
      await api.delete(`/funcionarios/${funcionarioId}`);
      alert('Funcionário excluído com sucesso!');
      await fetchFuncionarios();
    } catch (err) { alert('Não foi possível excluir o funcionário.'); }
  }
}

onMounted(fetchFuncionarios);
</script>

<style scoped>
/* Estilos 100% reutilizados */
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h2 { font-weight: 600; color: #ff69b4; }
.btn-novo { background-color: #ff69b4; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
.table-container { background-color: #1e1e2f; padding: 2rem; border-radius: 12px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #444; }
th { color: #ff69b4; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
td { color: #f0f0f0; }
.status-pill { padding: 0.3rem 0.8rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
.status-pill.ativo { background-color: rgba(66, 185, 131, 0.2); color: #42b983; }
.status-pill.inativo { background-color: rgba(255, 92, 92, 0.2); color: #ff5c5c; }
.acoes { display: flex; gap: 10px; }
.btn-acao { background: none; border: 1px solid #444; color: #f0f0f0; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-acao.editar:hover { background-color: #c799df; color: #1f1c3a; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
.status-message { text-align: center; padding: 2rem; color: #c799df; }
</style>