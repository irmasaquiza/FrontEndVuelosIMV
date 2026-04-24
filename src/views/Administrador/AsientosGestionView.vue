<template>
  <section class="admin-page">

    <h1>Gestión de Asientos 💺</h1>

    <p v-if="feedbackError"   class="error">{{ feedbackError }}</p>
    <p v-if="feedbackSuccess" class="success">{{ feedbackSuccess }}</p>

    <!-- ══════════════════════════════════════════════
         SELECTOR DE VUELO
    ══════════════════════════════════════════════ -->
    <div class="panel">
      <h3>Seleccionar vuelo</h3>

      <table class="tabla">
        <thead>
          <tr>
            <th>Número</th>
            <th>Ruta</th>
            <th>Salida</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="v in vuelos"
            :key="v.idVuelo"
            :class="{ 'fila-activa': selectedVuelo?.idVuelo === v.idVuelo }"
          >
            <td>{{ v.numeroVuelo }}</td>
            <td>{{ v.idAeropuertoOrigen }} → {{ v.idAeropuertoDestino }}</td>
            <td>{{ formatDate(v.fechaHoraSalida) }}</td>
            <td>{{ v.estadoVuelo }}</td>
            <td>
              <button @click="selectVuelo(v)">
                {{ selectedVuelo?.idVuelo === v.idVuelo ? '✅ Activo' : 'Administrar' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══════════════════════════════════════════════
         PANEL DE ASIENTOS
    ══════════════════════════════════════════════ -->
    <div v-if="selectedVuelo" class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <h3>Asientos — {{ selectedVuelo.numeroVuelo }}</h3>

        <!-- Leyenda -->
        <div style="display:flex; gap:16px; font-size:13px">
          <span><span class="badge badge-disponible">●</span> Disponible</span>
          <span><span class="badge badge-ocupado">●</span> Ocupado</span>
        </div>
      </div>

      <!-- Resumen -->
      <div class="resumen">
        <div class="resumen-item">
          <span class="resumen-num">{{ totalDisponibles }}</span>
          <span class="resumen-label">Disponibles</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-num">{{ totalOcupados }}</span>
          <span class="resumen-label">Ocupados</span>
        </div>
        <div class="resumen-item">
          <span class="resumen-num">{{ asientos.length }}</span>
          <span class="resumen-label">Total</span>
        </div>
      </div>

      <!-- ── FORMULARIO CREAR / EDITAR ──────────────────── -->
      <div class="subpanel">
        <h4>{{ editingAsiento ? `Editando asiento ${editingAsiento.numeroAsiento}` : 'Nuevo asiento' }}</h4>

        <form @submit.prevent="submitAsiento" class="grid">

          <div>
            <label>Número asiento</label>
            <input
              v-model="asientoForm.numeroAsiento"
              placeholder="A1"
              :disabled="!!editingAsiento"
              style="width:100%"
              required
            />
          </div>

          <div>
            <label>Clase</label>
            <select v-model="asientoForm.clase" style="width:100%">
              <option value="ECONOMICA">Económica</option>
              <option value="EJECUTIVA">Ejecutiva</option>
              <option value="PRIMERA">Primera</option>
            </select>
          </div>

          <div>
            <label>Posición</label>
            <select v-model="asientoForm.posicion" style="width:100%">
              <option value="">Sin posición</option>
              <option value="VENTANA">Ventana</option>
              <option value="PASILLO">Pasillo</option>
              <option value="CENTRO">Centro</option>
            </select>
          </div>

          <div>
            <label>Precio extra ($)</label>
            <input v-model.number="asientoForm.precioExtra" type="number" min="0" style="width:100%" />
          </div>

          <div>
            <label>Disponible</label>
            <select v-model="asientoForm.disponible" style="width:100%">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>

          <div style="display:flex; align-items:flex-end; gap:8px">
            <button type="submit" style="flex:1">
              {{ editingAsiento ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" @click="resetForm" style="background:#999">
              Cancelar
            </button>
          </div>

        </form>
      </div>

      <!-- ── FILTRO RÁPIDO ──────────────────────────────── -->
      <div style="display:flex; gap:10px; margin:12px 0; flex-wrap:wrap">
        <button
          v-for="f in filtrosClase"
          :key="f.valor"
          @click="filtroActivo = f.valor"
          :class="['btn-filtro', { activo: filtroActivo === f.valor }]"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- ── GRID DE ASIENTOS ───────────────────────────── -->
      <div v-if="asientosFiltrados.length === 0" style="color:#999; text-align:center; padding:20px">
        Sin asientos para mostrar
      </div>

      <div class="seat-grid">
        <div
          v-for="a in asientosFiltrados"
          :key="a.idAsiento"
          :class="['seat-card', estaDisponible(a) ? 'seat-disponible' : 'seat-ocupado']"
        >
          <!-- Número grande -->
          <div class="seat-numero">{{ a.numeroAsiento }}</div>

          <!-- Tags -->
          <div class="seat-tags">
            <span class="tag">{{ a.clase }}</span>
            <span v-if="a.posicion" class="tag">{{ a.posicion }}</span>
          </div>

          <!-- Precio extra -->
          <div v-if="a.precioExtra > 0" class="seat-precio">+${{ a.precioExtra }}</div>

          <!-- Estado -->
          <div :class="['seat-estado', estaDisponible(a) ? 'estado-disponible' : 'estado-ocupado']">
            {{ estaDisponible(a) ? '✅ Disponible' : '🔴 Ocupado' }}
          </div>

          <!-- Acciones -->
          <div class="seat-acciones">
            <button class="btn-sm" @click="editAsiento(a)">✏️</button>
            <button
              class="btn-sm"
              :class="estaDisponible(a) ? 'btn-danger' : 'btn-ok'"
              @click="toggleDisponibilidad(a)"
              :title="estaDisponible(a) ? 'Marcar como ocupado' : 'Marcar como disponible'"
            >
              {{ estaDisponible(a) ? 'Ocupar' : 'Liberar' }}
            </button>
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
const vuelos        = ref([])
const asientos      = ref([])
const selectedVuelo = ref(null)
const editingAsiento = ref(null)
const filtroActivo  = ref('TODOS')

const feedbackError   = ref('')
const feedbackSuccess = ref('')

const filtrosClase = [
  { label: 'Todos',     valor: 'TODOS'    },
  { label: 'Económica', valor: 'ECONOMICA'},
  { label: 'Ejecutiva', valor: 'EJECUTIVA'},
  { label: 'Primera',   valor: 'PRIMERA'  },
  { label: '✅ Disponibles', valor: 'DISPONIBLES' },
  { label: '🔴 Ocupados',    valor: 'OCUPADOS'    },
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

// ✅ Función helper: detecta disponibilidad sin importar si viene
//    como booleano true/false o string "true"/"false"
function estaDisponible(a) {
  return a.disponible === true || a.disponible === 'true'
}

const asientosFiltrados = computed(() => {
  if (filtroActivo.value === 'TODOS')        return asientos.value
  if (filtroActivo.value === 'DISPONIBLES')  return asientos.value.filter(a =>  estaDisponible(a))
  if (filtroActivo.value === 'OCUPADOS')     return asientos.value.filter(a => !estaDisponible(a))
  return asientos.value.filter(a => a.clase === filtroActivo.value)
})

const totalDisponibles = computed(() => asientos.value.filter(a =>  estaDisponible(a)).length)
const totalOcupados    = computed(() => asientos.value.filter(a => !estaDisponible(a)).length)

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(d) {
  return d ? d.replace('T', ' ').slice(0, 16) : ''
}

function setError(e) {
  feedbackSuccess.value = ''
  if (e.response?.data?.errors) {
    feedbackError.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    feedbackError.value = e.response?.data?.message || e.response?.data?.title || e.message
  }
  console.error('API error:', e.response?.data ?? e)
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
    // ✅ Soporta { data: [...] } o array directo
    const lista = res.data.data ?? res.data ?? []
    asientos.value = Array.isArray(lista) ? lista : []
    console.log('Asientos recibidos:', asientos.value)
  } catch (e) { setError(e) }
}

// ── Editar ────────────────────────────────────────────────────────
function editAsiento(a) {
  editingAsiento.value       = a
  asientoForm.numeroAsiento  = a.numeroAsiento
  asientoForm.clase          = a.clase
  asientoForm.posicion       = a.posicion       ?? ''
  asientoForm.precioExtra    = a.precioExtra    ?? 0
  asientoForm.disponible     = estaDisponible(a)
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

  console.log('🚀 payload asiento:', payload)

  try {
    if (editingAsiento.value) {
      await api.patch(
        `/vuelos/${selectedVuelo.value.idVuelo}/asientos/${editingAsiento.value.idAsiento}`,
        payload
      )
      setSuccess(`Asiento ${payload.numeroAsiento} actualizado ✅`)
    } else {
      await api.post(
        `/vuelos/${selectedVuelo.value.idVuelo}/asientos`,
        payload
      )
      setSuccess(`Asiento ${payload.numeroAsiento} creado ✅`)
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
        posicion:      a.posicion ?? null
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

<style scoped>
.admin-page  { padding: 20px; font-family: sans-serif }
.panel       { margin: 20px 0; padding: 16px; border: 1px solid #ddd; border-radius: 10px }
.subpanel    { background: #f9f9f9; border-radius: 8px; padding: 14px; margin: 14px 0 }
.grid        { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px }
.tabla       { width: 100%; border-collapse: collapse }
.tabla th,
.tabla td    { border: 1px solid #ccc; padding: 8px; font-size: 13px }
.tabla thead { background: #f0f0f0 }
.fila-activa { background: #e8f4ff }
.error       { color: red;   font-weight: bold }
.success     { color: green; font-weight: bold }

/* Resumen */
.resumen       { display: flex; gap: 20px; margin: 12px 0 }
.resumen-item  { text-align: center; padding: 10px 20px; border-radius: 8px; background: #f5f5f5 }
.resumen-num   { display: block; font-size: 24px; font-weight: bold }
.resumen-label { font-size: 12px; color: #666 }

/* Filtros */
.btn-filtro        { padding: 6px 14px; border: 1px solid #ccc; border-radius: 20px; background: #fff; cursor: pointer; font-size: 13px }
.btn-filtro.activo { background: #2563eb; color: #fff; border-color: #2563eb }

/* Grid de asientos */
.seat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 12px }

.seat-card {
  border-radius: 10px;
  padding: 12px;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.seat-disponible { background: #f0fdf4; border-color: #86efac }
.seat-ocupado    { background: #fff1f2; border-color: #fca5a5 }

.seat-numero { font-size: 22px; font-weight: bold; text-align: center }

.seat-tags { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center }
.tag       { background: #e5e7eb; border-radius: 4px; padding: 1px 6px; font-size: 11px }

.seat-precio { text-align: center; color: #059669; font-size: 12px; font-weight: 600 }

.seat-estado        { text-align: center; font-size: 12px; font-weight: 600; padding: 2px 0 }
.estado-disponible  { color: #16a34a }
.estado-ocupado     { color: #dc2626 }

.seat-acciones { display: flex; gap: 4px; margin-top: 4px }
.btn-sm        { flex: 1; padding: 4px 0; font-size: 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc }
.btn-danger    { background: #fee2e2; border-color: #fca5a5; color: #991b1b }
.btn-ok        { background: #dcfce7; border-color: #86efac; color: #166534 }

.badge { font-size: 16px }
.badge-disponible { color: #16a34a }
.badge-ocupado    { color: #dc2626 }
</style>