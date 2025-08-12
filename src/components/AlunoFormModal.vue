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
            <label for="dataNascimento">Data de Nascimento</label>
            <input id="dataNascimento" type="date" v-model="formData.dataNascimento" required>
          </div>
          <div class="form-group">
            <label for="cpf">CPF</label>
            <input id="cpf" type="text" v-model="formData.cpf">
          </div>
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input id="telefone" type="text" v-model="formData.telefone" required>
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

// MUDANÇA: Definimos as 'props' que o componente pai (AlunosView) pode nos enviar.
const props = defineProps({
  visible: Boolean, // Controla se o modal está visível
  title: String,    // O título a ser exibido (ex: "Cadastrar" ou "Editar")
  initialData: Object // Os dados do aluno para preencher o formulário no modo de edição
});

const emit = defineEmits(['close', 'save']);

// MUDANÇA: Renomeamos 'aluno' para 'formData' para ficar mais claro
const formData = ref({});

// MUDANÇA: Usamos um 'watch' para observar mudanças nas props.
// Isso é essencial para preencher o formulário quando o modal abre para edição.
watch(() => props.visible, (newValue) => {
  if (newValue) {
    // Se o modal está abrindo E recebemos dados iniciais, preenchemos o formulário
    if (props.initialData) {
      // O slice() na data é para formatar 'YYYY-MM-DD' corretamente para o input type="date"
      formData.value = { 
        ...props.initialData,
        dataNascimento: props.initialData.dataNascimento ? props.initialData.dataNascimento.slice(0, 10) : ''
      };
    } else {
      // Se não recebemos dados, limpamos o formulário para um novo cadastro
      formData.value = {
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        cpf: '',
        telefone: ''
      };
    }
  }
});

function close() {
  emit('close');
}

function save() {
  // Ao salvar, enviamos os dados atuais do formulário para o componente pai
  emit('save', formData.value);
}
</script>

<style scoped>
/* Nenhum estilo precisa ser alterado aqui */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-container { background-color: #1f1c3a; color: #f0f0f0; border-radius: 12px; width: 90%; max-width: 600px; display: flex; flex-direction: column; }
.modal-header { padding: 1.5rem; border-bottom: 1px solid #332f54; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-weight: 600; color: #c799df; }
.close-button { background: none; border: none; font-size: 2rem; color: #c799df; cursor: pointer; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600; }
.form-group input { background-color: #181529; border: 1px solid #332f54; color: #f0f0f0; padding: 0.7rem; border-radius: 8px; font-family: 'Poppins', sans-serif; }
.modal-footer { padding: 1.5rem; border-top: 1px solid #332f54; display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancelar, .btn-salvar { border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background-color 0.3s; }
.btn-cancelar { background-color: #332f54; color: #c799df; }
.btn-salvar { background-color: #e45da9; color: white; }
</style>