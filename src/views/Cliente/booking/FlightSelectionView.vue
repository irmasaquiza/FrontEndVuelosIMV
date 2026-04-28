<template>
  <div class="flight-selection-shell">
    
    <!-- Navbar / Header (Simplified) -->
    <header class="client-header-solid d-flex justify-content-between align-items-center p-3 shadow-sm">
      <div class="login-logo text-dark">
        <div class="login-logo-icon bg-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ffffff"/>
          </svg>
        </div>
        <span class="fw-bold fs-5 ms-2" style="color: #d60f2b;">NachoFlight</span>
      </div>
      <div>
        <router-link to="/dashboard" class="btn btn-outline-danger fw-bold rounded-pill px-4">Volver al Buscador</router-link>
      </div>
    </header>

    <div class="container py-5">
      <!-- Resumen de búsqueda -->
      <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 class="fw-bold mb-1 h3">Selecciona tu vuelo de Ida</h2>
          <p class="text-muted mb-0">
            <i class="bi bi-geo-alt-fill text-danger me-1"></i> Origen (ID: {{ queryParams.origen }}) 
            <i class="bi bi-arrow-right mx-2"></i> 
            <i class="bi bi-geo-fill text-danger me-1"></i> Destino (ID: {{ queryParams.destino }})
            <span class="ms-3 badge bg-light text-dark border"><i class="bi bi-calendar-event me-1"></i> {{ queryParams.fechaIda }}</span>
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Buscando vuelos...</span>
        </div>
        <p class="mt-3 text-muted fw-bold">Buscando las mejores opciones para ti...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="alert alert-warning shadow-sm border-0 d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill fs-4 me-3 text-warning"></i>
        <div>
          <h5 class="alert-heading fw-bold mb-1">Ups, no encontramos vuelos</h5>
          <p class="mb-0">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Results List -->
      <div v-else class="row g-4">
        <div v-for="vuelo in vuelos" :key="vuelo.idVuelo" class="col-12">
          <div class="card flight-card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="row g-0 align-items-center">
              
              <!-- Flight Info -->
              <div class="col-md-9 p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-danger-subtle text-danger fw-bold px-3 py-2 rounded-pill">Vuelo Directo</span>
                  <span class="text-muted small fw-bold">Vuelo #{{ vuelo.numeroVuelo }}</span>
                </div>
                
                <div class="row align-items-center text-center">
                  <div class="col-4">
                    <h3 class="fw-bold mb-0 text-dark">{{ formatTime(vuelo.fechaHoraSalida) }}</h3>
                    <p class="text-muted small mb-0">{{ formatDate(vuelo.fechaHoraSalida) }}</p>
                  </div>
                  <div class="col-4 position-relative">
                    <div class="flight-line"></div>
                    <i class="bi bi-airplane-fill fs-4 text-danger position-relative bg-white px-2 z-1"></i>
                  </div>
                  <div class="col-4">
                    <h3 class="fw-bold mb-0 text-dark">{{ formatTime(vuelo.fechaHoraLlegada) }}</h3>
                    <p class="text-muted small mb-0">{{ formatDate(vuelo.fechaHoraLlegada) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Pricing & Action -->
              <div class="col-md-3 bg-light p-4 h-100 d-flex flex-column justify-content-center align-items-center border-start">
                <p class="text-muted small text-uppercase fw-bold mb-1">Precio desde</p>
                <h2 class="fw-bold text-dark mb-1">${{ vuelo.precioBase }}</h2>
                <p class="small text-muted mb-3">Asientos disp: <span class="fw-bold text-success">{{ vuelo.capacidadDisponible }}</span></p>
                <button @click="seleccionarVuelo(vuelo)" class="btn btn-danger w-100 fw-bold rounded-pill shadow-sm">
                  Seleccionar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchVuelos } from '../../../services/clientService'

const route = useRoute()
const router = useRouter()
const queryParams = route.query

const vuelos = ref([])
const loading = ref(true)
const errorMessage = ref('')

const fetchVuelos = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    // Aquí pasamos los filtros a la API. Ajustar según los nombres de parámetros que espere el backend.
    const filters = {
      id_aeropuerto_origen: queryParams.origen,
      id_aeropuerto_destino: queryParams.destino
      // fecha: queryParams.fechaIda (Opcional, si el backend soporta filtro por fecha)
    }

    const { data } = await searchVuelos() // No pasamos filtros, traemos todos y filtramos local
    
    let resultados = Array.isArray(data) ? data : []
    
    // Filtrar localmente asegurando compatibilidad de tipos (String vs Number)
    resultados = resultados.filter(v => {
      // Filtrar por origen
      if (queryParams.origen && String(v.idAeropuertoOrigen) !== String(queryParams.origen)) return false;
      
      // Filtrar por destino
      if (queryParams.destino && String(v.idAeropuertoDestino) !== String(queryParams.destino)) return false;
      
      // Filtrar por fecha de ida (ignorando la hora)
      if (queryParams.fechaIda) {
        if (!v.fechaHoraSalida) return false;
        // Extraemos 'YYYY-MM-DD' de 'YYYY-MM-DDTHH:MM:SS'
        const flightDate = v.fechaHoraSalida.split('T')[0];
        if (flightDate !== queryParams.fechaIda) return false;
      }
      
      return true;
    })

    vuelos.value = resultados

    if (vuelos.value.length === 0) {
      errorMessage.value = 'No encontramos vuelos programados para la fecha y ruta seleccionada.'
    }

  } catch (error) {
    console.error("Error buscando vuelos:", error)
    errorMessage.value = 'Ocurrió un error al buscar los vuelos. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

const formatTime = (dateString) => {
  if (!dateString) return '--:--'
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString([], { day: '2-digit', month: 'short' })
}

const seleccionarVuelo = (vuelo) => {
  router.push({ path: `/dashboard/vuelos/${vuelo.idVuelo}/asientos`, query: { ...queryParams, numeroVuelo: vuelo.numeroVuelo } })
}

onMounted(() => {
  fetchVuelos()
})
</script>

<style scoped>
.flight-selection-shell {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.client-header-solid {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.login-logo {
  display: flex;
  align-items: center;
}

.login-logo-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.flight-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #f0f0f0 !important;
}

.flight-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
}

.flight-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: repeating-linear-gradient(to right, #ccc 0, #ccc 5px, transparent 5px, transparent 10px);
  z-index: 0;
}

.bg-danger-subtle {
  background-color: #fce8eb !important;
}
</style>
