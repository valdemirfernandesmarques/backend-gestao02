<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </header>
      <form @submit.prevent="save">
        <div class="modal-body">
          <fieldset>
            <legend>1. Informações Pessoais</legend>
            <div class="form-row">
              <div class="form-group full-width">
                <label for="nomeCompleto">Nome Completo</label>
                <input id="nomeCompleto" type="text" v-model="formData.nomeCompleto" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="nomeSocial">Nome Social</label>
                <input id="nomeSocial" type="text" v-model="formData.nomeSocial">
              </div>
              <div class="form-group">
                <label for="dataNascimento">Data de Nascimento</label>
                <input id="dataNascimento" type="date" v-model="formData.dataNascimento">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="nacionalidade">Nacionalidade</label>
                <input id="nacionalidade" type="text" v-model="formData.nacionalidade">
              </div>
              <div class="form-group">
                <label for="naturalidade">Naturalidade</label>
                <input id="naturalidade" type="text" v-model="formData.naturalidade">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="estadoCivil">Estado Civil</label>
                <input id="estadoCivil" type="text" v-model="formData.estadoCivil">
              </div>
              <div class="form-group">
                <label for="genero">Gênero</label>
                <input id="genero" type="text" v-model="formData.genero">
              </div>
            </div>
             <div class="form-row">
              <div class="form-group">
                <label for="cpf">CPF</label>
                <input id="cpf" type="text" v-model="formData.cpf">
              </div>
              <div class="form-group">
                <label for="rg">RG</label>
                <input id="rg" type="text" v-model="formData.rg">
              </div>
            </div>
            <div class="form-row">
               <div class="form-group">
                <label for="nomeMae">Nome da Mãe</label>
                <input id="nomeMae" type="text" v-model="formData.nomeMae">
              </div>
            </div>
             <div class="form-row">
              <div class="form-group">
                <label for="nomePai">Nome do Pai</label>
                <input id="nomePai" type="text" v-model="formData.nomePai">
              </div>
            </div>
          </fieldset>
          
          <fieldset>
            <legend>2. Contato</legend>
            <div class="form-row">
              <div class="form-group">
                <label for="telefone">Telefone Celular</label>
                <input id="telefone" type="text" v-model="formData.telefone">
              </div>
              <div class="form-group">
                <label for="email">E-mail Pessoal</label>
                <input id="email" type="email" v-model="formData.email">
              </div>
            </div>
             <div class="form-row">
              <div class="form-group">
                <label for="cep">CEP</label>
                <input id="cep" type="text" v-model="formData.cep">
              </div>
              <div class="form-group">
                <label for="logradouro">Rua / Logradouro</label>
                <input id="logradouro" type="text" v-model="formData.logradouro">
              </div>
            </div>
             <div class="form-row">
               <div class="form-group">
                <label for="numero">Número</label>
                <input id="numero" type="text" v-model="formData.numero">
              </div>
              <div class="form-group">
                <label for="bairro">Bairro</label>
                <input id="bairro" type="text" v-model="formData.bairro">
              </div>
            </div>
             <div class="form-row">
              <div class="form-group">
                <label for="cidade">Cidade</label>
                <input id="cidade" type="text" v-model="formData.cidade">
              </div>
              <div class="form-group">
                <label for="estado">Estado (UF)</label>
                <input id="estado" type="text" v-model="formData.estado">
              </div>
            </div>
          </fieldset>

           <fieldset>
            <legend>3. Informações Profissionais</legend>
             <div class="form-row">
              <div class="form-group">
                <label for="cargo">Cargo</label>
                <input id="cargo" type="text" v-model="formData.cargo">
              </div>
              <div class="form-group">
                <label for="departamento">Departamento/Setor</label>
                <input id="departamento" type="text" v-model="formData.departamento">
              </div>
            </div>
             <div class="form-row">
              <div class="form-group">
                <label for="dataAdmissao">Data de Admissão</label>
                <input id="dataAdmissao" type="date" v-model="formData.dataAdmissao">
              </div>
              <div class="form-group">
                <label for="salario">Salário Base (R$)</label>
                <input id="salario" type="number" step="0.01" v-model="formData.salario">
              </div>
            </div>
          </fieldset>
        </div>
        <footer class="modal-footer">
          <button type="button" class="btn-cancelar" @click="close">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar Funcionário</button>
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
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
};
const emptyForm = {
    nomeCompleto: '', nomeSocial: '', dataNascimento: null, nacionalidade: '', naturalidade: '', estadoCivil: '', genero: '', cpf: '', rg: '', nomeMae: '', nomePai: '',
    telefone: '', email: '', cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '',
    cargo: '', departamento: '', dataAdmissao: null, salario: null, ativo: true
};
watch(() => props.visible, (newValue) => {
  if (newValue) {
    if (props.initialData) {
      formData.value = { 
        ...props.initialData,
        dataNascimento: formatDate(props.initialData.dataNascimento),
        dataAdmissao: formatDate(props.initialData.dataAdmissao),
      };
    } else {
      formData.value = { ...emptyForm };
    }
  }
});
function close() { emit('close'); }
function save() { emit('save', formData.value); }
</script>

<style scoped>
/* ESTE CSS É UMA ADAPTAÇÃO FIEL DO SEU PROTÓTIPO */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-container {
  width: 90%; max-width: 900px; max-height: 90vh;
  background-color: #1e1e2f;
  border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
}
.modal-header {
  padding: 1rem 2rem; border-bottom: 1px solid #444;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { color: #ff69b4; font-weight: bold; font-family: 'Segoe UI', sans-serif; }
.close-button { background: none; border: none; font-size: 2.5rem; line-height: 1; color: #aaa; cursor: pointer; transition: color 0.2s; }
.close-button:hover { color: #fff; }
form { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.modal-body { padding: 30px; flex: 1; overflow-y: auto; }
fieldset { border: 1px solid #444; padding: 20px; margin-bottom: 25px; border-radius: 8px; }
legend { padding: 0 10px; color: #ff69b4; font-weight: bold; font-family: 'Segoe UI', sans-serif; }
.form-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 15px; }
.form-row:last-child { margin-bottom: 0; }
.form-group { flex: 1; display: flex; flex-direction: column; min-width: calc(50% - 10px); }
.form-group.full-width { min-width: 100%; }
.form-group label { margin-bottom: 8px; color: #f0f0f0; font-family: 'Segoe UI', sans-serif; }
.form-group input, .form-group select {
  padding: 10px; border: 1px solid #333; background-color: #2a2a40;
  color: #fff; border-radius: 5px; font-size: 1rem;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 1rem;
  padding: 20px 30px; border-top: 1px solid #444;
}
.btn-cancelar, .btn-salvar {
  padding: 10px 20px; border: none; border-radius: 6px;
  font-size: 16px; cursor: pointer; font-weight: bold; font-family: 'Segoe UI', sans-serif;
}
.btn-cancelar { background-color: #444; color: #fff; }
.btn-salvar { background-color: #ff69b4; color: #fff; }
</style>