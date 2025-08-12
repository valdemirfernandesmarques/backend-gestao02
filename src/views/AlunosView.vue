<template>
  <div class="alunos-container">
    <header class="main-header">
      <h2>Gestão de Alunos</h2>
      <button class="btn-novo" @click="openCreateModal">Novo Aluno</button>
    </header>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading"><td colspan="5" class="status-message">Carregando alunos...</td></tr>
          <tr v-else-if="error"><td colspan="5" class="status-message error">{{ error }}</td></tr>
          <tr v-else-if="alunos.length === 0"><td colspan="5" class="status-message">Nenhum aluno encontrado.</td></tr>
          <tr v-else v-for="aluno in alunos" :key="aluno.id">
            <td>{{ aluno.nomeCompleto }}</td>
            <td>{{ aluno.email }}</td>
            <td>{{ aluno.cpf || 'Não informado' }}</td>
            <td>
              <span :class="['status-pill', aluno.ativo ? 'ativo' : 'inativo']">{{ aluno.ativo ? 'Ativo' : 'Inativo' }}</span>
            </td>
            <td class="acoes">
              <router-link :to="`/alunos/${aluno.id}`" class="btn-acao detalhes">
                <i class="fas fa-eye"></i>
              </router-link>
              <button class="btn-acao editar" @click="openEditModal(aluno)"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-acao excluir" @click="confirmDeleteAluno(aluno.id, aluno.nomeCompleto)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AlunoFormModal 
      :visible="isModalVisible"
      :title="modalTitle"
      :initial-data="alunoEmEdicao"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AlunoFormModal from '../components/AlunoFormModal.vue';
import api from '@/api';
// O script continua o mesmo, sem alterações na lógica
const alunos = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const alunoEmEdicao = ref(null);
const modalTitle = ref('');
function closeModal() { isModalVisible.value = false; alunoEmEdicao.value = null; }
function openCreateModal() { alunoEmEdicao.value = null; modalTitle.value = 'Cadastrar Novo Aluno'; isModalVisible.value = true; }
function openEditModal(aluno) { alunoEmEdicao.value = aluno; modalTitle.value = 'Editar Aluno'; isModalVisible.value = true; }
function handleSave(alunoData) { if (alunoEmEdicao.value) { updateAluno(alunoData); } else { addAluno(alunoData); } }
async function fetchAlunos() { isLoading.value = true; error.value = null; try { const response = await api.get('/alunos'); alunos.value = response.data; } catch (err) { console.error("Erro ao buscar alunos:", err); error.value = 'Não foi possível carregar os alunos.'; } finally { isLoading.value = false; } }
async function addAluno(novoAluno) { try { await api.post('/alunos', novoAluno); closeModal(); await fetchAlunos(); } catch (err) { alert('Não foi possível cadastrar o aluno.'); } }
async function updateAluno(alunoData) { try { await api.put(`/alunos/${alunoData.id}`, alunoData); closeModal(); await fetchAlunos(); } catch (err) { alert('Não foi possível atualizar o aluno.'); } }
async function confirmDeleteAluno(alunoId, alunoNome) { if (confirm(`Você tem certeza que deseja excluir o aluno "${alunoNome}"?`)) { try { await api.delete(`/alunos/${alunoId}`); alert('Aluno excluído com sucesso!'); await fetchAlunos(); } catch (err) { alert('Não foi possível excluir o aluno.'); } } }
onMounted(fetchAlunos);
</script>

<style scoped>
/* Adicionamos o estilo para o novo botão de detalhes */
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
.btn-acao.detalhes { font-size: 1rem; text-decoration: none; }
.btn-acao.detalhes:hover { background-color: #4a4687; color: #fff; }
.btn-acao.editar:hover { background-color: #c799df; color: #1f1c3a; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
.status-message { text-align: center; padding: 2rem; color: #c799df; }
</style>