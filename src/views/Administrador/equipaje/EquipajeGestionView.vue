<template>
  <section class="admin-page">

    <h1>Boletos 🎫</h1>

    <p v-if="errorMsg"   class="error">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <!-- ══════════════════════════════════════════════
         FORMULARIO NUEVO BOLETO
    ══════════════════════════════════════════════ -->
    <div class="panel">
      <h3>Emitir boleto</h3>
      <p class="subtitle">
        El boleto confirma el derecho a viajar. El precio se calcula automáticamente.
        El cargo de equipaje inicia en <strong>$0</strong> y se suma al agregar equipaje después.
      </p>

      <form @submit.prevent="submitBoleto" class="grid">

        <!-- RESERVA -->
        <div>
          <label>Reserva *</label>
          <select v-model="form.idReserva" @change="onReservaChange" style="width:100%" required>
            <option value="">-- Selecciona reserva --</option>
            <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
              {{ r.codigoReserva || `Reserva #${r.idReserva}` }}
            </option>
          </select>
        </div>

        <!-- FACTURA -->
        <div>
          <label>Factura *</label>
          <select v-model="form.idFactura" style="width:100%" required>
            <option value="">-- Selecciona factura --</option>
            <option v-for="f in facturasFiltradas" :key="f.idFactura" :value="f.idFactura">
              {{ f.numeroFactura || `Factura #${f.idFactura}` }}
            </option>
          </select>
        </div>

        <!-- VUELO -->
        <div>
          <label>Vuelo *</label>
          <select v-model="form.idVuelo" @change="onVueloChange" style="width:100%" required>
            <option value="">-- Selecciona vuelo --</option>
            <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
              {{ v.numeroVuelo }}
            </option>
          </select>
        </div>

        <!-- ASIENTO — NO obligatorio -->
        <div>
          <label>Asiento <span style="color:#999;font-weight:400">(opcional)</span></label>
          <select
            v-model="form.idAsiento"
            @change="onAsientoChange"
            style="width:100%"
            :disabled="!form.idVuelo || cargandoAsientos"
          >
            <option value="">{{ cargandoAsientos ? 'Cargando...' : '-- Sin asiento --' }}</option>
            <option v-for="a in asientosDisponibles" :key="a.idAsiento" :value="a.idAsiento">
              {{ a.numeroAsiento }} — {{ a.clase }}{{ a.posicion ? ' · ' + a.posicion : '' }}{{ a.precioExtra > 0 ? ' (+$' + a.precioExtra + ')' : '' }}
            </option>
          </select>
          <small v-if="!form.idVuelo" style="color:#999">Selecciona un vuelo primero</small>
          <small v-else-if="asientosDisponibles.length === 0 && !cargandoAsientos" style="color:#dc2626">Sin asientos disponibles</small>
          <small v-else style="color:#16a34a">{{ asientosDisponibles.length }} disponible(s)</small>
        </div>

        <!-- CLASE -->
        <div>
          <label>Clase *</label>
          <select v-model="form.clase" style="width:100%" required>
            <option value="ECONOMICA">Económica</option>
            <option value="EJECUTIVA">Ejecutiva</option>
            <option value="PRIMERA">Primera</option>
          </select>
        </div>

        <!-- SEPARADOR resumen de precios -->
        <div style="grid-column: span 3">
          <hr style="border:none;border-top:1px solid #eee;margin:8px 0" />
          <p style="font-size:13px;color:#666;margin:0 0 8px">Resumen de precios (calculado automáticamente)</p>
        </div>

        <!-- PRECIO VUELO BASE -->
        <div>
          <label>Precio vuelo base</label>
          <input :value="`$${form.precioVueloBase.toFixed(2)}`" disabled style="width:100%;background:#f9f9f9" />
        </div>

        <!-- PRECIO ASIENTO EXTRA -->
        <div>
          <label>Extra asiento</label>
          <input :value="`$${form.precioAsientoExtra.toFixed(2)}`" disabled style="width:100%;background:#f9f9f9" />
        </div>

        <!-- IMPUESTOS 15% -->
        <div>
          <label>Impuestos (15% automático)</label>
          <input :value="`$${form.impuestosBoleto.toFixed(2)}`" disabled style="width:100%;background:#f0f9ff" />
        </div>

        <!-- CARGO EQUIPAJE -->
        <div>
          <label>Cargo equipaje</label>
          <input :value="`$${form.cargoEquipaje.toFixed(2)}`" disabled style="width:100%;background:#f9f9f9" />
          <small style="color:#999">Se actualizará al agregar equipaje</small>
        </div>

        <!-- PRECIO FINAL -->
        <div style="grid-column: span 2">
          <label>Precio final</label>
          <input
            :value="`$${form.precioFinal.toFixed(2)}`"
            disabled
            style="width:100%;background:#f0fdf4;font-weight:bold;font-size:16px;color:#166534"
          />
          <small style="color:#16a34a">= vuelo + asiento extra + impuestos 15% + cargo equipaje</small>
        </div>

        <div style="grid-column: span 3; display:flex; gap:10px; margin-top:8px">
          <button type="submit" :disabled="loadingSubmit">
            {{ loadingSubmit ? 'Guardando...' : '🎫 Emitir boleto' }}
          </button>
          <button type="button" @click="resetForm" style="background:#999">Cancelar</button>
        </div>

      </form>
    </div>

    <!-- ══════════════════════════════════════════════
         FILTROS
    ══════════════════════════════════════════════ -->
    <div class="panel">
      <h3>Buscar boletos</h3>
      <div class="grid">
        <input v-model="filtros.CodigoBoleto" placeholder="Código boleto" />

        <select v-model="filtros.IdReserva">
          <option value="">Todas las reservas</option>
          <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
            {{ r.codigoReserva || `Reserva #${r.idReserva}` }}
          </option>
        </select>

        <select v-model="filtros.IdVuelo">
          <option value="">Todos los vuelos</option>
          <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
            {{ v.numeroVuelo }}
          </option>
        </select>

        <select v-model="filtros.Clase">
          <option value="">Todas las clases</option>
          <option value="ECONOMICA">Económica</option>
          <option value="EJECUTIVA">Ejecutiva</option>
          <option value="PRIMERA">Primera</option>
        </select>

        <select v-model="filtros.EstadoBoleto">
          <option value="">Todos los estados</option>
          <option value="ACTIVO">ACTIVO</option>
          <option value="USADO">USADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>

        <div style="display:flex;align-items:flex-end;gap:8px">
          <button @click="fetchBoletos" :disabled="loadingList">
            {{ loadingList ? 'Cargando...' : '🔍 Buscar' }}
          </button>
          <button @click="limpiarFiltros" style="background:#999">Limpiar</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         TABLA BOLETOS
    ══════════════════════════════════════════════ -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Código</th>
          <th>Reserva</th>
          <th>Vuelo</th>
          <th>Asiento</th>
          <th>Clase</th>
          <th>Vuelo base</th>
          <th>Asiento extra</th>
          <th>Impuestos</th>
          <th>Equipaje</th>
          <th>Total</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loadingList">
          <td colspan="12" style="text-align:center">Cargando...</td>
        </tr>
        <tr v-else-if="boletos.length === 0">
          <td colspan="12" style="text-align:center;color:#999">Sin boletos registrados</td>
        </tr>
        <tr v-for="b in boletos" :key="b.idBoleto">
          <td>
            <strong>{{ b.codigoBoleto || `#${b.idBoleto}` }}</strong><br>
            <small style="color:#999">{{ formatDate(b.fechaEmision) }}</small>
          </td>
          <td>{{ getReservaNombre(b.idReserva) }}</td>
          <td>{{ getVueloNombre(b.idVuelo) }}</td>
          <td>#{{ b.idAsiento || '—' }}</td>
          <td>{{ b.clase }}</td>
          <td>${{ Number(b.precioVueloBase    || 0).toFixed(2) }}</td>
          <td>${{ Number(b.precioAsientoExtra || 0).toFixed(2) }}</td>
          <td>${{ Number(b.impuestosBoleto    || 0).toFixed(2) }}</td>
          <td>${{ Number(b.cargoEquipaje      || 0).toFixed(2) }}</td>
          <td><strong>${{ Number(b.precioFinal || 0).toFixed(2) }}</strong></td>
          <td>
            <span :class="['badge', `badge-${(b.estadoBoleto||'').toLowerCase()}`]">
              {{ b.estadoBoleto }}
            </span>
          </td>
          <td>
            <button class="btn-sm" @click="verDetalle(b)" title="Ver detalle">👁️</button>
            <button class="btn-sm" @click="verEquipaje(b)" title="Gestionar equipaje">🧳</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="paginacion">
      <button :disabled="page <= 1 || loadingList" @click="cambiarPagina(page - 1)">← Anterior</button>
      <span>Página {{ page }} de {{ totalPaginas }}</span>
      <button :disabled="page >= totalPaginas || loadingList" @click="cambiarPagina(page + 1)">Siguiente →</button>
    </div>

    <!-- ══════════════════════════════════════════════
         MODAL DETALLE
    ══════════════════════════════════════════════ -->
    <div v-if="detalleBoleto" class="modal-overlay" @click.self="detalleBoleto = null">
      <div class="modal">
        <h3>Detalle — {{ detalleBoleto.codigoBoleto || `Boleto #${detalleBoleto.idBoleto}` }}</h3>
        <table class="tabla">
          <tr v-for="(val, key) in detalleBoleto" :key="key">
            <td><strong>{{ key }}</strong></td>
            <td>{{ val }}</td>
          </tr>
        </table>
        <button @click="detalleBoleto = null" style="margin-top:10px;background:#999">Cerrar</button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         MODAL EQUIPAJE
    ══════════════════════════════════════════════ -->
    <div v-if="boletoEquipaje" class="modal-overlay" @click.self="cerrarEquipaje">
      <div class="modal">
        <h3>🧳 Equipaje — {{ boletoEquipaje.codigoBoleto || `Boleto #${boletoEquipaje.idBoleto}` }}</h3>
        <p class="subtitle">
          Al agregar equipaje se generará una factura adicional por ese costo y se actualizará el cargo en el boleto.
        </p>

        <!-- Form agregar equipaje -->
        <div class="subpanel">
          <h4>Agregar pieza</h4>
          <div class="grid">
            <div>
              <label>Tipo *</label>
              <select v-model="equipajeForm.tipo" style="width:100%">
                <option value="MANO">Mano</option>
                <option value="BODEGA">Bodega</option>
                <option value="ESPECIAL">Especial</option>
              </select>
              <small v-if="equipajeForm.tipo === 'MANO'" style="color:#d97706">⚠️ Máx 10 kg</small>
            </div>

            <div>
              <label>Peso (kg) *</label>
              <input
                v-model.number="equipajeForm.pesoKg"
                type="number" min="0.01" step="0.01"
                style="width:100%"
                :style="equipajeForm.tipo === 'MANO' && equipajeForm.pesoKg > 10 ? 'border-color:#f59e0b' : ''"
              />
            </div>

            <!-- precioExtra eliminado: el backend lo calcula automáticamente -->

            <div>
              <label>Dimensiones (cm)</label>
              <input v-model="equipajeForm.dimensionesCm" placeholder="55x40x20" style="width:100%" />
            </div>

            <div style="grid-column: span 2">
              <label>Descripción</label>
              <input v-model="equipajeForm.descripcionEquipaje" placeholder="Maleta gris con cinta azul" style="width:100%" />
            </div>

            <div style="display:flex;align-items:flex-end">
              <button @click="submitEquipaje" :disabled="loadingEquipaje" style="width:100%">
                {{ loadingEquipaje ? 'Guardando...' : '➕ Agregar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla equipaje existente -->
        <table class="tabla">
          <thead>
            <tr>
              <th>Etiqueta</th>
              <th>Tipo</th>
              <th>Peso</th>
              <th>Dimensiones</th>
              <th>Precio extra</th>
              <th>Estado</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="equipajes.length === 0">
              <td colspan="7" style="text-align:center;color:#999">Sin equipaje registrado</td>
            </tr>
            <tr v-for="e in equipajes" :key="e.idEquipaje">
              <td><strong>{{ e.numeroEtiqueta || `EQ-${e.idEquipaje}` }}</strong></td>
              <td>{{ e.tipo }}</td>
              <td>{{ Number(e.pesoKg).toFixed(2) }} kg</td>
              <td>{{ e.dimensionesCm || '—' }}</td>
              <td>${{ Number(e.precioExtra || 0).toFixed(2) }}</td>
              <td>
                <select :value="e.estadoEquipaje" @change="cambiarEstadoEquipaje(e, $event.target.value)">
                  <option value="REGISTRADO">REGISTRADO</option>
                  <option value="EMBARCADO">EMBARCADO</option>
                  <option value="EN_TRANSITO">EN_TRANSITO</option>
                  <option value="ENTREGADO">ENTREGADO</option>
                  <option value="PERDIDO">PERDIDO</option>
                  <option value="DAÑADO">DAÑADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
              <td>{{ e.descripcionEquipaje || '—' }}</td>
            </tr>
          </tbody>
        </table>

        <button @click="cerrarEquipaje" style="margin-top:12px;background:#999">Cerrar</button>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/axios'

// ── Estado ────────────────────────────────────────────────────────
const reservas         = ref([])
const facturas         = ref([])
const vuelos           = ref([])
const asientosVuelo    = ref([])
const boletos          = ref([])
const equipajes        = ref([])

const detalleBoleto    = ref(null)
const boletoEquipaje   = ref(null)
const cargandoAsientos = ref(false)
const loadingList      = ref(false)
const loadingSubmit    = ref(false)
const loadingEquipaje  = ref(false)

const errorMsg   = ref('')
const successMsg = ref('')

const page         = ref(1)
const pageSize     = 10
const totalPaginas = ref(1)

// ── Formulario boleto ─────────────────────────────────────────────
const form = reactive({
  idReserva:          '',
  idVuelo:            '',
  idAsiento:          '',   // opcional
  idFactura:          '',
  clase:              'ECONOMICA',
  precioVueloBase:    0,
  precioAsientoExtra: 0,
  impuestosBoleto:    0,
  cargoEquipaje:      0,
  precioFinal:        0
})

// ── Formulario equipaje ───────────────────────────────────────────
const equipajeForm = reactive({
  tipo:                'MANO',
  pesoKg:              0,
  // precioExtra eliminado: el backend lo calcula automáticamente
  dimensionesCm:       '',
  descripcionEquipaje: ''
})

// ── Filtros ───────────────────────────────────────────────────────
const filtros = reactive({
  CodigoBoleto: '',
  IdReserva:    '',
  IdVuelo:      '',
  Clase:        '',
  EstadoBoleto: ''
})

// ── Computed ──────────────────────────────────────────────────────
const facturasFiltradas = computed(() => {
  if (!form.idReserva) return facturas.value
  return facturas.value.filter(f => String(f.idReserva) === String(form.idReserva))
})

const asientosDisponibles = computed(() =>
  asientosVuelo.value.filter(a => a.disponible === true || a.disponible === 'true')
)

// ── Mensajes ──────────────────────────────────────────────────────
function setError(e) {
  successMsg.value = ''
  if (e.response?.data?.errors) {
    errorMsg.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    errorMsg.value = e.response?.data?.message || e.response?.data?.title || e.message
  }
  console.error('API error:', e.response?.data ?? e)
}

function setSuccess(msg) {
  errorMsg.value   = ''
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 3000)
}

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(d) {
  return d ? String(d).replace('T', ' ').slice(0, 16) : '—'
}

function getReservaNombre(id) {
  const r = reservas.value.find(r => r.idReserva === id)
  return r ? (r.codigoReserva || `Reserva #${id}`) : `#${id}`
}

function getVueloNombre(id) {
  const v = vuelos.value.find(v => v.idVuelo === id)
  return v ? v.numeroVuelo : `#${id}`
}

// ── Cálculo automático ────────────────────────────────────────────
function recalcular() {
  const base           = (form.precioVueloBase || 0) + (form.precioAsientoExtra || 0)
  form.impuestosBoleto = +(base * 0.15).toFixed(2)
  form.cargoEquipaje   = 0
  form.precioFinal     = +(base + form.impuestosBoleto).toFixed(2)
}

// ── Al elegir reserva ─────────────────────────────────────────────
function onReservaChange() {
  const r = reservas.value.find(r => r.idReserva == form.idReserva)
  if (r) {
    form.idVuelo            = r.idVuelo   ?? ''
    form.idAsiento          = r.idAsiento ?? ''
    form.precioVueloBase    = r.subtotalReserva ?? r.precioBase ?? 0
    form.precioAsientoExtra = 0
    recalcular()
    if (form.idVuelo) fetchAsientosVuelo()
  }
}

// ── Al elegir vuelo ───────────────────────────────────────────────
async function onVueloChange() {
  form.idAsiento          = ''
  form.precioAsientoExtra = 0
  asientosVuelo.value     = []

  const v = vuelos.value.find(v => v.idVuelo == form.idVuelo)
  if (v) {
    form.precioVueloBase = v.precioBase ?? 0
    recalcular()
  }
  await fetchAsientosVuelo()
}

// ── Al elegir asiento ─────────────────────────────────────────────
function onAsientoChange() {
  const a = asientosVuelo.value.find(a => a.idAsiento == form.idAsiento)
  if (a) {
    form.precioAsientoExtra = a.precioExtra ?? 0
    form.clase              = a.clase       ?? form.clase
    recalcular()
  } else {
    form.precioAsientoExtra = 0
    recalcular()
  }
}

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchAll() {
  try {
    const [rr, rf, rv] = await Promise.all([
      api.get('/reservas', { params: { page: 1, page_size: 500 } }),
      api.get('/facturas', { params: { page: 1, page_size: 500 } }),
      api.get('/vuelos',   { params: { page: 1, page_size: 500 } })
    ])
    reservas.value = rr.data.data ?? rr.data ?? []
    facturas.value = rf.data.data ?? rf.data ?? []
    vuelos.value   = rv.data.data ?? rv.data ?? []
    fetchBoletos()
  } catch (e) { setError(e) }
}

async function fetchAsientosVuelo() {
  if (!form.idVuelo) return
  cargandoAsientos.value = true
  asientosVuelo.value    = []
  try {
    const res = await api.get(`/vuelos/${form.idVuelo}/asientos`)
    asientosVuelo.value = res.data.data ?? res.data ?? []
  } catch (e) { setError(e) }
  finally { cargandoAsientos.value = false }
}

async function fetchBoletos() {
  loadingList.value = true
  try {
    const params = { Page: page.value, PageSize: pageSize }
    if (filtros.CodigoBoleto) params.CodigoBoleto = filtros.CodigoBoleto
    if (filtros.IdReserva)    params.IdReserva    = Number(filtros.IdReserva)
    if (filtros.IdVuelo)      params.IdVuelo      = Number(filtros.IdVuelo)
    if (filtros.Clase)        params.Clase        = filtros.Clase
    if (filtros.EstadoBoleto) params.EstadoBoleto = filtros.EstadoBoleto

    const res = await api.get('/boletos', { params })
    boletos.value      = res.data.data       ?? res.data ?? []
    totalPaginas.value = res.data.totalPages ?? res.data.meta?.totalPages ?? 1
  } catch (e) { setError(e) }
  finally { loadingList.value = false }
}

// ── Crear boleto ──────────────────────────────────────────────────
async function submitBoleto() {
  errorMsg.value = ''

  if (!form.idReserva || !form.idVuelo || !form.idFactura) {
    errorMsg.value = 'Reserva, vuelo y factura son obligatorios'
    return
  }

  loadingSubmit.value = true
  try {
    const payload = {
      idReserva:          Number(form.idReserva),
      idVuelo:            Number(form.idVuelo),
      idAsiento:          form.idAsiento ? Number(form.idAsiento) : null,
      idFactura:          Number(form.idFactura),
      clase:              form.clase,
      precioVueloBase:    Number(form.precioVueloBase),
      precioAsientoExtra: Number(form.precioAsientoExtra),
      impuestosBoleto:    Number(form.impuestosBoleto),
      cargoEquipaje:      0,
      precioFinal:        Number(form.precioFinal)
    }
    console.log('🚀 POST /boletos:', payload)
    await api.post('/boletos', payload)
    setSuccess('Boleto emitido ✅')
    resetForm()
    fetchBoletos()
  } catch (e) { setError(e) }
  finally { loadingSubmit.value = false }
}

// ── Detalle ───────────────────────────────────────────────────────
async function verDetalle(b) {
  try {
    const res = await api.get(`/boletos/${b.idBoleto}`)
    detalleBoleto.value = res.data.data ?? res.data
  } catch (e) { setError(e) }
}

// ── Equipaje ──────────────────────────────────────────────────────
async function verEquipaje(b) {
  boletoEquipaje.value = b
  resetEquipajeForm()
  await fetchEquipaje(b.idBoleto)
}

async function fetchEquipaje(idBoleto) {
  try {
    const res = await api.get(`/boletos/${idBoleto}/equipaje`)
    equipajes.value = res.data.data ?? res.data ?? []
  } catch (e) {
    equipajes.value = []
    setError(e)
  }
}

async function submitEquipaje() {
  if (!equipajeForm.pesoKg || equipajeForm.pesoKg <= 0) {
    errorMsg.value = 'El peso es obligatorio'
    return
  }
  loadingEquipaje.value = true
  try {
    await api.post(`/boletos/${boletoEquipaje.value.idBoleto}/equipaje`, {
      idBoleto:            boletoEquipaje.value.idBoleto,
      tipo:                equipajeForm.tipo,
      pesoKg:              Number(equipajeForm.pesoKg),
      descripcionEquipaje: equipajeForm.descripcionEquipaje || null,
      precioExtra:         0,   // calculado por el backend
      dimensionesCm:       equipajeForm.dimensionesCm || null
    })
    setSuccess('Equipaje agregado ✅')
    resetEquipajeForm()
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
    fetchBoletos()
  } catch (e) { setError(e) }
  finally { loadingEquipaje.value = false }
}

async function cambiarEstadoEquipaje(e, nuevoEstado) {
  if (nuevoEstado === e.estadoEquipaje) return
  try {
    await api.patch(
      `/boletos/${boletoEquipaje.value.idBoleto}/equipaje/${e.idEquipaje}/estado`,
      { estadoEquipaje: nuevoEstado }
    )
    setSuccess(`Estado → ${nuevoEstado}`)
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
  } catch (err) { setError(err) }
}

function cerrarEquipaje() {
  boletoEquipaje.value = null
  equipajes.value      = []
  resetEquipajeForm()
}

// ── Paginación / filtros ──────────────────────────────────────────
function cambiarPagina(n) { page.value = n; fetchBoletos() }

function limpiarFiltros() {
  Object.keys(filtros).forEach(k => { filtros[k] = '' })
  page.value = 1
  fetchBoletos()
}

// ── Reset ─────────────────────────────────────────────────────────
function resetForm() {
  form.idReserva          = ''
  form.idVuelo            = ''
  form.idAsiento          = ''
  form.idFactura          = ''
  form.clase              = 'ECONOMICA'
  form.precioVueloBase    = 0
  form.precioAsientoExtra = 0
  form.impuestosBoleto    = 0
  form.cargoEquipaje      = 0
  form.precioFinal        = 0
  asientosVuelo.value     = []
}

function resetEquipajeForm() {
  equipajeForm.tipo                = 'MANO'
  equipajeForm.pesoKg              = 0
  // precioExtra eliminado del form
  equipajeForm.dimensionesCm       = ''
  equipajeForm.descripcionEquipaje = ''
}

onMounted(fetchAll)
</script>

<style scoped>
.admin-page  { padding: 20px; font-family: sans-serif }
.panel       { margin: 20px 0; padding: 16px; border: 1px solid #ddd; border-radius: 10px }
.subpanel    { background: #f9f9f9; border-radius: 8px; padding: 14px; margin-bottom: 14px }
.subtitle    { color: #666; font-size: 13px; margin: 0 0 10px }
.grid        { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px }
.tabla       { width: 100%; margin-top: 10px; border-collapse: collapse }
.tabla th,
.tabla td    { border: 1px solid #ccc; padding: 8px; font-size: 13px }
.tabla thead { background: #f5f5f5 }
.error       { color: red;   font-weight: bold }
.success     { color: green; font-weight: bold }

.badge           { padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600 }
.badge-activo    { background: #dcfce7; color: #166534 }
.badge-usado     { background: #dbeafe; color: #1e40af }
.badge-cancelado { background: #fee2e2; color: #991b1b }

.btn-sm    { padding: 4px 8px; font-size: 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; margin: 0 2px }
.paginacion { display:flex; gap:12px; align-items:center; justify-content:center; margin-top:16px }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center; z-index: 999;
}
.modal {
  background: #fff; border-radius: 10px; padding: 24px;
  max-width: 750px; width: 95%; max-height: 85vh; overflow-y: auto;
}
</style>