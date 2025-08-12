import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import AppLayout from '../views/AppLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import AlunosView from '../views/AlunosView.vue';
import AlunoDetalhes from '../views/AlunoDetalhes.vue'; // <-- 1. Importamos a nova view
import ProfessoresView from '../views/ProfessoresView.vue';
import ModalidadesView from '../views/ModalidadesView.vue';
import TurmasView from '../views/TurmasView.vue';
import TurmaDetalhes from '../views/TurmaDetalhes.vue';
import FuncionariosView from '../views/FuncionariosView.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginForm },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true }, 
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'alunos', name: 'Alunos', component: AlunosView },
      // --- 2. NOVA ROTA DINÂMICA ADICIONADA AQUI ---
      { path: 'alunos/:id', name: 'AlunoDetalhes', component: AlunoDetalhes },
      { path: 'professores', name: 'Professores', component: ProfessoresView },
      { path: 'modalidades', name: 'Modalidades', component: ModalidadesView },
      { path: 'turmas', name: 'Turmas', component: TurmasView },
      { path: 'turmas/:id', name: 'TurmaDetalhes', component: TurmaDetalhes },
      { path: 'funcionarios', name: 'Funcionarios', component: FuncionariosView },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// A função de guarda de rota (beforeEach) continua a mesma
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('user-token');
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;