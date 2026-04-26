<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity: 0.65; letter-spacing: 2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Módulo de administración</h1>
        <p class="mb-0" style="opacity: 0.75;">
          Escoge la gestión que quieres trabajar y entra directo al mantenimiento correspondiente.
        </p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/home">Volver al inicio</router-link>
        <button class="btn btn-outline-light fw-bold" @click="logout">Cerrar sesión</button>
      </div>
    </div>

    <!-- Grid de módulos -->
    <div class="row g-3">

      <!-- Países -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Consulta</p>
            <h2 class="h6 fw-bold mb-0">Gestión de países</h2>
            <p class="text-muted small mb-0">Revisa el catálogo de países y aplica filtros por continente o estado.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/paises">
              Ir a países
            </router-link>
          </div>
        </article>
      </div>

      <!-- Ciudades -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">CRUD</p>
            <h2 class="h6 fw-bold mb-0">Gestión de ciudades</h2>
            <p class="text-muted small mb-0">Crea, actualiza y elimina ciudades relacionándolas con su país.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/ciudades">
              Ir a ciudades
            </router-link>
          </div>
        </article>
      </div>

      <!-- Aeropuertos -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">CRUD</p>
            <h2 class="h6 fw-bold mb-0">Gestión de aeropuertos</h2>
            <p class="text-muted small mb-0">Administra aeropuertos con sus códigos, ubicación y filtros por país y ciudad.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/aeropuertos">
              Ir a aeropuertos
            </router-link>
          </div>
        </article>
      </div>

      <!-- Vuelos -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm" style="border-left: 4px solid #d60f2b !important;">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.21v-1.895l-8.5-4.935V3.7A1.7 1.7 0 0 0 11.8 2a1.7 1.7 0 0 0-1.7 1.7v5.68L1.6 14.315v1.895l8.5-2.45v5.68l-2 1.41V22l3.7-1 3.7 1v-1.15l-2-1.41v-5.68l8.5 2.45z" fill="#d60f2b"/>
                <circle cx="19" cy="6" r="3" fill="#a00824"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Operaciones</p>
            <h2 class="h6 fw-bold mb-0">Gestión de vuelos y escalas</h2>
            <p class="text-muted small mb-0">Programa vuelos, define origen y destino, y agrega escalas por aeropuertos intermedios.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/vuelos">
              Ir a vuelos
            </router-link>
          </div>
        </article>
      </div>

      <!-- Asientos -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Cabina</p>
            <h2 class="h6 fw-bold mb-0">Gestión de asientos</h2>
            <p class="text-muted small mb-0">Selecciona un vuelo, crea asientos por clase y controla su disponibilidad.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/asientos">
              Ir a asientos
            </router-link>
          </div>
        </article>
      </div>

      <!-- Clientes -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">CRM</p>
            <h2 class="h6 fw-bold mb-0">Gestión de clientes</h2>
            <p class="text-muted small mb-0">Registra clientes, actualiza sus datos y controla su estado en el sistema.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/clientes">
              Ir a clientes
            </router-link>
          </div>
        </article>
      </div>

      <!-- Pasajeros -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#d60f2b"/>
                <path d="M19 3h-1.5v1.5h1.5V6h1.5V4.5H22V3h-1.5V1.5H19V3z" fill="#a00824"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Ventas</p>
            <h2 class="h6 fw-bold mb-0">Gestión de pasajeros</h2>
            <p class="text-muted small mb-0">Registra pasajeros y administra sus datos de viaje.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/pasajeros">
              Ir a pasajeros
            </router-link>
          </div>
        </article>
      </div>

      <!-- Reservas -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm" style="border-left: 4px solid #d60f2b !important;">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Ventas</p>
            <h2 class="h6 fw-bold mb-0">Gestión de reservas</h2>
            <p class="text-muted small mb-0">Crea reservas uniendo cliente, pasajero, vuelo y asiento, y controla su estado.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/reservas">
              Ir a reservas
            </router-link>
          </div>
        </article>
      </div>

      <!-- Facturas -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Finanzas</p>
            <h2 class="h6 fw-bold mb-0">Gestión de facturas</h2>
            <p class="text-muted small mb-0">Emite facturas para reservas y controla su estado de apertura o anulación.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/facturas">
              Ir a facturas
            </router-link>
          </div>
        </article>
      </div>

      <!-- Boletos -->
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="card h-100 border-0 shadow-sm" style="border-left: 4px solid #d60f2b !important;">
          <div class="card-body d-flex flex-column gap-2 p-4">
            <div class="rounded-3 d-flex align-items-center justify-content-center mb-1"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46A4.01 4.01 0 0 0 18 12c0 1.48.81 2.77 2 3.46V18H4v-2.54A4.01 4.01 0 0 0 6 12c0-1.48-.81-2.77-2-3.46V6h16v2.54z" fill="#d60f2b"/>
              </svg>
            </div>
            <p class="text-uppercase fw-bold small mb-0" style="color:#d60f2b;letter-spacing:1.5px;">Ventas</p>
            <h2 class="h6 fw-bold mb-0">Gestión de boletos</h2>
            <p class="text-muted small mb-0">Emite boletos a partir de reservas, enlazando vuelo y asiento.</p>
            <router-link class="btn fw-bold rounded-pill mt-auto align-self-start px-4 text-white"
                         style="background:#d60f2b;" to="/admin/boletos">
              Ir a boletos
            </router-link>
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