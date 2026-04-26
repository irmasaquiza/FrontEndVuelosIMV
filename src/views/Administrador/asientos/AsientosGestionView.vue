<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de asientos</h1>
        <p class="mb-0" style="opacity:0.75;">Selecciona un vuelo, crea asientos por clase y controla su disponibilidad.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="feedbackError" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ feedbackError }}
    </div>
    <div v-if="feedbackSuccess" class="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0f5132"/>
      </svg>
      {{ feedbackSuccess }}
    </div>

    <!-- ═══════════════ SELECTOR DE VUELO ═══════════════ -->
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
            <h2 class="h5 fw-bold mb-0">Seleccionar vuelo</h2>
            <p class="text-muted small mb-0">Elige el vuelo para administrar sus asientos.</p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Número</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Ruta</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Salida</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!vuelos.length">
                <td colspan="5" class="text-center text-muted py-4">No hay vuelos disponibles.</td>
              </tr>
              <tr v-for="v in vuelos" :key="v.idVuelo"
                  :style="selectedVuelo?.idVuelo === v.idVuelo ? 'background:#fff8f8;' : ''">
                <td class="ps-4">
                  <span class="badge fw-bold px-2 py-1 rounded"
                        style="background:#fff0f2;color:#d60f2b;font-size:0.82rem;">
                    {{ v.numeroVuelo }}
                  </span>
                </td>
                <td class="fw-semibold small">
                  {{ v.idAeropuertoOrigen }}
                  <span class="text-muted mx-1">→</span>
                  {{ v.idAeropuertoDestino }}
                </td>
                <td class="text-muted small">{{ formatDate(v.fechaHoraSalida) }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="v.estadoVuelo === 'PROGRAMADO'
                          ? 'background:#dbeafe;color:#1e40af;'
                          : v.estadoVuelo === 'EN_VUELO'
                          ? 'background:#d1fae5;color:#065f46;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ v.estadoVuelo }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold"
                          :style="selectedVuelo?.idVuelo === v.idVuelo
                            ? 'background:#d1fae5;color:#065f46;border-radius:6px;'
                            : 'background:#fff0f2;color:#d60f2b;border-radius:6px;'"
                          @click="selectVuelo(v)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path v-if="selectedVuelo?.idVuelo === v.idVuelo"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#065f46"/>
                      <path v-else
                            d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"
                            fill="#d60f2b"/>
                    </svg>
                    {{ selectedVuelo?.idVuelo === v.idVuelo ? 'Activo' : 'Administrar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- ═══════════════ PANEL DE ASIENTOS ═══════════════ -->
    <div v-if="selectedVuelo" class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <!-- Encabezado con resumen -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                 style="width:48px;height:48px;background:#fff0f2;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#d60f2b"/>
              </svg>
            </div>
            <div>
              <h2 class="h5 fw-bold mb-0">
                Asientos —
                <span class="badge ms-1 fw-bold" style="background:#fff0f2;color:#d60f2b;">
                  {{ selectedVuelo.numeroVuelo }}
                </span>
              </h2>
              <p class="text-muted small mb-0">{{ asientos.length }} asientos en total</p>
            </div>
          </div>

          <!-- Tarjetas resumen -->
          <div class="d-flex gap-2">
            <div class="text-center px-3 py-2 rounded-3" style="background:#d1fae5;min-width:80px;">
              <div class="fw-bold" style="font-size:1.4rem;color:#065f46;">{{ totalDisponibles }}</div>
              <div class="small fw-semibold" style="color:#065f46;">Disponibles</div>
            </div>
            <div class="text-center px-3 py-2 rounded-3" style="background:#fee2e2;min-width:80px;">
              <div class="fw-bold" style="font-size:1.4rem;color:#991b1b;">{{ totalOcupados }}</div>
              <div class="small fw-semibold" style="color:#991b1b;">Ocupados</div>
            </div>
            <div class="text-center px-3 py-2 rounded-3" style="background:#f3f4f6;min-width:80px;">
              <div class="fw-bold" style="font-size:1.4rem;color:#374151;">{{ asientos.length }}</div>
              <div class="small fw-semibold" style="color:#374151;">Total</div>
            </div>
          </div>
        </div>

        <!-- ── Formulario crear / editar ── -->
        <div class="p-3 rounded-3 mb-4" style="background:#fafafa;border:1px solid #f0f0f0;">
          <p class="text-uppercase fw-bold small mb-3" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
            {{ editingAsiento ? `Editando asiento ${editingAsiento.numeroAsiento}` : 'Nuevo asiento' }}
          </p>
          <form @submit.prevent="submitAsiento">
            <div class="row g-3 align-items-end">

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Número *</label>
                <input v-model="asientoForm.numeroAsiento" placeholder="Ej. A1" required
                       :disabled="!!editingAsiento"
                       class="form-control"
                       style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Clase</label>
                <select v-model="asientoForm.clase"
                        class="form-select"
                        style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                  <option value="ECONOMICA">Económica</option>
                  <option value="EJECUTIVA">Ejecutiva</option>
                  <option value="PRIMERA">Primera</option>
                </select>
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Posición</label>
                <select v-model="asientoForm.posicion"
                        class="form-select"
                        style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                  <option value="">Sin posición</option>
                  <option value="VENTANA">Ventana</option>
                  <option value="PASILLO">Pasillo</option>
                  <option value="CENTRO">Centro</option>
                </select>
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Precio extra ($)</label>
                <input v-model.number="asientoForm.precioExtra" type="number" min="0" placeholder="0"
                       class="form-control"
                       style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Disponible</label>
                <select v-model="asientoForm.disponible"
                        class="form-select"
                        style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                  <option :value="true">Sí</option>
                  <option :value="false">No</option>
                </select>
              </div>

              <div class="col-12 col-md-2 d-flex gap-2">
                <button type="submit"
                        class="btn fw-bold flex-grow-1 text-white"
                        style="background:#d60f2b;border-radius:8px;min-height:42px;">
                  {{ editingAsiento ? 'Actualizar' : 'Crear' }}
                </button>
                <button type="button"
                        class="btn btn-outline-secondary fw-bold"
                        style="border-radius:8px;min-height:42px;"
                        @click="resetForm">
                  ✕
                </button>
              </div>

            </div>
          </form>
        </div>

        <!-- ── Filtros rápidos ── -->
        <div class="d-flex flex-wrap gap-2 mb-4">
          <button v-for="f in filtrosClase" :key="f.valor"
                  class="btn btn-sm fw-semibold rounded-pill px-3"
                  :style="filtroActivo === f.valor
                    ? 'background:#d60f2b;color:#fff;border:1.5px solid #d60f2b;'
                    : 'background:#fff;color:#555;border:1.5px solid #e0e0e0;'"
                  @click="filtroActivo = f.valor">
            {{ f.label }}
          </button>
        </div>

        <!-- ── Grid de asientos ── -->
        <div v-if="!asientosFiltrados.length" class="text-center text-muted py-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#ddd"/>
          </svg>
          Sin asientos para mostrar.
        </div>

        <div class="row g-3">
          <div v-for="a in asientosFiltrados" :key="a.idAsiento" class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="card border-2 h-100 text-center p-3"
                 :style="estaDisponible(a)
                   ? 'border-color:#86efac!important;background:#f0fdf4;'
                   : 'border-color:#fca5a5!important;background:#fff1f2;'">

              <!-- Número -->
              <div class="fw-bold mb-1" style="font-size:1.5rem;">{{ a.numeroAsiento }}</div>

              <!-- Badges clase / posición -->
              <div class="d-flex flex-wrap gap-1 justify-content-center mb-2">
                <span class="badge fw-semibold"
                      style="background:#e5e7eb;color:#374151;font-size:0.7rem;">
                  {{ a.clase }}
                </span>
                <span v-if="a.posicion" class="badge fw-semibold"
                      style="background:#e5e7eb;color:#374151;font-size:0.7rem;">
                  {{ a.posicion }}
                </span>
              </div>

              <!-- Precio extra -->
              <div v-if="a.precioExtra > 0" class="small fw-semibold mb-1" style="color:#059669;">
                +${{ a.precioExtra }}
              </div>

              <!-- Estado -->
              <div class="small fw-semibold mb-2"
                   :style="estaDisponible(a) ? 'color:#16a34a;' : 'color:#dc2626;'">
                {{ estaDisponible(a) ? '● Disponible' : '● Ocupado' }}
              </div>

              <!-- Acciones -->
              <div class="d-flex gap-1 mt-auto">
                <button class="btn btn-sm fw-bold flex-grow-1"
                        style="background:#fff0f2;color:#d60f2b;border-radius:6px;font-size:0.72rem;"
                        @click="editAsiento(a)">
                  Editar
                </button>
                <button class="btn btn-sm fw-bold flex-grow-1"
                        :style="estaDisponible(a)
                          ? 'background:#fee2e2;color:#991b1b;border-radius:6px;font-size:0.72rem;'
                          : 'background:#dcfce7;color:#166534;border-radius:6px;font-size:0.72rem;'"
                        @click="toggleDisponibilidad(a)">
                  {{ estaDisponible(a) ? 'Ocupar' : 'Liberar' }}
                </button>
              </div>

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

// ── Estado ────────────────────────────────────────────────────────
const vuelos         = ref([])
const asientos       = ref([])
const selectedVuelo  = ref(null)
const editingAsiento = ref(null)
const filtroActivo   = ref('TODOS')

const feedbackError   = ref('')
const feedbackSuccess = ref('')

const filtrosClase = [
  { label: 'Todos',        valor: 'TODOS'       },
  { label: 'Económica',    valor: 'ECONOMICA'   },
  { label: 'Ejecutiva',    valor: 'EJECUTIVA'   },
  { label: 'Primera',      valor: 'PRIMERA'     },
  { label: 'Disponibles',  valor: 'DISPONIBLES' },
  { label: 'Ocupados',     valor: 'OCUPADOS'    },
]

// ── Formulario asiento ────────────────────────────────────────────
const asientoForm = reactive({
  numeroAsiento: '',
  clase:         'ECONOMICA',
  posicion:      '',
  precioExtra:   0,
  disponible:    true
})

// ── Computed ──────────────────────────────────────────────────────
function estaDisponible(a) {
  return a.disponible === true || a.disponible === 'true'
}

const asientosFiltrados = computed(() => {
  if (filtroActivo.value === 'TODOS')       return asientos.value
  if (filtroActivo.value === 'DISPONIBLES') return asientos.value.filter(a =>  estaDisponible(a))
  if (filtroActivo.value === 'OCUPADOS')    return asientos.value.filter(a => !estaDisponible(a))
  return asientos.value.filter(a => a.clase === filtroActivo.value)
})

const totalDisponibles = computed(() => asientos.value.filter(a =>  estaDisponible(a)).length)
const totalOcupados    = computed(() => asientos.value.filter(a => !estaDisponible(a)).length)

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(d) {
  return d ? d.replace('T', ' ').slice(0, 16) : ''
}

function setError(e, fallback = '') {
  feedbackSuccess.value = ''
  if (e?.response?.data?.errors) {
    feedbackError.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    feedbackError.value =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title ||
      e?.message ||
      fallback ||
      'Ha ocurrido un error inesperado.'
  }
  console.error('API error:', e?.response?.data ?? e)
}

function setSuccess(msg) {
  feedbackError.value   = ''
  feedbackSuccess.value = msg
  setTimeout(() => { feedbackSuccess.value = '' }, 3000)
}

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchVuelos() {
  try {
    const res = await api.get('/vuelos', { params: { page: 1, page_size: 50 } })
    vuelos.value = res.data.data ?? []
  } catch (e) { setError(e) }
}

async function selectVuelo(v) {
  selectedVuelo.value = v
  resetForm()
  await fetchAsientos()
}

async function fetchAsientos() {
  try {
    const res = await api.get(`/vuelos/${selectedVuelo.value.idVuelo}/asientos`)
    const lista = res.data.data ?? res.data ?? []
    asientos.value = Array.isArray(lista) ? lista : []
  } catch (e) { setError(e) }
}

// ── Editar ────────────────────────────────────────────────────────
function editAsiento(a) {
  editingAsiento.value      = a
  asientoForm.numeroAsiento = a.numeroAsiento
  asientoForm.clase         = a.clase
  asientoForm.posicion      = a.posicion    ?? ''
  asientoForm.precioExtra   = a.precioExtra ?? 0
  asientoForm.disponible    = estaDisponible(a)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Crear / Actualizar ────────────────────────────────────────────
async function submitAsiento() {
  const payload = {
    numeroAsiento: asientoForm.numeroAsiento.toUpperCase(),
    clase:         asientoForm.clase,
    disponible:    asientoForm.disponible,
    precioExtra:   Number(asientoForm.precioExtra ?? 0),
    posicion:      asientoForm.posicion || null
  }

  try {
    if (editingAsiento.value) {
      await api.patch(
        `/vuelos/${selectedVuelo.value.idVuelo}/asientos/${editingAsiento.value.idAsiento}`,
        payload
      )
      setSuccess(`Asiento ${payload.numeroAsiento} actualizado correctamente`)
    } else {
      await api.post(`/vuelos/${selectedVuelo.value.idVuelo}/asientos`, payload)
      setSuccess(`Asiento ${payload.numeroAsiento} creado correctamente`)
    }
    resetForm()
    fetchAsientos()
  } catch (e) { setError(e) }
}

// ── Toggle disponibilidad ─────────────────────────────────────────
async function toggleDisponibilidad(a) {
  const nuevoEstado = !estaDisponible(a)
  try {
    await api.patch(
      `/vuelos/${selectedVuelo.value.idVuelo}/asientos/${a.idAsiento}`,
      {
        numeroAsiento: a.numeroAsiento,
        clase:         a.clase,
        disponible:    nuevoEstado,
        precioExtra:   a.precioExtra ?? 0,
        posicion:      a.posicion    ?? null
      }
    )
    setSuccess(`Asiento ${a.numeroAsiento} marcado como ${nuevoEstado ? 'disponible' : 'ocupado'}`)
    fetchAsientos()
  } catch (e) { setError(e) }
}

// ── Reset ─────────────────────────────────────────────────────────
function resetForm() {
  asientoForm.numeroAsiento = ''
  asientoForm.clase         = 'ECONOMICA'
  asientoForm.posicion      = ''
  asientoForm.precioExtra   = 0
  asientoForm.disponible    = true
  editingAsiento.value      = null
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(fetchVuelos)
</script>