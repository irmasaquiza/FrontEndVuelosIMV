import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RegisterClientView from '../views/login/RegisterClientView.vue'
import DashboardClientView from '../views/Cliente/DashboardClientView.vue'
import MisViajesView from '../views/Cliente/MisViajesView.vue'
import FlightSelectionView from '../views/Cliente/booking/FlightSelectionView.vue'
import SeatSelectionView from '../views/Cliente/booking/SeatSelectionView.vue'
import PassengerFormView from '../views/Cliente/booking/PassengerFormView.vue'
import ReservationSuccessView from '../views/Cliente/booking/ReservationSuccessView.vue'
import AdminIndexView from '../views/Administrador/inicio/AdminIndexView.vue'
import PaisesGestionView from '../views/Administrador/paises/PaisesGestionView.vue'
import CiudadesGestionView from '../views/Administrador/ciudades/CiudadesGestionView.vue'
import AeropuertosGestionView from '../views/Administrador/aeropuertos/AeropuertosGestionView.vue'
import VuelosGestionView from '../views/Administrador/vuelos/VuelosGestionView.vue'
import AsientosGestionView from '../views/Administrador/asientos/AsientosGestionView.vue'
import ClientesGestionView from '../views/Administrador/clientes/ClientesGestionView.vue'
import PasajerosGestionView from '../views/Administrador/pasajeros/PasajerosGestionView.vue'
import ReservasGestionView from '../views/Administrador/reservas/ReservasGestionView.vue'
import FacturasGestionView from '../views/Administrador/facturas/FacturasGestionView.vue'
import BoletosGestionView from '../views/Administrador/boletos/BoletosGestionView.vue'

const routes = [
  { path: '/', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', component: RegisterClientView, meta: { guestOnly: true } },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/dashboard', component: DashboardClientView, meta: { requiresAuth: true } },
  { path: '/dashboard/mis-viajes', component: MisViajesView, meta: { requiresAuth: true } },
  { path: '/dashboard/vuelos', component: FlightSelectionView, meta: { requiresAuth: true } },
  { path: '/dashboard/vuelos/:id/asientos', component: SeatSelectionView, meta: { requiresAuth: true } },
  { path: '/dashboard/vuelos/:id/pasajero', component: PassengerFormView, meta: { requiresAuth: true } },
  { path: '/dashboard/vuelos/reserva-exitosa/:id', component: ReservationSuccessView, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminIndexView, meta: { requiresAuth: true } },
  { path: '/admin/paises', component: PaisesGestionView, meta: { requiresAuth: true } },
  { path: '/admin/ciudades', component: CiudadesGestionView, meta: { requiresAuth: true } },
  { path: '/admin/aeropuertos', component: AeropuertosGestionView, meta: { requiresAuth: true } },
  { path: '/admin/vuelos', component: VuelosGestionView, meta: { requiresAuth: true } },
  { path: '/admin/asientos', component: AsientosGestionView, meta: { requiresAuth: true } },
  { path: '/admin/clientes', component: ClientesGestionView, meta: { requiresAuth: true } },
  { path: '/admin/pasajeros', component: PasajerosGestionView, meta: { requiresAuth: true } },
  { path: '/admin/reservas', component: ReservasGestionView, meta: { requiresAuth: true } },
  { path: '/admin/facturas', component: FacturasGestionView, meta: { requiresAuth: true } },
  { path: '/admin/boletos', component: BoletosGestionView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
    return
  }

  next()
})

export default router
