<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de países</h1>
        <p class="mb-0" style="opacity:0.75;">Consulta el catálogo de países registrados en el sistema.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ errorMessage }}
    </div>

    <!-- Panel -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <!-- Panel heading -->
        <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#d60f2b"/>
              </svg>
            </div>
            <div>
              <h2 class="h5 fw-bold mb-0">Catálogo de países</h2>
              <p class="text-muted small mb-0">Consulta y filtra por continente o estado.</p>
            </div>
          </div>
          <button class="btn fw-bold text-white flex-shrink-0"
                  style="background:#d60f2b;"
                  :disabled="loading"
                  @click="fetchPaises">
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-1">
              <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="white"/>
            </svg>
            <span v-if="loading" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
            {{ loading ? 'Cargando...' : 'Recargar' }}
          </button>
        </div>

        <!-- Filtros -->
        <div class="row g-3 mb-4 align-items-end p-3 rounded-3" style="background:#fafafa;border:1px solid #f0f0f0;">
          <div class="col-12 col-md-5">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
              Continente
            </label>
            <input
              v-model="filters.continente"
              class="form-control"
              style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
              placeholder="Ej. América del Sur"
            />
          </div>

          <div class="col-12 col-md-5">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
              Estado
            </label>
            <select
              v-model="filters.estado"
              class="form-select"
              style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
            >
              <option value="">Todos</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div class="col-12 col-md-2">
            <button
              class="btn fw-bold w-100 text-white"
              style="background:#d60f2b;border-radius:8px;min-height:42px;"
              :disabled="loading"
              @click="fetchPaises"
            >
              Filtrar
            </button>
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ID</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Nombre</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ISO2</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ISO3</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Continente</th>
                <th class="text-uppercase small fw-bold pe-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!paises.length && !loading">
                <td colspan="6" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#ddd"/>
                  </svg>
                  No hay países para mostrar.
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="6" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando países...
                </td>
              </tr>
              <tr v-for="pais in paises" :key="pais.idPais">
                <td class="ps-4 text-muted small fw-semibold">#{{ pais.idPais }}</td>
                <td class="fw-semibold">{{ pais.nombre }}</td>
                <td>
                  <span class="badge fw-bold px-2 py-1 rounded" style="background:#fff0f2;color:#d60f2b;font-size:0.8rem;">
                    {{ pais.codigoIso2 }}
                  </span>
                </td>
                <td class="text-muted">{{ pais.codigoIso3 || '-' }}</td>
                <td class="text-muted">{{ pais.continente || '-' }}</td>
                <td class="pe-4">
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="pais.estado === 'ACTIVO'
                          ? 'background:#d1fae5;color:#065f46;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ pais.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer conteo -->
        <div class="d-flex justify-content-end mt-3">
          <p class="text-muted small mb-0">
            {{ paises.length }} {{ paises.length === 1 ? 'país encontrado' : 'países encontrados' }}
          </p>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { listPaises } from '../../../services/adminService'

const paises = ref([])
const loading = ref(false)
const errorMessage = ref('')

const filters = reactive({
  continente: '',
  estado: ''
})

async function fetchPaises() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await listPaises(filters)
    paises.value = Array.isArray(data) ? data : []
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.mensaje ||
      error?.response?.data?.detalle ||
      error?.message ||
      'No se pudieron cargar los países.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPaises)
</script>