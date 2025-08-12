<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </header>
      <form @submit.prevent="save">
        <div class="modal-body">
          <div class="form-group">
            <label for="nome">Nome Completo</label>
            <input id="nome" type="text" v-model="formData.nomeCompleto" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" v-model="formData.email" required>
          </div>
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input id="telefone" type="text" v-model="formData.telefone" required>
          </div>
          <div class="form-group">
            <label for="regimeContratacao">Regime de Contratação</label>
            <select id="regimeContratacao" v-model="formData.regimeContratacao" required>
              <option disabled value="">Selecione um regime</option>
              <option>CLT</option>
              <option>Autônomo</option>
              <option>Comissão</option>
              <option>Freelancer</option>
            </select>
          </div>
           <div class="form-group">
            <label for="valorPagamento">Valor Pagamento (Salário/Hora)</label>
            <input id="valorPagamento" type="number" step="0.01" v-model="formData.valorPagamento" required>
          </div>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn-cancelar" @click="close">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  title: String,
  initialData: Object
});

const emit = defineEmits(['close', 'save']);

const formData = ref({});

watch(() => props.visible, (newValue) => {
  if (newValue) {
    if (props.initialData) {
      formData.value = { ...props.initialData };
    } else {
      formData.value = {
        nomeCompleto: '',
        email: '',
        telefone: '',
        regimeContratacao: '',
        valorPagamento: 0
      };
    }
  }
});

function close() {
  emit('close');
}

function save() {
  emit('save', formData.value);
}
</script>

<style scoped>
/* Os estilos do modal são os mesmos do AlunoFormModal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background-color: #1f1c3a; color: #f0f0f0; border-radius: 12px; width: 90%; max-width: 600px; display: flex; flex-direction: column; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #332f54; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-weight: 600; color: #c799df; }
.close-button { background: none; border: none; font-size: 2rem; color: #c799df; cursor: pointer; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
.form-group input, .form-group select { background-color: #181529; border: 1px solid #332f54; color: #f0f0f0; padding: 0.7rem; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 1rem; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #332f54; display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancelar, .btn-salvar { border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.btn-cancelar { background-color: #332f54; color: #c799df; }
.btn-salvar { background-color: #e45da9; color: white; }
</style>