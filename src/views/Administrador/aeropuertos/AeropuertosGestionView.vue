<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de aeropuertos</h1>
        <p class="mb-0" style="opacity:0.75;">Administra aeropuertos con sus códigos, ubicación y filtros por país y ciudad.</p>
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
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">{{ form.idAeropuerto ? 'Editar aeropuerto' : 'Nuevo aeropuerto' }}</h2>
            <p class="text-muted small mb-0">{{ form.idAeropuerto ? 'Modifica los datos del aeropuerto seleccionado.' : 'Completa los campos para registrar un nuevo aeropuerto.' }}</p>
          </div>
        </div>

        <form @submit.prevent="submitAeropuerto">
          <div class="row g-3">

            <!-- IATA / ICAO -->
            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Código IATA *</label>
              <input v-model="form.codigoIata" required placeholder="Ej. UIO"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Código ICAO</label>
              <input v-model="form.codigoIcao" placeholder="Ej. SEQU"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nombre *</label>
              <input v-model="form.nombre" required placeholder="Ej. Aeropuerto Internacional Mariscal Sucre"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- País → dispara filtro de ciudades -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">País *</label>
              <select v-model="form.idPais" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onPaisChange">
                <option value="">Seleccione un país</option>
                <option v-for="p in paises" :key="p.idPais" :value="p.idPais">
                  {{ p.nombre }}
                </option>
              </select>
            </div>

            <!-- Ciudad filtrada por país -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Ciudad
                <span v-if="!form.idPais" class="text-muted fw-normal" style="font-size:0.68rem;"> — selecciona primero un país</span>
              </label>
              <select v-model="form.idCiudad"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      :disabled="!form.idPais || loadingCiudades">
                <option value="">{{ loadingCiudades ? 'Cargando ciudades...' : 'Seleccione una ciudad' }}</option>
                <option v-for="c in ciudadesFiltradas" :key="c.idCiudad" :value="c.idCiudad">
                  {{ c.nombre }}
                </option>
              </select>
              <div v-if="loadingCiudades"
                   class="text-muted small mt-1">
                Buscando ciudades registradas para este pais...
              </div>
              <div v-if="form.idPais && !ciudadesFiltradas.length"
                   class="text-muted small mt-1">
                No hay ciudades registradas para este país.
              </div>
            </div>

            <!-- Zona horaria / lat / lng -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Zona horaria</label>
              <input v-model="form.zonaHoraria" placeholder="Ej. America/Guayaquil"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Latitud</label>
              <input v-model="form.latitud" type="number" placeholder="Ej. -0.1292"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Longitud</label>
              <input v-model="form.longitud" type="number" placeholder="Ej. -78.3583"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 d-flex gap-2 justify-content-end pt-2">
              <button v-if="form.idAeropuerto" type="button"
                      class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                      @click="resetForm">
                Cancelar
              </button>
              <button type="submit"
                      class="btn fw-bold rounded-pill px-4 text-white"
                      style="background:#d60f2b;">
                {{ form.idAeropuerto ? 'Actualizar aeropuerto' : 'Crear aeropuerto' }}
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
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de aeropuertos</h2>
            <p class="text-muted small mb-0">
              {{ aeropuertos.length }} {{ aeropuertos.length === 1 ? 'aeropuerto visible' : 'aeropuertos visibles' }}
              <span v-if="aeropuertosTotal">de {{ aeropuertosTotal }} registrados</span>
            </p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ID</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Nombre</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">IATA</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">ICAO</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">País</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Ciudad</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingAeropuertos">
                <td colspan="8" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando aeropuertos...
                </td>
              </tr>
              <tr v-else-if="!aeropuertos.length">
                <td colspan="8" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ddd"/>
                  </svg>
                  No hay aeropuertos registrados.
                </td>
              </tr>
              <tr v-for="a in aeropuertos" :key="a.idAeropuerto">
                <td class="ps-4 text-muted small fw-semibold">#{{ a.idAeropuerto }}</td>
                <td class="fw-semibold">{{ a.nombre }}</td>
                <td>
                  <span class="badge fw-bold px-2 py-1 rounded" style="background:#fff0f2;color:#d60f2b;font-size:0.8rem;">
                    {{ a.codigoIata }}
                  </span>
                </td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded" style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ a.codigoIcao || '-' }}
                  </span>
                </td>
                <td class="text-muted">{{ getPaisNombre(a.idPais) }}</td>
                <td class="text-muted">{{ getCiudadNombre(a.idCiudad) }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="a.estado === 'ACTIVO'
                          ? 'background:#d1fae5;color:#065f46;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ a.estado }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-2"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="editAeropuerto(a)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#d60f2b"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#f3f4f6;color:#6b7280;border-radius:6px;"
                          @click="deleteAeropuertoAction(a)">
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
            Pagina {{ aeropuertosPage }} de {{ aeropuertosTotalPages }}
            <span v-if="aeropuertosTotal">- {{ aeropuertosTotal }} aeropuertos registrados</span>
          </p>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small mb-0" for="aeropuertos-page-size">Mostrar</label>
            <select
              id="aeropuertos-page-size"
              v-model.number="aeropuertosPageSize"
              class="form-select form-select-sm"
              style="width:auto;"
              :disabled="loadingAeropuertos"
              @change="fetchAeropuertos(1)"
            >
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>

            <div class="btn-group btn-group-sm" role="group" aria-label="Paginacion de aeropuertos">
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingAeropuertos || aeropuertosPage <= 1"
                @click="fetchAeropuertos(aeropuertosPage - 1)"
              >
                Anterior
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingAeropuertos || !canNextAeropuertoPage"
                @click="fetchAeropuertos(aeropuertosPage + 1)"
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/axios'

const aeropuertos = ref([])
const loadingAeropuertos = ref(false)
const aeropuertosPage = ref(1)
const aeropuertosPageSize = ref(20)
const aeropuertosTotal = ref(0)
const aeropuertosTotalPages = ref(1)
const paises = ref([])
const ciudades = ref([])
const loadingCiudades = ref(false)

const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  idAeropuerto: null,
  codigoIata: '',
  codigoIcao: '',
  nombre: '',
  idPais: '',
  idCiudad: '',
  zonaHoraria: '',
  latitud: '',
  longitud: ''
})

// ── Ciudades filtradas por el país seleccionado ──
const ciudadesFiltradas = computed(() =>
  form.idPais
    ? ciudades.value.filter(c => c.idPais === Number(form.idPais))
    : []
)

const canNextAeropuertoPage = computed(() => {
  if (aeropuertosTotalPages.value > aeropuertosPage.value) {
    return true
  }

  return !aeropuertosTotal.value && aeropuertos.value.length === aeropuertosPageSize.value
})

// Al cambiar país, limpiar ciudad para no dejar un id inválido seleccionado
async function onPaisChange() {
  form.idCiudad = ''
  await fetchCiudadesPorPais(form.idPais)
}

function resetForm() {
  form.idAeropuerto = null
  form.codigoIata = ''
  form.codigoIcao = ''
  form.nombre = ''
  form.idPais = ''
  form.idCiudad = ''
  form.zonaHoraria = ''
  form.latitud = ''
  form.longitud = ''
}

function getPaisNombre(id) {
  return paises.value.find(p => p.idPais === id)?.nombre || id
}

function getCiudadNombre(id) {
  return ciudades.value.find(c => c.idCiudad === id)?.nombre || id
}

function editAeropuerto(a) {
  form.idAeropuerto = a.idAeropuerto
  form.codigoIata = a.codigoIata
  form.codigoIcao = a.codigoIcao
  form.nombre = a.nombre
  form.idPais = a.idPais
  form.idCiudad = a.idCiudad
  form.zonaHoraria = a.zonaHoraria
  form.latitud = a.latitud
  form.longitud = a.longitud
}

function buildPayload() {
  return {
    codigoIata: form.codigoIata.toUpperCase(),
    codigoIcao: form.codigoIcao || null,
    nombre: form.nombre,
    idCiudad: form.idCiudad ? Number(form.idCiudad) : null,
    idPais: form.idPais ? Number(form.idPais) : null,
    zonaHoraria: form.zonaHoraria || null,
    latitud: form.latitud ? Number(form.latitud) : null,
    longitud: form.longitud ? Number(form.longitud) : null
  }
}

function manejarError(error) {
  successMsg.value = ''
  if (error.response?.data?.errors) {
    errorMsg.value = Object.values(error.response.data.errors).flat().join(' | ')
  } else {
    errorMsg.value =
      error.response?.data?.title ||
      error.response?.data?.mensaje ||
      error.message ||
      'Error inesperado'
  }
  console.log('ERROR:', error.response?.data)
}

function readAeropuertosMeta(response) {
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

  aeropuertosTotal.value = Number(total || 0)

  if (totalPages) {
    aeropuertosTotalPages.value = Number(totalPages)
    return
  }

  if (total) {
    aeropuertosTotalPages.value = Math.max(1, Math.ceil(total / aeropuertosPageSize.value))
    return
  }

  aeropuertosTotalPages.value = aeropuertos.value.length === aeropuertosPageSize.value
    ? aeropuertosPage.value + 1
    : aeropuertosPage.value
}

async function fetchAeropuertos(page = aeropuertosPage.value) {
  loadingAeropuertos.value = true
  try {
    const res = await api.get('/aeropuertos', {
      params: {
        Page: page,
        PageSize: aeropuertosPageSize.value,
        page,
        page_size: aeropuertosPageSize.value
      }
    })

    aeropuertos.value = res.data.data ?? res.data ?? []
    aeropuertosPage.value = page
    readAeropuertosMeta(res)
  } catch (e) {
    manejarError(e)
  } finally {
    loadingAeropuertos.value = false
  }
}

async function fetchPaises() {
  paises.value = await fetchAllPages('/paises')
}

async function fetchCiudades() {
  loadingCiudades.value = true
  try {
    ciudades.value = await fetchAllPages('/ciudades')
  } catch (e) {
    manejarError(e)
  } finally {
    loadingCiudades.value = false
  }
}

async function fetchCiudadesPorPais(idPais) {
  if (!idPais) return

  loadingCiudades.value = true
  try {
    const ciudadesPais = await fetchAllPages('/ciudades', {
      IdPais: Number(idPais),
      idPais: Number(idPais)
    })

    mergeCiudades(ciudadesPais)
  } catch (e) {
    manejarError(e)
  } finally {
    loadingCiudades.value = false
  }
}

async function fetchAllPages(url, extraParams = {}) {
  const pageSize = 100
  const firstResponse = await api.get(url, {
    params: {
      ...extraParams,
      Page: 1,
      PageSize: pageSize,
      page: 1,
      page_size: pageSize
    }
  })

  const firstData = getResponseItems(firstResponse)
  const totalPages = getResponseTotalPages(firstResponse, firstData.length, pageSize)

  if (!totalPages) {
    const allItems = [...firstData]
    let page = 2
    let keepLoading = firstData.length === pageSize

    while (keepLoading && page <= 50) {
      const response = await api.get(url, {
        params: {
          ...extraParams,
          Page: page,
          PageSize: pageSize,
          page,
          page_size: pageSize
        }
      })
      const items = getResponseItems(response)
      allItems.push(...items)
      keepLoading = items.length === pageSize
      page += 1
    }

    return allItems
  }

  if (totalPages <= 1) {
    return firstData
  }

  const requests = []
  for (let page = 2; page <= totalPages; page += 1) {
    requests.push(api.get(url, {
      params: {
        ...extraParams,
        Page: page,
        PageSize: pageSize,
        page,
        page_size: pageSize
      }
    }))
  }

  const responses = await Promise.all(requests)
  return [
    ...firstData,
    ...responses.flatMap((response) => getResponseItems(response))
  ]
}

function getResponseItems(response) {
  const payload = response.data
  const items = payload?.data ?? payload
  return Array.isArray(items) ? items : []
}

function getResponseTotalPages(response, itemCount, pageSize) {
  const meta = response.data?.meta || {}
  const totalPages =
    response.data?.totalPages ||
    response.data?.total_pages ||
    meta.totalPages ||
    meta.total_pages

  if (totalPages) {
    return Number(totalPages)
  }

  const total =
    response.data?.total ||
    response.data?.totalRecords ||
    response.data?.total_registros ||
    meta.total ||
    meta.totalRecords ||
    meta.total_registros

  if (total) {
    return Math.max(1, Math.ceil(Number(total) / pageSize))
  }

  return itemCount === pageSize ? null : 1
}

function mergeCiudades(nuevasCiudades) {
  const map = new Map(ciudades.value.map((ciudad) => [ciudad.idCiudad, ciudad]))

  nuevasCiudades.forEach((ciudad) => {
    map.set(ciudad.idCiudad, ciudad)
  })

  ciudades.value = Array.from(map.values())
}

async function submitAeropuerto() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const payload = buildPayload()
    console.log('ENVIANDO:', payload)
    if (form.idAeropuerto) {
      await api.put(`/aeropuertos/${form.idAeropuerto}`, { ...payload, estado: 'ACTIVO' })
      successMsg.value = 'Aeropuerto actualizado'
    } else {
      const res = await api.post('/aeropuertos', payload)
      console.log('RESPUESTA:', res.data)
      successMsg.value = 'Aeropuerto creado'
    }
    resetForm()
    await fetchAeropuertos()
  } catch (e) {
    manejarError(e)
  }
}

async function deleteAeropuertoAction(a) {
  if (!confirm('¿Eliminar aeropuerto?')) return
  try {
    await api.delete(`/aeropuertos/${a.idAeropuerto}`)
    successMsg.value = 'Eliminado correctamente'
    await fetchAeropuertos()
  } catch (e) {
    manejarError(e)
  }
}

onMounted(() => {
  fetchAeropuertos()
  fetchPaises()
  fetchCiudades()
})
</script>
