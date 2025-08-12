<template>
  <div>
    <header class="main-header">
      <h2>{{ aluno ? aluno.nomeCompleto : 'Detalhes do Aluno' }}</h2>
      <button class="btn-novo" @click="openCreatePagamentoModal">Registrar Pagamento</button>
    </header>

    <div v-if="isLoading" class="content-placeholder">
      <p>Carregando detalhes do aluno...</p>
    </div>

    <div v-else-if="error" class="content-placeholder error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="aluno" class="detalhes-container">
      
      <div class="info-card">
        <h3>Informações do Aluno</h3>
        <p><strong>Email:</strong> {{ aluno.email }}</p>
        <p><strong>Telefone:</strong> {{ aluno.telefone }}</p>
        <p><strong>CPF:</strong> {{ aluno.cpf || 'Não informado' }}</p>
        <p><strong>Data de Nascimento:</strong> {{ new Date(aluno.dataNascimento).toLocaleDateString() }}</p>
      </div>

      <div class="table-container">
        <h3>Histórico Financeiro</h3>
        <table>
          <thead>
            <tr>
              <th>Valor (R$)</th>
              <th>Data de Pagamento</th>
              <th>Status</th>
              <th>Método</th>
              <th>Turma Associada</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pagamentos.length === 0">
              <td colspan="6" class="status-message">Nenhum pagamento registrado para este aluno.</td>
            </tr>
            <tr v-else v-for="pagamento in pagamentos" :key="pagamento.id">
              <td>{{ parseFloat(pagamento.valor).toFixed(2) }}</td>
              <td>{{ new Date(pagamento.dataPagamento).toLocaleDateString() }}</td>
              <td>{{ pagamento.status }}</td>
              <td>{{ pagamento.metodoPagamento || 'N/A' }}</td>
              <td>{{ pagamento.Turma?.nome || 'Geral' }}</td>
              <td class="acoes">
                <button class="btn-acao editar" @click="openEditPagamentoModal(pagamento)"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-acao excluir" @click="confirmDeletePagamento(pagamento.id)"><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <PagamentoFormModal 
      :visible="isPagamentoModalVisible"
      :title="modalTitle"
      :initial-data="pagamentoEmEdicao"
      @close="closePagamentoModal"
      @save="handlePagamentoSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import PagamentoFormModal from '../components/PagamentoFormModal.vue';

const route = useRoute();
const alunoId = ref(route.params.id);

const aluno = ref(null);
const pagamentos = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isPagamentoModalVisible = ref(false);
const pagamentoEmEdicao = ref(null);
const modalTitle = ref('');

function closePagamentoModal() {
  isPagamentoModalVisible.value = false;
  pagamentoEmEdicao.value = null;
}

function openCreatePagamentoModal() {
  pagamentoEmEdicao.value = null;
  modalTitle.value = 'Registrar Novo Pagamento';
  isPagamentoModalVisible.value = true;
}

// NOVA FUNÇÃO para abrir o modal para EDIÇÃO
function openEditPagamentoModal(pagamento) {
  pagamentoEmEdicao.value = pagamento;
  modalTitle.value = 'Editar Pagamento';
  isPagamentoModalVisible.value = true;
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [alunoResponse, pagamentosResponse] = await Promise.all([
      api.get(`/alunos/${alunoId.value}`),
      api.get(`/alunos/${alunoId.value}/pagamentos`)
    ]);
    aluno.value = alunoResponse.data;
    pagamentos.value = pagamentosResponse.data;
  } catch (err) {
    console.error('Erro ao buscar detalhes do aluno:', err);
    error.value = 'Não foi possível carregar os detalhes do aluno.';
  } finally {
    isLoading.value = false;
  }
}

// NOVA FUNÇÃO "INTELIGENTE" que decide se deve criar ou atualizar
function handlePagamentoSave(pagamentoData) {
  if (pagamentoEmEdicao.value) {
    updatePagamento(pagamentoData);
  } else {
    addPagamento(pagamentoData);
  }
}

async function addPagamento(pagamentoData) {
  try {
    const dataToSend = { ...pagamentoData, alunoId: alunoId.value };
    await api.post('/pagamentos', dataToSend);
    closePagamentoModal();
    alert('Pagamento registrado com sucesso!');
    await fetchData();
  } catch (err) {
    console.error("Erro ao registrar pagamento:", err);
    alert('Não foi possível registrar o pagamento.');
  }
}

// NOVA FUNÇÃO para ATUALIZAR um pagamento
async function updatePagamento(pagamentoData) {
  try {
    await api.put(`/pagamentos/${pagamentoData.id}`, pagamentoData);
    closePagamentoModal();
    alert('Pagamento atualizado com sucesso!');
    await fetchData();
  } catch (err) {
    console.error("Erro ao atualizar pagamento:", err);
    alert('Não foi possível atualizar o pagamento.');
  }
}

// NOVA FUNÇÃO para EXCLUIR um pagamento
async function confirmDeletePagamento(pagamentoId) {
  if (confirm('Você tem certeza que deseja excluir este lançamento?')) {
    try {
      await api.delete(`/pagamentos/${pagamentoId}`);
      alert('Pagamento excluído com sucesso!');
      await fetchData();
    } catch (err) {
      console.error("Erro ao excluir pagamento:", err);
      alert('Não foi possível excluir o pagamento.');
    }
  }
}

onMounted(fetchData);
</script>

<style scoped>
/* O CSS continua o mesmo, sem alterações */
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h2 { font-weight: 600; color: #ff69b4; }
.btn-novo { background-color: #ff69b4; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
.content-placeholder { background-color: #1e1e2f; border-radius: 12px; padding: 4rem; text-align: center; color: #c799df; border: 2px dashed #444; }
.info-card { background-color: #1e1e2f; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
.info-card h3 { color: #ff69b4; margin-bottom: 1rem; border-bottom: 1px solid #444; padding-bottom: 1rem; }
.info-card p { line-height: 1.8; color: #f0f0f0; }
.table-container { background-color: #1e1e2f; padding: 2rem; border-radius: 12px; }
.table-container h3 { color: #ff69b4; margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #444; }
th { color: #ff69b4; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
td { color: #f0f0f0; }
.status-message { text-align: center; padding: 2rem; color: #c799df; }
.acoes { display: flex; gap: 10px; }
.btn-acao { background: none; border: 1px solid #444; color: #f0f0f0; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-acao.editar:hover { background-color: #c799df; color: #1f1c3a; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
</style>