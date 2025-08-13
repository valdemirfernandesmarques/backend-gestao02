<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </header>
      <form @submit.prevent="save">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="valor">Valor (R$)</label>
              <input id="valor" type="number" step="0.01" v-model="formData.valor" required>
            </div>
            <div class="form-group">
              <label for="dataPagamento">Data do Pagamento</label>
              <input id="dataPagamento" type="date" v-model="formData.dataPagamento" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="formData.status" required>
                <option>Pendente</option>
                <option>Pago</option>
                <option>Atrasado</option>
                <option>Cancelado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="metodoPagamento">Método de Pagamento</label>
              <select id="metodoPagamento" v-model="formData.metodoPagamento">
                <option value="">N/A</option>
                <option>Dinheiro</option>
                <option>Pix</option>
                <option>Cartão</option>
                <option>Boleto</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label for="turma">Turma Associada (Opcional)</label>
              <select id="turma" v-model="formData.turmaId">
                <option :value="null">Pagamento Geral (sem turma)</option>
                <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
                  {{ turma.nome }} - {{ turma.Modalidade?.nome }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn-cancelar" @click="close">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar Pagamento</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
// MUDANÇA: 'onMounted' foi removido daqui, pois não estava sendo usado.
import { ref, watch } from 'vue';
import api from '@/api';

const props = defineProps({
  visible: Boolean,
  title: String,
  initialData: Object
});

const emit = defineEmits(['close', 'save']);
const formData = ref({});
const turmas = ref([]);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
};

// Busca a lista de turmas para preencher o dropdown
async function fetchTurmas() {
  try {
    const response = await api.get('/turmas');
    turmas.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
  }
}

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchTurmas(); // Busca as turmas sempre que o modal abrir
    if (props.initialData) {
      formData.value = { 
        ...props.initialData,
        dataPagamento: formatDate(props.initialData.dataPagamento)
      };
    } else {
      formData.value = {
        valor: '',
        dataPagamento: formatDate(new Date()), // Sugere a data de hoje
        status: 'Pendente',
        metodoPagamento: '',
        turmaId: null
      };
    }
  }
});

function close() { emit('close'); }
function save() { emit('save', formData.value); }
</script>

<style scoped>
/* O CSS continua o mesmo */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { width: 90%; max-width: 600px; background-color: #1e1e2f; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
.modal-header { padding: 1rem 2rem; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { color: #ff69b4; font-weight: bold; }
.close-button { background: none; border: none; font-size: 2.5rem; line-height: 1; color: #aaa; cursor: pointer; transition: color 0.2s; }
.close-button:hover { color: #fff; }
form { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.modal-body { padding: 30px; }
.form-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 15px; }
.form-group { flex: 1; display: flex; flex-direction: column; min-width: calc(50% - 10px); }
.form-group.full-width { min-width: 100%; }
.form-group label { margin-bottom: 8px; color: #f0f0f0; }
.form-group input, .form-group select { padding: 10px; border: 1px solid #333; background-color: #2a2a40; color: #fff; border-radius: 5px; font-size: 1rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding: 20px 30px; border-top: 1px solid #444; }
.btn-cancelar, .btn-salvar { padding: 10px 20px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; }
.btn-cancelar { background-color: #444; color: #fff; }
.btn-salvar { background-color: #ff69b4; color: #fff; }
</style>