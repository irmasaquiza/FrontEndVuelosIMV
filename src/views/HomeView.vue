<template>
  <section class="container-fluid p-4">

    <!-- Hero -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity: 0.65; letter-spacing: 2px;">Panel principal</p>
        <h1 class="fw-bold mb-2">Bienvenido a NachoFlight</h1>
        <p class="mb-0" style="opacity: 0.75;">Desde aquí puedes administrar todos los módulos del sistema.</p>
      </div>
      <button class="btn btn-outline-light fw-bold flex-shrink-0" @click="logout">
        Cerrar sesión
      </button>
    </div>

    <!-- Cards -->
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <p class="text-uppercase fw-bold small mb-0" style="color: #d60f2b; letter-spacing: 1.5px;">Primer módulo</p>
            <h2 class="h5 fw-bold mb-0">Administración de catálogos</h2>
            <p class="text-muted mb-0">
              Gestiona países, ciudades y aeropuertos de forma rápida y sencilla.
            </p>
            <router-link class="btn fw-bold rounded-pill mt-2 align-self-start px-4 text-white"
                         style="background: #d60f2b;"
                         to="/admin">
              Abrir módulo
            </router-link>
          </div>
        </article>
      </div>

      <div class="col-12 col-md-6">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <p class="text-uppercase fw-bold small mb-0" style="color: #d60f2b; letter-spacing: 1.5px;">Estado actual</p>
            <h2 class="h5 fw-bold mb-0">Sesión activa</h2>
            <p class="text-muted mb-0">
              Tu sesión está activa y protegida. Ciérrala cuando termines de usar el sistema.
            </p>
          </div>
        </article>
      </div>
    </div>

  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>