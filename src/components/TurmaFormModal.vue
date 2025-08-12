<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </header>
      <form @submit.prevent="save">
        <div class="modal-body">
          <div class="form-column">
            <div class="form-group">
              <label for="nome">Nome da Turma (Ex: Infantil A)</label>
              <input id="nome" type="text" v-model="formData.nome" required>
            </div>
            <div class="form-group">
              <label for="modalidade">Modalidade</label>
              <select id="modalidade" v-model="formData.modalidadeId" required>
                <option disabled value="">Selecione a modalidade</option>
                <option v-for="mod in modalidades" :key="mod.id" :value="mod.id">{{ mod.nome }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="professor">Professor</label>
              <select id="professor" v-model="formData.professorId" required>
                <option disabled value="">Selecione o professor</option>
                <option v-for="prof in professores" :key="prof.id" :value="prof.id">{{ prof.nomeCompleto }}</option>
              </select>
            </div>
             <div class="form-group">
              <label for="maxAlunos">Máximo de Alunos</label>
              <input id="maxAlunos" type="number" v-model="formData.maxAlunos">
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="diaDaSemana">Dia da Semana</label>
              <select id="diaDaSemana" v-model="formData.diaDaSemana" required>
                <option disabled value="">Selecione o dia</option>
                <option>Segunda-feira</option>
                <option>Terça-feira</option>
                <option>Quarta-feira</option>
                <option>Quinta-feira</option>
                <option>Sexta-feira</option>
                <option>Sábado</option>
                <option>Domingo</option>
              </select>
            </div>
            <div class="form-group">
              <label for="horarioInicio">Horário de Início</label>
              <input id="horarioInicio" type="time" v-model="formData.horarioInicio" required>
            </div>
            <div class="form-group">
              <label for="horarioFim">Horário de Fim</label>
              <input id="horarioFim" type="time" v-model="formData.horarioFim" required>
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn-cancelar" @click="close">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar Turma</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/api'; // MUDANÇA

const props = defineProps({
  visible: Boolean,
  title: String,
  initialData: Object
});
const emit = defineEmits(['close', 'save']);
const formData = ref({});
const modalidades = ref([]);
const professores = ref([]);

async function fetchDataForDropdowns() {
  try {
    // MUDANÇA: Usamos Promise.all com 'api'
    const [modalidadesResponse, professoresResponse] = await Promise.all([
      api.get('/modalidades'),
      api.get('/professores')
    ]);
    modalidades.value = modalidadesResponse.data;
    professores.value = professoresResponse.data;
  } catch (error) { console.error('Erro ao buscar dados para os formulários:', error); }
}

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchDataForDropdowns();
    if (props.initialData) {
      formData.value = { ...props.initialData };
    } else {
      formData.value = { nome: '', modalidadeId: '', professorId: '', maxAlunos: 10, diaDaSemana: '', horarioInicio: '', horarioFim: '' };
    }
  }
});
function close() { emit('close'); }
function save() { emit('save', formData.value); }
</script>

<style scoped>
/* Estilos são 100% reutilizados */
.modal-body { display: flex; gap: 2rem; padding: 1.5rem; }
.form-column { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background-color: #1f1c3a; color: #f0f0f0; border-radius: 12px; width: 90%; max-width: 700px; display: flex; flex-direction: column; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #332f54; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-weight: 600; color: #c799df; }
.close-button { background: none; border: none; font-size: 2rem; color: #c799df; cursor: pointer; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
.form-group input, .form-group select { background-color: #181529; border: 1px solid #332f54; color: #f0f0f0; padding: 0.7rem; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 1rem; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #332f54; display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancelar, .btn-salvar { border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.btn-cancelar { background-color: #332f54; color: #c799df; }
.btn-salvar { background-color: #e45da9; color: white; }
</style>