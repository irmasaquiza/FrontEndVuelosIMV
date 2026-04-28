<template>
  <div class="success-shell d-flex align-items-center justify-content-center">
    <div class="container py-5 text-center">
      
      <div class="card border-0 shadow-lg rounded-5 overflow-hidden mx-auto" style="max-width: 500px;">
        <div class="bg-success text-white py-5" style="background: linear-gradient(135deg, #198754, #146c43);">
          <div class="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 80px; height: 80px;">
            <i class="bi bi-check-lg text-success" style="font-size: 3rem;"></i>
          </div>
          <h2 class="fw-bold h3 mb-0">¡Reserva Exitosa!</h2>
        </div>
        
        <div class="card-body p-5">
          <p class="text-muted mb-4">Tu vuelo ha sido reservado y los asientos están garantizados. Hemos enviado los detalles a tu correo electrónico.</p>
          
          <div v-if="codigoReserva" class="bg-light rounded-4 p-4 mb-4 border">
            <span class="text-uppercase small fw-bold text-muted d-block mb-1">Código de Reserva</span>
            <span class="fw-bold fs-2 text-dark" style="letter-spacing: 2px;">{{ codigoReserva }}</span>
          </div>

          <div class="d-grid gap-3">
            <button class="btn btn-danger btn-lg fw-bold rounded-pill shadow-sm py-3" @click="$router.push('/dashboard')">
              Volver a Inicio
            </button>
            <button class="btn btn-outline-secondary fw-bold rounded-pill py-3" @click="verMisReservas">
              Ver mis reservas
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const codigoReserva = route.query.codigo || route.params.id

const verMisReservas = () => {
  router.push('/dashboard/mis-viajes')
}
</script>

<style scoped>
.success-shell {
  min-height: 100vh;
  background-color: #f8f9fa;
  background-image: radial-gradient(circle at center, #ffffff 0%, #f8f9fa 100%);
}
</style>
