<template>
  <div class="dashboard-shell">
    <!-- Navbar / Header -->
    <header class="client-header d-flex justify-content-between align-items-center p-4">
      <div class="login-logo text-white">
        <div class="login-logo-icon bg-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
          </svg>
        </div>
        <span class="fw-bold fs-5 ms-2">NachoFlight</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-light fw-bold rounded-pill px-4" @click="router.push('/dashboard/mis-viajes')">Mis Viajes</button>
        <button class="btn btn-outline-light fw-bold rounded-pill px-4" @click="logout">Cerrar Sesión</button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center justify-content-center">
      <div class="container text-center text-white pb-5">
        <h1 class="display-4 fw-bold mb-3 shadow-text">¿A dónde quieres volar hoy?</h1>
        <p class="lead shadow-text">Encuentra los mejores destinos al mejor precio.</p>
      </div>
    </section>

    <!-- Search Widget -->
    <section class="container search-widget-container">
      <div class="card search-widget border-0 shadow-lg rounded-4 p-4">
        
        <!-- Trip Type Selector -->
        <div class="d-flex gap-3 mb-4 border-bottom pb-3">
          <div class="form-check custom-radio">
            <input class="form-check-input" type="radio" name="tripType" id="idaVuelta" value="roundTrip" v-model="form.tripType">
            <label class="form-check-label fw-bold" for="idaVuelta">
              Ida y Vuelta
            </label>
          </div>
          <div class="form-check custom-radio">
            <input class="form-check-input" type="radio" name="tripType" id="soloIda" value="oneWay" v-model="form.tripType">
            <label class="form-check-label fw-bold" for="soloIda">
              Solo Ida
            </label>
          </div>
        </div>

        <div v-if="loadingAirports" class="text-center py-3">
          <span class="spinner-border spinner-border-sm text-danger" role="status"></span>
          <span class="ms-2 text-muted small">Cargando destinos...</span>
        </div>

        <form v-else @submit.prevent="handleSearch" class="row g-3 align-items-end">
          <!-- Origen -->
          <div class="col-md-6 col-lg-3">
            <label class="form-label text-muted small fw-bold text-uppercase" for="origen">Origen</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo-alt"></i></span>
              <select id="origen" v-model="form.origen" class="form-select border-start-0 ps-0 bg-light" required>
                <option value="" disabled>¿Desde dónde viajas?</option>
                <option v-for="aeropuerto in aeropuertos" :key="aeropuerto.idAeropuerto" :value="aeropuerto.idAeropuerto">
                  {{ aeropuerto.nombre }} ({{ aeropuerto.codigoIata }})
                </option>
              </select>
            </div>
          </div>

          <!-- Destino -->
          <div class="col-md-6 col-lg-3">
            <label class="form-label text-muted small fw-bold text-uppercase" for="destino">Destino</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo-fill"></i></span>
              <select id="destino" v-model="form.destino" class="form-select border-start-0 ps-0 bg-light" required>
                <option value="" disabled>¿A dónde viajas?</option>
                <option v-for="aeropuerto in aeropuertos" :key="aeropuerto.idAeropuerto" :value="aeropuerto.idAeropuerto">
                  {{ aeropuerto.nombre }} ({{ aeropuerto.codigoIata }})
                </option>
              </select>
            </div>
          </div>

          <!-- Fecha Ida -->
          <div class="col-md-6 col-lg-2">
            <label class="form-label text-muted small fw-bold text-uppercase" for="fechaIda">Fecha Ida</label>
            <input type="date" id="fechaIda" v-model="form.fechaIda" class="form-control bg-light" required :min="today">
          </div>

          <!-- Fecha Regreso -->
          <div v-if="form.tripType === 'roundTrip'" class="col-md-6 col-lg-2">
            <label class="form-label text-muted small fw-bold text-uppercase" for="fechaRegreso">Fecha Regreso</label>
            <input type="date" id="fechaRegreso" v-model="form.fechaRegreso" class="form-control bg-light" required :min="form.fechaIda || today">
          </div>

          <!-- Buscar Btn -->
          <div class="col-12" :class="{'col-lg-2': form.tripType === 'roundTrip', 'col-lg-4': form.tripType === 'oneWay'}">
            <button type="submit" class="btn btn-search w-100 rounded-3 py-2 fw-bold text-white">
              Buscar Vuelos
            </button>
          </div>
        </form>

      </div>
    </section>

    <!-- Main Content Padding -->
    <div style="height: 200px;"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listAeropuertos } from '../../services/clientService'

const router = useRouter()
const aeropuertos = ref([])
const loadingAirports = ref(true)

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  tripType: 'roundTrip',
  origen: '',
  destino: '',
  fechaIda: '',
  fechaRegreso: ''
})

const fetchAeropuertos = async () => {
  try {
    const { data } = await listAeropuertos()
    aeropuertos.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error al cargar aeropuertos", error)
  } finally {
    loadingAirports.value = false
  }
}

const handleSearch = () => {
  if (form.origen === form.destino) {
    alert("El origen y destino no pueden ser iguales.")
    return
  }
  
  if (form.tripType === 'roundTrip' && (!form.fechaIda || !form.fechaRegreso)) {
    alert("Por favor selecciona las fechas de ida y regreso.")
    return
  }

  // Navigate to results page with query params
  const query = {
    origen: form.origen,
    destino: form.destino,
    fechaIda: form.fechaIda,
    tripType: form.tripType
  }
  
  if (form.tripType === 'roundTrip') {
    query.fechaRegreso = form.fechaRegreso
  }

  router.push({ path: '/dashboard/vuelos', query })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

onMounted(() => {
  fetchAeropuertos()
})
</script>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
}

.client-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: transparent;
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

.hero-section {
  height: 50vh;
  min-height: 400px;
  background: linear-gradient(135deg, rgba(214,15,43,0.9) 0%, rgba(107,0,22,0.9) 100%), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') center/cover;
  position: relative;
}

.shadow-text {
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.search-widget-container {
  margin-top: -80px;
  position: relative;
  z-index: 20;
}

.search-widget {
  background: white;
}

.custom-radio .form-check-input:checked {
  background-color: #d60f2b;
  border-color: #d60f2b;
}

.btn-search {
  background-color: #d60f2b;
  transition: all 0.3s ease;
}

.btn-search:hover {
  background-color: #a00824;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(214,15,43,0.3);
}

.input-group-text, .form-select, .form-control {
  min-height: 48px;
}

.form-select:focus, .form-control:focus {
  border-color: #d60f2b;
  box-shadow: 0 0 0 0.25rem rgba(214,15,43,0.1);
}
</style>
