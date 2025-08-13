import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- Importa nosso router

createApp(App)
  .use(router) // <-- Diz ao Vue para usar o router
  .mount('#app')