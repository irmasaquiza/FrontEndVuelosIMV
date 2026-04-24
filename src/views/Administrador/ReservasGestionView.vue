<template>
  <section class="admin-page">

    <h1>Reservas ✈️</h1>

    <p v-if="feedbackError"   class="error">{{ feedbackError }}</p>
    <p v-if="feedbackSuccess" class="success">{{ feedbackSuccess }}</p>

    <!-- ══════════════════════════════════════════════
         FORMULARIO NUEVA RESERVA
    ══════════════════════════════════════════════ -->
    <div class="panel">
      <h3>Nueva reserva</h3>

      <form @submit.prevent="submitReserva" class="grid">

        <!-- CLIENTE -->
        <div>
          <label>Cliente</label>
          <select v-model="form.idCliente" @change="onClienteChange" style="width:100%">
            <option value="">-- Cliente --</option>
            <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
              {{ c.nombres }} {{ c.apellidos }}
            </option>
          </select>
        </div>

        <!-- PASAJERO -->
        <div>
          <label>Pasajero</label>
          <select v-model="form.idPasajero" style="width:100%">
            <option value="">-- Pasajero --</option>
            <option v-for="p in pasajeros" :key="p.idPasajero" :value="p.idPasajero">
              {{ p.nombrePasajero }} {{ p.apellidoPasajero }}
            </option>
          </select>
        </div>

        <!-- VUELO -->
        <div>
          <label>Vuelo</label>
          <select v-model="form.idVuelo" @change="onVueloChange" style="width:100%">
            <option value="">-- Vuelo --</option>
            <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
              {{ v.numeroVuelo }} — {{ getAeropuerto(v.idAeropuertoOrigen) }} → {{ getAeropuerto(v.idAeropuertoDestino) }}
            </option>
          </select>
        </div>

        <!-- ASIENTO — solo disponibles -->
        <div>
          <label>Asiento</label>
          <select v-model="form.idAsiento" style="width:100%" :disabled="!form.idVuelo || cargandoAsientos" @change="calcularPrecios">
            <option value="">
              {{ cargandoAsientos ? 'Cargando...' : asientos.length === 0 && form.idVuelo ? 'Sin asientos disponibles' : '-- Asiento --' }}
            </option>
            <option v-for="a in asientos" :key="a.idAsiento" :value="a.idAsiento">
              {{ a.numeroAsiento }} — {{ a.clase }}{{ a.posicion ? ' · ' + a.posicion : '' }}{{ a.precioExtra > 0 ? ' (+$' + a.precioExtra + ')' : '' }}
            </option>
          </select>
          <small v-if="!form.idVuelo" style="color:#999">Selecciona un vuelo primero</small>
          <!-- ✅ Muestra cuántos asientos disponibles hay -->
          <small v-else-if="!cargandoAsientos" style="color:#16a34a; font-weight:600">
            {{ asientos.length }} asiento(s) disponible(s)
          </small>
        </div>

        <!-- FECHAS (auto) -->
        <div>
          <label>Fecha inicio reserva</label>
          <input :value="form.fechaInicio" type="datetime-local" disabled style="width:100%" />
        </div>
        <div>
          <label>Fecha fin reserva</label>
          <input :value="form.fechaFin" type="datetime-local" disabled style="width:100%" />
        </div>

        <!-- PRECIOS (auto) -->
        <div>
          <label>Subtotal</label>
          <input :value="form.subtotalReserva" type="number" disabled style="width:100%" />
        </div>
        <div>
          <label>IVA 15%</label>
          <input :value="form.valorIva" type="number" disabled style="width:100%" />
        </div>
        <div>
          <label>Total</label>
          <input :value="form.totalReserva" type="number" disabled style="width:100%" />
        </div>

        <!-- OTROS -->
        <div>
          <label>Canal</label>
          <input v-model="form.origenCanalReserva" style="width:100%" />
        </div>
        <div>
          <label>Email contacto</label>
          <input v-model="form.contactoEmail" style="width:100%" />
        </div>
        <div>
          <label>Teléfono contacto</label>
          <input v-model="form.contactoTelefono" style="width:100%" />
        </div>
        <div style="grid-column: span 3">
          <label>Observaciones</label>
          <input v-model="form.observaciones" style="width:100%" />
        </div>

        <div style="grid-column: span 3">
          <button type="submit">Crear reserva</button>
        </div>

      </form>
    </div>

    <!-- ══════════════════════════════════════════════
         FILTROS
    ══════════════════════════════════════════════ -->
    <div class="panel">
      <h3>Buscar reservas</h3>

      <div class="grid">
        <input v-model="filtros.CodigoReserva" placeholder="Código reserva" />

        <select v-model="filtros.IdCliente">
          <option value="">Todos los clientes</option>
          <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
            {{ c.nombres }} {{ c.apellidos }}
          </option>
        </select>

        <select v-model="filtros.IdVuelo">
          <option value="">Todos los vuelos</option>
          <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
            {{ v.numeroVuelo }}
          </option>
        </select>

        <select v-model="filtros.EstadoReserva">
          <option value="">Todos los estados</option>
          <option v-for="e in estadosReserva" :key="e">{{ e }}</option>
        </select>

        <input v-model="filtros.OrigenCanalReserva" placeholder="Canal (WEB, APP...)" />

        <input v-model.number="filtros.TotalMin" type="number" placeholder="Total mínimo" />
        <input v-model.number="filtros.TotalMax" type="number" placeholder="Total máximo" />

        <div style="grid-column: span 3; display:flex; gap:10px">
          <button @click="fetchReservas">🔍 Buscar</button>
          <button @click="limpiarFiltros" style="background:#999">Limpiar</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         TABLA RESERVAS
    ══════════════════════════════════════════════ -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Código</th>
          <th>Cliente</th>
          <th>Vuelo</th>
          <th>Asiento</th>
          <th>Total</th>
          <th>Canal</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="reservas.length === 0">
          <td colspan="8" style="text-align:center;color:#999">Sin reservas</td>
        </tr>
        <tr v-for="r in reservas" :key="r.idReserva">
          <td>{{ r.codigoReserva }}</td>
          <td>{{ getNombreCliente(r.idCliente) }}</td>
          <td>{{ getNumeroVuelo(r.idVuelo) }}</td>
          <td>{{ r.idAsiento }}</td>
          <td>${{ r.totalReserva?.toFixed(2) }}</td>
          <td>{{ r.origenCanalReserva }}</td>
          <td>
            <select :value="r.estadoReserva" @change="cambiarEstado(r, $event.target.value)">
              <option v-for="e in estadosReserva" :key="e">{{ e }}</option>
            </select>
          </td>
          <td>
            <button @click="verDetalle(r)">👁️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ══════════════════════════════════════════════
         MODAL DETALLE
    ══════════════════════════════════════════════ -->
    <div v-if="detalleReserva" class="modal-overlay" @click.self="detalleReserva = null">
      <div class="modal">
        <h3>Detalle Reserva {{ detalleReserva.codigoReserva }}</h3>
        <table class="tabla">
          <tr v-for="(val, key) in detalleReserva" :key="key">
            <td><strong>{{ key }}</strong></td>
            <td>{{ val }}</td>
          </tr>
        </table>
        <button @click="detalleReserva = null" style="margin-top:10px">Cerrar</button>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

// ── Estado ────────────────────────────────────────────────────────
const clientes    = ref([])
const pasajeros   = ref([])
const vuelos      = ref([])
const aeropuertos = ref([])
const asientos    = ref([])   // ✅ Solo contendrá asientos disponibles
const reservas    = ref([])

const feedbackError    = ref('')
const feedbackSuccess  = ref('')
const detalleReserva   = ref(null)
const cargandoAsientos = ref(false)

const estadosReserva = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA']

// ── Formulario nueva reserva ──────────────────────────────────────
const form = reactive({
  idCliente:          '',
  idPasajero:         '',
  idVuelo:            '',
  idAsiento:          '',
  fechaInicio:        '',
  fechaFin:           '',
  subtotalReserva:    0,
  valorIva:           0,
  totalReserva:       0,
  origenCanalReserva: 'WEB',
  contactoEmail:      '',
  contactoTelefono:   '',
  observaciones:      ''
})

// ── Filtros ───────────────────────────────────────────────────────
const filtros = reactive({
  IdCliente:          '',
  IdVuelo:            '',
  CodigoReserva:      '',
  EstadoReserva:      '',
  OrigenCanalReserva: '',
  TotalMin:           '',
  TotalMax:           ''
})

// ── Helpers display ───────────────────────────────────────────────
function getNombreCliente(id) {
  const c = clientes.value.find(c => c.idCliente === id)
  return c ? `${c.nombres} ${c.apellidos}` : id
}

function getNumeroVuelo(id) {
  return vuelos.value.find(v => v.idVuelo === id)?.numeroVuelo ?? id
}

function getAeropuerto(id) {
  return aeropuertos.value.find(a => a.idAeropuerto === id)?.codigoIata ?? ''
}

// ── Mensajes ──────────────────────────────────────────────────────
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

// ── Auto-relleno cliente ──────────────────────────────────────────
function onClienteChange() {
  const c = clientes.value.find(c => c.idCliente == form.idCliente)
  if (c) {
    form.contactoEmail    = c.correo   ?? ''
    form.contactoTelefono = c.telefono ?? ''
  }
}

// ── Cálculo de precios ────────────────────────────────────────────
// ✅ Subtotal = precio vuelo + precioExtra del asiento elegido
function calcularPrecios() {
  const vuelo   = vuelos.value.find(v => v.idVuelo   == form.idVuelo)
  const asiento = asientos.value.find(a => a.idAsiento == form.idAsiento)

  const precioVuelo   = vuelo?.precioBase   ?? 0
  const precioAsiento = asiento?.precioExtra ?? 0

  form.subtotalReserva = +(precioVuelo + precioAsiento).toFixed(2)
  form.valorIva        = +(form.subtotalReserva * 0.15).toFixed(2)
  form.totalReserva    = +(form.subtotalReserva + form.valorIva).toFixed(2)
}

// ── Auto-relleno vuelo ────────────────────────────────────────────
function onVueloChange() {
  const v = vuelos.value.find(v => v.idVuelo == form.idVuelo)
  if (!v) return

  const now = new Date()
  form.fechaInicio = now.toISOString().slice(0, 16)
  form.fechaFin    = new Date(now.getTime() + 15 * 60000).toISOString().slice(0, 16)

  form.idAsiento = ''
  calcularPrecios()  // precio inicial sin asiento aún
  fetchAsientos()
}

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchAll() {
  try {
    const [rc, rp, rv, ra] = await Promise.all([
      api.get('/clientes',    { params: { page: 1, page_size: 100 } }),
      api.get('/pasajeros',   { params: { page: 1, page_size: 100 } }),
      api.get('/vuelos',      { params: { page: 1, page_size: 100 } }),
      api.get('/aeropuertos', { params: { page: 1, page_size: 200 } })
    ])
    clientes.value    = rc.data.data ?? []
    pasajeros.value   = rp.data.data ?? []
    vuelos.value      = rv.data.data ?? []
    aeropuertos.value = ra.data.data ?? []

    fetchReservas()
  } catch (e) { setError(e) }
}

// ✅ Trae todos los asientos del vuelo y filtra solo los disponibles
async function fetchAsientos() {
  if (!form.idVuelo) return
  cargandoAsientos.value = true
  asientos.value = []

  try {
    const res = await api.get(`/vuelos/${form.idVuelo}/asientos`)
    const todos = res.data.data ?? res.data ?? []

    // ✅ Filtramos disponibles — soporta booleano true o string "true"
    asientos.value = todos.filter(a => a.disponible === true || a.disponible === 'true')

    console.log(`Asientos totales: ${todos.length} | Disponibles: ${asientos.value.length}`)
  } catch (e) {
    setError(e)
  } finally {
    cargandoAsientos.value = false
  }
}

async function fetchReservas() {
  try {
    const params = { page: 1, page_size: 100 }
    if (filtros.IdCliente)          params.IdCliente          = Number(filtros.IdCliente)
    if (filtros.IdVuelo)            params.IdVuelo            = Number(filtros.IdVuelo)
    if (filtros.CodigoReserva)      params.CodigoReserva      = filtros.CodigoReserva
    if (filtros.EstadoReserva)      params.EstadoReserva      = filtros.EstadoReserva
    if (filtros.OrigenCanalReserva) params.OrigenCanalReserva = filtros.OrigenCanalReserva
    if (filtros.TotalMin !== '')    params.TotalMin           = filtros.TotalMin
    if (filtros.TotalMax !== '')    params.TotalMax           = filtros.TotalMax

    const res = await api.get('/reservas', { params })
    reservas.value = res.data.data ?? res.data ?? []
  } catch (e) { setError(e) }
}

// ── Crear reserva ─────────────────────────────────────────────────
async function submitReserva() {
  feedbackError.value = ''

  if (!form.idCliente || !form.idPasajero || !form.idVuelo || !form.idAsiento) {
    feedbackError.value = 'Cliente, pasajero, vuelo y asiento son obligatorios'
    return
  }

  try {
    const payload = {
      idCliente:          Number(form.idCliente),
      idPasajero:         Number(form.idPasajero),
      idVuelo:            Number(form.idVuelo),
      idAsiento:          Number(form.idAsiento),
      fechaInicio:        new Date(form.fechaInicio).toISOString(),
      fechaFin:           new Date(form.fechaFin).toISOString(),
      subtotalReserva:    Number(form.subtotalReserva),
      valorIva:           Number(form.valorIva),
      totalReserva:       Number(form.totalReserva),
      origenCanalReserva: form.origenCanalReserva,
      contactoEmail:      form.contactoEmail,
      contactoTelefono:   form.contactoTelefono,
      observaciones:      form.observaciones || null
    }

    console.log('🚀 POST /reservas:', payload)
    await api.post('/reservas', payload)
    setSuccess('Reserva creada ✅')
    resetForm()
    fetchReservas()
  } catch (e) { setError(e) }
}

// ── Cambiar estado ────────────────────────────────────────────────
async function cambiarEstado(reserva, nuevoEstado) {
  if (nuevoEstado === reserva.estadoReserva) return
  try {
    await api.patch(`/reservas/${reserva.idReserva}/estado`, {
      estadoReserva:     nuevoEstado,
      motivoCancelacion: nuevoEstado === 'CANCELADA' ? 'Cambio manual' : null
    })
    setSuccess(`Estado actualizado a ${nuevoEstado}`)
    fetchReservas()
  } catch (e) { setError(e) }
}

// ── Ver detalle ───────────────────────────────────────────────────
async function verDetalle(r) {
  try {
    const res = await api.get(`/reservas/${r.idReserva}`)
    detalleReserva.value = res.data.data ?? res.data
  } catch (e) { setError(e) }
}

// ── Reset ─────────────────────────────────────────────────────────
function resetForm() {
  form.idCliente          = ''
  form.idPasajero         = ''
  form.idVuelo            = ''
  form.idAsiento          = ''
  form.fechaInicio        = ''
  form.fechaFin           = ''
  form.subtotalReserva    = 0
  form.valorIva           = 0
  form.totalReserva       = 0
  form.origenCanalReserva = 'WEB'
  form.contactoEmail      = ''
  form.contactoTelefono   = ''
  form.observaciones      = ''
  asientos.value          = []
}

function limpiarFiltros() {
  Object.keys(filtros).forEach(k => { filtros[k] = '' })
  fetchReservas()
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(fetchAll)
</script>

<style scoped>
.admin-page  { padding: 20px; font-family: sans-serif }
.panel       { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 10px }
.grid        { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px }
.tabla       { width: 100%; margin-top: 10px; border-collapse: collapse }
.tabla th,
.tabla td    { border: 1px solid #ccc; padding: 8px; font-size: 13px }
.tabla thead { background: #f5f5f5 }
.error       { color: red;   font-weight: bold }
.success     { color: green; font-weight: bold }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
</style>