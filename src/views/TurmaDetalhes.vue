<template>
  <div>
    <header class="main-header">
      <h2>{{ turma ? turma.nome : 'Detalhes da Turma' }}</h2>
      <button class="btn-novo" @click="openMatriculaModal">Matricular Aluno</button>
    </header>

    <div v-if="isLoading" class="content-placeholder">
      <p>Carregando informações da turma...</p>
    </div>

    <div v-else-if="error" class="content-placeholder error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="turma" class="detalhes-container">
      
      <div class="info-card">
        <h3>Informações da Turma</h3>
        <p><strong>Modalidade:</strong> {{ turma.Modalidade?.nome }}</p>
        <p><strong>Professor:</strong> {{ turma.Professor?.nomeCompleto }}</p>
        <p><strong>Horário:</strong> {{ turma.diaDaSemana }}, das {{ turma.horarioInicio }} às {{ turma.horarioFim }}</p>
        <p><strong>Vagas Máximas:</strong> {{ turma.maxAlunos || 'Ilimitadas' }}</p>
      </div>

      <div class="table-container">
        <h3>Alunos Matriculados ({{ alunosMatriculados.length }})</h3>
        <table>
          <thead>
            <tr>
              <th>Nome do Aluno</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="alunosMatriculados.length === 0">
              <td colspan="4" class="status-message">Nenhum aluno matriculado nesta turma.</td>
            </tr>
            <tr v-else v-for="aluno in alunosMatriculados" :key="aluno.id">
              <td>{{ aluno.nomeCompleto }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td class="acoes">
                <button class="btn-acao excluir" @click="confirmDeleteMatricula(aluno.id, aluno.nomeCompleto)">
                  <i class="fas fa-user-minus"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <MatriculaFormModal
      :visible="isMatriculaModalVisible"
      :alunos-ja-matriculados="alunosMatriculados" 
      @close="closeMatriculaModal"
      @save="handleMatriculaSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api'; // MUDANÇA: Usamos nosso novo arquivo de API
import MatriculaFormModal from '../components/MatriculaFormModal.vue';

const route = useRoute();
const turmaId = ref(route.params.id);

const turma = ref(null);
const alunosMatriculados = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isMatriculaModalVisible = ref(false);

function openMatriculaModal() { isMatriculaModalVisible.value = true; }
function closeMatriculaModal() { isMatriculaModalVisible.value = false; }

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [turmaResponse, alunosResponse] = await Promise.all([
      api.get(`/turmas/${turmaId.value}`),
      api.get(`/turmas/${turmaId.value}/alunos`)
    ]);

    turma.value = turmaResponse.data;
    // --- LINHA CORRIGIDA ---
    // A variável 'alunosResponse' agora está sendo usada corretamente aqui.
    alunosMatriculados.value = alunosResponse.data;
    
  } catch (err) {
    console.error('Erro ao buscar detalhes da turma:', err);
    error.value = 'Não foi possível carregar os detalhes da turma.';
  } finally {
    isLoading.value = false;
  }
}

async function handleMatriculaSave(data) {
  try {
    await api.post(`/turmas/${turmaId.value}/alunos`, { alunoId: data.alunoId });
    closeMatriculaModal();
    alert('Aluno matriculado com sucesso!');
    await fetchData();
  } catch (err) {
    let detailedError = 'Não foi possível matricular o aluno.';
    if (err.response && err.response.data && err.response.data.error) {
      detailedError += `\n\nDetalhe do Erro: ${err.response.data.error.name}`;
    }
    alert(detailedError);
  }
}

async function confirmDeleteMatricula(alunoId, alunoNome) {
  if (confirm(`Você tem certeza que deseja cancelar a matrícula do aluno "${alunoNome}" nesta turma?`)) {
    try {
      await api.delete(`/turmas/${turmaId.value}/alunos/${alunoId}`);
      alert('Matrícula cancelada com sucesso!');
      await fetchData();
    } catch (err) {
      let detailedError = 'Não foi possível cancelar a matrícula.';
      if (err.response && err.response.data && err.response.data.error) {
        detailedError += `\n\nDetalhe do Erro: ${err.response.data.error.name || JSON.stringify(err.response.data.error)}`;
      }
      alert(detailedError);
    }
  }
}

onMounted(fetchData);
</script>

<style scoped>
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.main-header h2 { font-weight: 600; color: #c799df; }
.btn-novo { background-color: #e45da9; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.info-card { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
.info-card h3 { color: #c799df; margin-bottom: 1rem; border-bottom: 1px solid #332f54; padding-bottom: 1rem; }
.info-card p { line-height: 1.8; color: #f0f0f0; }
.table-container { background-color: #1f1c3a; padding: 2rem; border-radius: 12px; }
.table-container h3 { color: #c799df; margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #332f54; }
th { color: #c799df; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
td { color: #f0f0f0; }
.acoes { display: flex; gap: 10px; }
.btn-acao { background: none; border: 1px solid #332f54; color: #c799df; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-acao.excluir:hover { background-color: #ff5c5c; color: #fff; }
.status-message, .content-placeholder { text-align: center; padding: 2rem; color: #c799df; background-color: #1f1c3a; border-radius: 12px; }
.content-placeholder.error { color: #ff5c5c; }
</style>