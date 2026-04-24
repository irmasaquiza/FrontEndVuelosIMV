import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import AdminIndexView from '../views/Administrador/AdminIndexView.vue'
import PaisesGestionView from '../views/Administrador/PaisesGestionView.vue'
import CiudadesGestionView from '../views/Administrador/CiudadesGestionView.vue'
import AeropuertosGestionView from '../views/Administrador/AeropuertosGestionView.vue'
import VuelosGestionView from '../views/Administrador/VuelosGestionView.vue'
import AsientosGestionView from '../views/Administrador/AsientosGestionView.vue'
import ClientesGestionView from '../views/Administrador/ClientesGestionView.vue'
import PasajerosGestionView from '../views/Administrador/PasajerosGestionView.vue'
import ReservasGestionView from '../views/Administrador/ReservasGestionView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/home', component: HomeView },
  { path: '/admin', component: AdminIndexView },
  { path: '/admin/paises', component: PaisesGestionView },
  { path: '/admin/ciudades', component: CiudadesGestionView },
  { path: '/admin/aeropuertos', component: AeropuertosGestionView },
  { path: '/admin/vuelos', component: VuelosGestionView },
  { path: '/admin/asientos', component: AsientosGestionView },
  { path: '/admin/clientes', component: ClientesGestionView },
  { path: '/admin/pasajeros', component: PasajerosGestionView },
  { path: '/admin/reservas', component: ReservasGestionView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path !== '/' && !token) {
    next('/')
    return
  }

  next()
})

export default router
