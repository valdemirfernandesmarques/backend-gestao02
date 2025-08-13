<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <h3>Matricular Aluno na Turma</h3>
        <button class="close-button" @click="close">&times;</button>
      </header>
      <form @submit.prevent="save">
        <div class="modal-body">
          <div class="form-group">
            <label for="aluno">Selecione o Aluno</label>
            <select id="aluno" v-model="alunoIdSelecionado" required>
              <option disabled value="">
                {{ alunosDisponiveis.length > 0 ? 'Selecione um aluno' : 'Nenhum aluno disponível para matrícula' }}
              </option>
              <option v-for="aluno in alunosDisponiveis" :key="aluno.id" :value="aluno.id">
                {{ aluno.nomeCompleto }} (CPF: {{ aluno.cpf || 'Não informado' }})
              </option>
            </select>
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn-cancelar" @click="close">Cancelar</button>
          <button type="submit" class="btn-salvar" :disabled="alunosDisponiveis.length === 0">Confirmar Matrícula</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import api from '@/api'; // MUDANÇA

const props = defineProps({
  visible: Boolean,
  alunosJaMatriculados: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['close', 'save']);
const todosOsAlunos = ref([]);
const alunoIdSelecionado = ref('');
const alunosDisponiveis = computed(() => {
  const idsMatriculados = props.alunosJaMatriculados.map(aluno => aluno.id);
  return todosOsAlunos.value.filter(aluno => !idsMatriculados.includes(aluno.id));
});

async function fetchAlunos() {
  try {
    const response = await api.get('/alunos'); // MUDANÇA
    todosOsAlunos.value = response.data;
  } catch (error) { console.error('Erro ao buscar a lista de alunos:', error); }
}
watch(() => props.visible, (newValue) => {
  if (newValue) {
    alunoIdSelecionado.value = '';
    fetchAlunos();
  }
});
function close() { emit('close'); }
function save() {
  if (!alunoIdSelecionado.value) {
    alert('Por favor, selecione um aluno.');
    return;
  }
  emit('save', { alunoId: alunoIdSelecionado.value });
}
</script>

<style scoped>
/* Estilos são 100% reutilizados */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background-color: #1f1c3a; color: #f0f0f0; border-radius: 12px; width: 90%; max-width: 500px; display: flex; flex-direction: column; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #332f54; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-weight: 600; color: #c799df; }
.close-button { background: none; border: none; font-size: 2rem; color: #c799df; cursor: pointer; }
.modal-body { padding: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
.form-group select { background-color: #181529; border: 1px solid #332f54; color: #f0f0f0; padding: 0.7rem; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 1rem; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #332f54; display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancelar, .btn-salvar { border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.btn-cancelar { background-color: #332f54; color: #c799df; }
.btn-salvar { background-color: #e45da9; color: white; }
.btn-salvar:disabled { background-color: #555; cursor: not-allowed; }
</style>