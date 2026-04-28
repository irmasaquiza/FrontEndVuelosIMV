<template>
  <div class="seat-selection-shell">
    
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
        <button @click="$router.back()" class="btn btn-outline-secondary fw-bold rounded-pill px-4">Volver</button>
      </div>
    </header>

    <div class="container py-5">
      
      <div class="row">
        <!-- Seat Map Area -->
        <div class="col-lg-8">
          <div v-if="numeroVuelo" class="mb-4">
            <h2 class="fw-bold h3 mb-1">Vuelo #{{ numeroVuelo }}</h2>
            <p class="text-muted mb-0">Selecciona tu asiento para este vuelo.</p>
          </div>
          <div v-else>
            <h2 class="fw-bold h3 mb-2">Selecciona tu Asiento</h2>
            <p class="text-muted mb-4">Haz clic en un asiento disponible para seleccionarlo.</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status">
              <span class="visually-hidden">Cargando mapa de asientos...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="alert alert-danger shadow-sm border-0" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Plane Container -->
          <div v-else class="plane-container bg-white shadow-sm rounded-5 p-4 mx-auto border" style="max-width: 400px;">
            <div class="plane-nose mx-auto mb-4 border-bottom pb-4 text-center">
              <i class="bi bi-compass text-muted fs-3"></i>
              <p class="small text-muted text-uppercase fw-bold mt-2 mb-0">Frente del Avión</p>
            </div>

            <!-- Cabina Primera Clase -->
            <div v-if="asientosPrimera.length > 0" class="cabin-section mb-5">
              <h6 class="text-center text-uppercase fw-bold mb-3" style="color: #d4af37;">Primera Clase</h6>
              <div class="seat-grid primera-grid">
                <button 
                  v-for="asiento in asientosPrimera" 
                  :key="asiento.idAsiento"
                  class="seat btn p-0 rounded-3 shadow-sm"
                  :class="getSeatClasses(asiento)"
                  :disabled="!asiento.disponible"
                  @click="seleccionarAsiento(asiento)"
                  :title="'Asiento ' + asiento.numeroAsiento"
                >
                  <span class="seat-label fw-bold">{{ asiento.numeroAsiento }}</span>
                </button>
              </div>
            </div>

            <!-- Cabina Ejecutiva -->
            <div v-if="asientosEjecutiva.length > 0" class="cabin-section mb-5">
              <h6 class="text-center text-uppercase fw-bold mb-3" style="color: #0d6efd;">Clase Ejecutiva</h6>
              <div class="seat-grid ejecutiva-grid">
                <button 
                  v-for="asiento in asientosEjecutiva" 
                  :key="asiento.idAsiento"
                  class="seat btn p-0 rounded-3 shadow-sm"
                  :class="getSeatClasses(asiento)"
                  :disabled="!asiento.disponible"
                  @click="seleccionarAsiento(asiento)"
                  :title="'Asiento ' + asiento.numeroAsiento"
                >
                  <span class="seat-label fw-bold">{{ asiento.numeroAsiento }}</span>
                </button>
              </div>
            </div>

            <!-- Cabina Económica -->
            <div v-if="asientosEconomica.length > 0" class="cabin-section">
              <h6 class="text-center text-uppercase fw-bold mb-3" style="color: #6c757d;">Clase Económica</h6>
              <div class="seat-grid economica-grid">
                <button 
                  v-for="asiento in asientosEconomica" 
                  :key="asiento.idAsiento"
                  class="seat btn p-0 rounded-3 shadow-sm"
                  :class="getSeatClasses(asiento)"
                  :disabled="!asiento.disponible"
                  @click="seleccionarAsiento(asiento)"
                  :title="'Asiento ' + asiento.numeroAsiento"
                >
                  <span class="seat-label fw-bold">{{ asiento.numeroAsiento }}</span>
                </button>
              </div>
            </div>
            
          </div>
        </div>

        <!-- Summary & Legend Area -->
        <div class="col-lg-4 mt-5 mt-lg-0">
          <div class="sticky-top" style="top: 2rem;">
            
            <!-- Legend -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3">Leyenda</h5>
                <ul class="list-unstyled mb-0">
                  <li class="d-flex align-items-center mb-2">
                    <div class="legend-box legend-primera me-2"></div> Primera Clase
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <div class="legend-box legend-ejecutiva me-2"></div> Ejecutiva
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <div class="legend-box legend-economica me-2"></div> Económica
                  </li>
                  <li class="d-flex align-items-center mb-2">
                    <div class="legend-box legend-selected me-2"></div> Seleccionado
                  </li>
                  <li class="d-flex align-items-center">
                    <div class="legend-box legend-disabled me-2"></div> Ocupado / Bloqueado
                  </li>
                </ul>
              </div>
            </div>

            <!-- Selection Summary -->
            <div class="card border-0 shadow-sm rounded-4 border-top border-danger border-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3">Tu Selección</h5>
                
                <div v-if="selectedSeat" class="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <p class="text-muted small text-uppercase fw-bold mb-0">Asiento</p>
                    <h3 class="fw-bold text-danger mb-0">{{ selectedSeat.numeroAsiento }}</h3>
                    <span class="badge bg-light text-dark border mt-1">{{ selectedSeat.clase }}</span>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-4 mb-4 bg-light rounded-3 border">
                  Aún no has seleccionado un asiento.
                </div>

                <button 
                  class="btn btn-danger w-100 fw-bold rounded-pill py-2 shadow-sm"
                  :disabled="!selectedSeat"
                  @click="continuar"
                >
                  Continuar
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listAsientos } from '../../../services/clientService'

const route = useRoute()
const router = useRouter()
const idVuelo = route.params.id
const numeroVuelo = route.query.numeroVuelo

const asientos = ref([])
const loading = ref(true)
const errorMessage = ref('')
const selectedSeat = ref(null)

const fetchAsientos = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const data = await listAsientos(idVuelo)
    asientos.value = Array.isArray(data) ? data : []

    if (asientos.value.length === 0) {
      errorMessage.value = 'No se encontró la configuración de asientos para este vuelo.'
    }
  } catch (error) {
    console.error("Error cargando asientos:", error)
    errorMessage.value = 'Ocurrió un error al cargar el mapa de asientos. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

// Custom sort function to sort alphabetically and then numerically (A1, A2... A10)
const sortBySeat = (a, b) => {
  return a.numeroAsiento.localeCompare(b.numeroAsiento, undefined, { numeric: true, sensitivity: 'base' })
}

// Computeds for grouping seats by class
const asientosPrimera = computed(() => {
  return asientos.value.filter(a => a.clase === 'PRIMERA').sort(sortBySeat)
})

const asientosEjecutiva = computed(() => {
  return asientos.value.filter(a => a.clase === 'EJECUTIVA').sort(sortBySeat)
})

const asientosEconomica = computed(() => {
  return asientos.value.filter(a => a.clase === 'ECONOMICA').sort(sortBySeat)
})

const seleccionarAsiento = (asiento) => {
  if (asiento.disponible) {
    selectedSeat.value = asiento
  }
}

const getSeatClasses = (asiento) => {
  if (!asiento.disponible) return 'seat-disabled'
  if (selectedSeat.value?.idAsiento === asiento.idAsiento) return 'seat-selected'
  
  if (asiento.clase === 'PRIMERA') return 'seat-primera'
  if (asiento.clase === 'EJECUTIVA') return 'seat-ejecutiva'
  return 'seat-economica'
}

const continuar = () => {
  if (!selectedSeat.value) return
  router.push({
    path: `/dashboard/vuelos/${idVuelo}/pasajero`,
    query: {
      numeroVuelo: numeroVuelo,
      idAsiento: selectedSeat.value.idAsiento,
      numeroAsiento: selectedSeat.value.numeroAsiento,
      precioExtra: selectedSeat.value.precioExtra
    }
  })
}

onMounted(() => {
  if (idVuelo) {
    fetchAsientos()
  } else {
    errorMessage.value = 'ID de Vuelo no válido.'
    loading.value = false
  }
})
</script>

<style scoped>
.seat-selection-shell {
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

.plane-container {
  background-color: #f1f3f5;
}

.seat-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}

/* Configuraciones de grid simulando cabinas */
.primera-grid {
  width: 240px; /* (45*4) + (10*3) + 30 margin = 240 */
  gap: 10px;
}
.primera-grid > .seat { width: 45px; height: 45px; }
.primera-grid > .seat:nth-child(4n+2) { margin-right: 30px !important; } /* Pasillo en el medio */

.ejecutiva-grid {
  width: 214px; /* (40*4) + (8*3) + 30 margin = 214 */
  gap: 8px;
}
.ejecutiva-grid > .seat { width: 40px; height: 40px; }
.ejecutiva-grid > .seat:nth-child(4n+2) { margin-right: 30px !important; } /* Pasillo ancho */

.economica-grid {
  width: 265px; /* (35*6) + (6*5) + 25 margin = 265 */
  gap: 6px;
}
.economica-grid > .seat { width: 35px; height: 35px; }
.economica-grid > .seat:nth-child(6n+3) { margin-right: 25px !important; } /* Pasillo central */

/* Base Seat */
.seat {
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: white;
  padding: 0;
}

.seat-label {
  font-size: 0.75rem;
  line-height: 1;
}

/* State Classes */
.seat-disabled {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #adb5bd;
  cursor: not-allowed;
}

.seat-selected {
  background-color: #198754 !important;
  border-color: #146c43 !important;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(25, 135, 84, 0.4) !important;
  z-index: 10;
}

/* Class Colors */
.seat-primera { background-color: #d4af37; border-color: #c5a028; }
.seat-primera:hover:not(.seat-disabled) { background-color: #c5a028; }

.seat-ejecutiva { background-color: #0d6efd; border-color: #0b5ed7; }
.seat-ejecutiva:hover:not(.seat-disabled) { background-color: #0b5ed7; }

.seat-economica { background-color: #6c757d; border-color: #5c636a; }
.seat-economica:hover:not(.seat-disabled) { background-color: #5c636a; }

/* Legend Boxes */
.legend-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
.legend-primera { background-color: #d4af37; }
.legend-ejecutiva { background-color: #0d6efd; }
.legend-economica { background-color: #6c757d; }
.legend-selected { background-color: #198754; }
.legend-disabled { background-color: #e9ecef; border: 1px solid #dee2e6; }
</style>
