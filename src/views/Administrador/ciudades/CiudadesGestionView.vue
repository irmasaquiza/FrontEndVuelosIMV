<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de ciudades</h1>
        <p class="mb-0" style="opacity:0.75;">Crea, actualiza y elimina ciudades relacionándolas con su país.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0f5132"/>
      </svg>
      {{ successMsg }}
    </div>

    <!-- Formulario -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">{{ form.idCiudad ? 'Editar ciudad' : 'Nueva ciudad' }}</h2>
            <p class="text-muted small mb-0">{{ form.idCiudad ? 'Modifica los datos de la ciudad seleccionada.' : 'Completa los campos para registrar una nueva ciudad.' }}</p>
          </div>
        </div>

        <form @submit.prevent="submitCiudad">
          <div class="row g-3">

            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">País</label>
              <select v-model="form.idPais" required
                      class="form-select"
                      :disabled="loadingPaises"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Seleccione un país</option>
                <option v-for="p in paises" :key="p.idPais" :value="p.idPais">
                  {{ p.nombre }}
                </option>
              </select>
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2">
                <small class="text-muted">
                  Pagina {{ paisesPage }} de {{ paisesTotalPages }}
                  <span v-if="paisesTotal">- {{ paisesTotal }} paises</span>
                </small>
                <div class="btn-group btn-group-sm" role="group" aria-label="Paginacion de paises">
                  <button
                    type="button"
                    class="btn btn-outline-secondary fw-semibold"
                    :disabled="loadingPaises || paisesPage <= 1"
                    @click="cambiarPaginaPaises(paisesPage - 1)"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary fw-semibold"
                    :disabled="loadingPaises || !canNextPaisPage"
                    @click="cambiarPaginaPaises(paisesPage + 1)"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nombre</label>
              <input v-model="form.nombre" required placeholder="Ej. Quito"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Zona horaria</label>
              <input v-model="form.zonaHoraria" placeholder="Ej. America/Guayaquil"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Latitud</label>
              <input v-model="form.latitud" type="number" placeholder="Ej. -0.2295"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Longitud</label>
              <input v-model="form.longitud" type="number" placeholder="Ej. -78.5243"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 d-flex gap-2 justify-content-end pt-2">
              <button v-if="form.idCiudad" type="button"
                      class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                      @click="resetForm">
                Cancelar
              </button>
              <button type="submit"
                      class="btn fw-bold rounded-pill px-4 text-white"
                      style="background:#d60f2b;">
                {{ form.idCiudad ? 'Actualizar ciudad' : 'Crear ciudad' }}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de ciudades</h2>
            <p class="text-muted small mb-0">
              {{ ciudades.length }} {{ ciudades.length === 1 ? 'ciudad visible' : 'ciudades visibles' }}
              <span v-if="ciudadesTotal">de {{ ciudadesTotal }} registradas</span>
            </p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ID</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Nombre</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">País</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Zona horaria</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingCiudades">
                <td colspan="6" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando ciudades...
                </td>
              </tr>
              <tr v-else-if="!ciudades.length">
                <td colspan="6" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="#ddd"/>
                  </svg>
                  No hay ciudades registradas.
                </td>
              </tr>
              <tr v-for="c in ciudades" :key="c.idCiudad">
                <td class="ps-4 text-muted small fw-semibold">#{{ c.idCiudad }}</td>
                <td class="fw-semibold">{{ c.nombre }}</td>
                <td class="text-muted">{{ getPaisNombre(c.idPais) }}</td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ c.zonaHoraria || '-' }}
                  </span>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="c.estado === 'ACTIVO'
                          ? 'background:#d1fae5;color:#065f46;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ c.estado }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-2"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="editCiudad(c)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#d60f2b"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#f3f4f6;color:#6b7280;border-radius:6px;"
                          @click="deleteCiudadAction(c)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#6b7280"/>
                    </svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">
            Pagina {{ ciudadesPage }} de {{ ciudadesTotalPages }}
            <span v-if="ciudadesTotal">- {{ ciudadesTotal }} ciudades registradas</span>
          </p>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small mb-0" for="ciudades-page-size">Mostrar</label>
            <select
              id="ciudades-page-size"
              v-model.number="ciudadesPageSize"
              class="form-select form-select-sm"
              style="width:auto;"
              :disabled="loadingCiudades"
              @change="fetchCiudades(1)"
            >
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>

            <div class="btn-group btn-group-sm" role="group" aria-label="Paginacion de ciudades">
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingCiudades || ciudadesPage <= 1"
                @click="fetchCiudades(ciudadesPage - 1)"
              >
                Anterior
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingCiudades || !canNextCiudadPage"
                @click="fetchCiudades(ciudadesPage + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const ciudades = ref([])
const loadingCiudades = ref(false)
const ciudadesPage = ref(1)
const ciudadesPageSize = ref(20)
const ciudadesTotal = ref(0)
const ciudadesTotalPages = ref(1)
const paises = ref([])
const loadingPaises = ref(false)
const paisesPage = ref(1)
const paisesPageSize = 10
const paisesTotal = ref(0)
const paisesTotalPages = ref(1)

const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  idCiudad: null,
  idPais: '',
  nombre: '',
  zonaHoraria: '',
  latitud: '',
  longitud: ''
})

const canNextPaisPage = computed(() => {
  if (paisesTotalPages.value > paisesPage.value) {
    return true
  }

  return !paisesTotal.value && paises.value.length === paisesPageSize
})

const canNextCiudadPage = computed(() => {
  if (ciudadesTotalPages.value > ciudadesPage.value) {
    return true
  }

  return !ciudadesTotal.value && ciudades.value.length === ciudadesPageSize.value
})

function resetForm() {
  form.idCiudad = null
  form.idPais = ''
  form.nombre = ''
  form.zonaHoraria = ''
  form.latitud = ''
  form.longitud = ''
}

function getPaisNombre(id) {
  return paises.value.find(p => p.idPais === id)?.nombre || id
}

function editCiudad(c) {
  form.idCiudad = c.idCiudad
  form.idPais = c.idPais
  form.nombre = c.nombre
  form.zonaHoraria = c.zonaHoraria
  form.latitud = c.latitud
  form.longitud = c.longitud
}

function buildPayload() {
  return {
    idPais: Number(form.idPais),
    nombre: form.nombre,
    zonaHoraria: form.zonaHoraria || null,
    latitud: form.latitud ? Number(form.latitud) : null,
    longitud: form.longitud ? Number(form.longitud) : null
  }
}

function manejarError(error, fallback = '') {
  successMsg.value = ''
  if (error?.response?.data?.errors) {
    const errores = error.response.data.errors
    errorMsg.value = Object.values(errores).flat().join(' | ')
  } else {
    errorMsg.value =
      error?.response?.data?.mensaje ||
      error?.response?.data?.message ||
      error?.response?.data?.detalle ||
      error?.response?.data?.title ||
      error?.message ||
      fallback ||
      'Ha ocurrido un error inesperado.'
  }
}

function readCiudadesMeta(response) {
  const meta = response.data?.meta || {}
  const total =
    response.data?.total ||
    response.data?.totalRecords ||
    response.data?.total_registros ||
    meta.total ||
    meta.totalRecords ||
    meta.total_registros ||
    0

  const totalPages =
    response.data?.totalPages ||
    response.data?.total_pages ||
    meta.totalPages ||
    meta.total_pages ||
    0

  ciudadesTotal.value = Number(total || 0)

  if (totalPages) {
    ciudadesTotalPages.value = Number(totalPages)
    return
  }

  if (total) {
    ciudadesTotalPages.value = Math.max(1, Math.ceil(total / ciudadesPageSize.value))
    return
  }

  ciudadesTotalPages.value = ciudades.value.length === ciudadesPageSize.value
    ? ciudadesPage.value + 1
    : ciudadesPage.value
}

async function fetchCiudades(page = ciudadesPage.value) {
  loadingCiudades.value = true
  try {
    const res = await api.get('/ciudades', {
      params: {
        Page: page,
        PageSize: ciudadesPageSize.value,
        page,
        page_size: ciudadesPageSize.value
      }
    })

    ciudades.value = res.data.data ?? res.data ?? []
    ciudadesPage.value = page
    readCiudadesMeta(res)
  } catch (e) {
    manejarError(e)
  } finally {
    loadingCiudades.value = false
  }
}

function readPaisesMeta(response) {
  const meta = response.data?.meta || {}
  const total =
    response.data?.total ||
    response.data?.totalRecords ||
    response.data?.total_registros ||
    meta.total ||
    meta.totalRecords ||
    meta.total_registros ||
    0

  const totalPages =
    response.data?.totalPages ||
    response.data?.total_pages ||
    meta.totalPages ||
    meta.total_pages ||
    0

  paisesTotal.value = Number(total || 0)

  if (totalPages) {
    paisesTotalPages.value = Number(totalPages)
    return
  }

  if (total) {
    paisesTotalPages.value = Math.max(1, Math.ceil(total / paisesPageSize))
    return
  }

  paisesTotalPages.value = paises.value.length === paisesPageSize ? paisesPage.value + 1 : paisesPage.value
}

async function fetchPaises(page = paisesPage.value) {
  loadingPaises.value = true
  try {
    const res = await api.get('/paises', {
      params: {
        Page: page,
        PageSize: paisesPageSize,
        page,
        page_size: paisesPageSize
      }
    })

    paises.value = res.data.data ?? res.data ?? []
    paisesPage.value = page
    readPaisesMeta(res)
  } catch (e) {
    manejarError(e)
  } finally {
    loadingPaises.value = false
  }
}

function cambiarPaginaPaises(page) {
  if (page < 1 || loadingPaises.value) {
    return
  }

  fetchPaises(page)
}

async function submitCiudad() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const payload = buildPayload()
    if (form.idCiudad) {
      await api.put(`/ciudades/${form.idCiudad}`, payload)
      successMsg.value = 'Ciudad actualizada correctamente'
    } else {
      const res = await api.post('/ciudades', payload)
      successMsg.value = `Ciudad creada: ${res.data.data.nombre}`
    }
    resetForm()
    fetchCiudades()
  } catch (e) {
    manejarError(e)
  }
}

async function deleteCiudadAction(c) {
  if (!confirm('¿Eliminar ciudad?')) return
  try {
    await api.delete(`/ciudades/${c.idCiudad}`)
    successMsg.value = 'Ciudad eliminada'
    fetchCiudades()
  } catch (e) {
    manejarError(e)
  }
}

onMounted(() => {
  fetchCiudades()
  fetchPaises()
})
</script>
