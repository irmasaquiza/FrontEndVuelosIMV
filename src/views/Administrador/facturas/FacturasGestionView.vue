<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de facturas</h1>
        <p class="mb-0" style="opacity:0.75;">Emite facturas para reservas y controla su estado de apertura o anulación.</p>
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

    <!-- ═══════════════ FORM NUEVA FACTURA ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Nueva factura</h2>
            <p class="text-muted small mb-0">Selecciona una reserva. El backend controla los montos y el estado financiero.</p>
          </div>
        </div>

        <form @submit.prevent="submitFactura">
          <div class="row g-3">

            <!-- Reserva -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Reserva *</label>
              <select v-model="form.idReserva"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Selecciona una reserva</option>
                <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
                  {{ r.codigoReserva || 'Reserva #' + r.idReserva }}
                </option>
              </select>
            </div>

            <!-- Cliente (autocompletado, readonly) -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Cliente
                <span class="text-muted fw-normal" style="font-size:0.68rem;"> — se completa automáticamente</span>
              </label>
              <select v-model="form.idCliente" disabled
                      class="form-select bg-light"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Sin cliente</option>
                <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
                  {{ c.nombres }} {{ c.apellidos }}
                </option>
              </select>
            </div>

            <!-- Canal / Observaciones -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Canal</label>
              <input v-model="form.origenCanalFactura" placeholder="WEB"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-8">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Observaciones</label>
              <input v-model="form.observacionesFactura" placeholder="Notas de la factura"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 d-flex justify-content-end pt-2">
              <button type="submit"
                      class="btn fw-bold rounded-pill px-5 text-white"
                      style="background:#d60f2b;min-height:44px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="white"/>
                </svg>
                Emitir factura
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>

    <!-- ═══════════════ TABLA FACTURAS ═══════════════ -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de facturas</h2>
            <p class="text-muted small mb-0">{{ facturas.length }} {{ facturas.length === 1 ? 'factura registrada' : 'facturas registradas' }}</p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Factura</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Reserva</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Subtotal</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">IVA</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Total</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!facturas.length">
                <td colspan="7" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#ddd"/>
                  </svg>
                  No hay facturas registradas.
                </td>
              </tr>
              <tr v-for="f in facturas" :key="f.idFactura">
                <td class="ps-4">
                  <div class="fw-bold small" style="color:#d60f2b;">
                    {{ f.numeroFactura || 'Factura #' + f.idFactura }}
                  </div>
                  <div class="text-muted" style="font-size:0.72rem;">
                    {{ f.origenCanalFactura || 'WEB' }}
                  </div>
                </td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ f.codigoReserva || '#' + f.idReserva }}
                  </span>
                </td>
                <td class="text-muted small">${{ Number(f.subtotal || 0).toFixed(2) }}</td>
                <td class="text-muted small">${{ Number(f.valorIva || 0).toFixed(2) }}</td>
                <td class="fw-bold" style="color:#d60f2b;">${{ Number(f.total || 0).toFixed(2) }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="estadoStyle(f.estado)">
                    {{ f.estado }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-2"
                          style="background:#dcfce7;color:#166534;border-radius:6px;"
                          :disabled="!canAprobarFactura(f)"
                          @click="aprobarFacturaItem(f)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#166534"/>
                    </svg>
                    Aprobar
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#fee2e2;color:#991b1b;border-radius:6px;"
                          :disabled="!canAnularFactura(f)"
                          @click="anularFactura(f)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#991b1b"/>
                    </svg>
                    Anular
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/api/axios'

const clientes = ref([])
const reservas = ref([])
const facturas = ref([])

const errorMsg  = ref('')
const successMsg = ref('')

const form = reactive({
  idCliente:            '',
  idReserva:            '',
  subtotal:             0,
  valorIva:             0,
  cargoServicio:        0,
  total:                0,
  observacionesFactura: '',
  origenCanalFactura:   'WEB'
})

// ── Helpers de estado ─────────────────────────────────────────────
function estadoStyle(estado) {
  const e = String(estado || '').toUpperCase()
  if (e === 'APROBADA') return 'background:#d1fae5;color:#065f46;'
  if (e === 'ANULADA')  return 'background:#fee2e2;color:#991b1b;'
  return 'background:#fef9c3;color:#854d0e;'
}

// ── Autocompletar desde reserva ───────────────────────────────────
watch(
  () => form.idReserva,
  () => {
    if (!form.idReserva) return
    const r = reservas.value.find(r => String(r.idReserva) === String(form.idReserva))
    console.log('RESERVA:', r)
    if (r) {
      form.idCliente     = r.idCliente
      form.subtotal      = 0
      form.valorIva      = 0
      form.cargoServicio = 0
      form.total         = 0
    }
  }
)

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchAll() {
  const [resClientes, resReservas] = await Promise.all([
    api.get('/clientes', { params: { page: 1, page_size: 100 } }),
    api.get('/reservas', { params: { page: 1, page_size: 100 } })
  ])
  console.log('RESERVAS LISTA:', resReservas.data)
  clientes.value = resClientes.data.data
  reservas.value = resReservas.data.data
  fetchFacturas()
}

async function fetchFacturas() {
  const res = await api.get('/facturas', { params: { page: 1, page_size: 50 } })
  facturas.value = res.data.data
}

// ── Create ────────────────────────────────────────────────────────
async function submitFactura() {
  try {
    const payload = {
      idCliente:            Number(form.idCliente),
      idReserva:            Number(form.idReserva),
      subtotal:             0,
      valorIva:             0,
      cargoServicio:        0,
      total:                0,
      observacionesFactura: form.observacionesFactura,
      origenCanalFactura:   form.origenCanalFactura
    }
    console.log('JSON FACTURA:', payload)
    await api.post('/facturas', payload)
    successMsg.value = 'Factura emitida correctamente'
    errorMsg.value   = ''
    fetchFacturas()
  } catch (e) {
    console.log(e)
    errorMsg.value   =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title ||
      e?.message ||
      'Ha ocurrido un error inesperado.'
    successMsg.value = ''
  }
}

// ── Aprobar / Anular ──────────────────────────────────────────────
async function aprobarFacturaItem(f) {
  try {
    await api.patch(`/facturas/${f.idFactura}/aprobar`, {})
    successMsg.value = 'Factura aprobada correctamente'
    errorMsg.value   = ''
    fetchFacturas()
  } catch (e) {
    errorMsg.value   =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title ||
      e?.message ||
      'Ha ocurrido un error inesperado.'
    successMsg.value = ''
  }
}

async function anularFactura(f) {
  try {
    await api.patch(`/facturas/${f.idFactura}/anular`, {})
    successMsg.value = 'Factura anulada correctamente'
    errorMsg.value   = ''
    fetchFacturas()
  } catch (e) {
    errorMsg.value   =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title ||
      e?.message ||
      'Ha ocurrido un error inesperado.'
    successMsg.value = ''
  }
}

function canAprobarFactura(f) {
  const e = String(f.estado || '').toUpperCase()
  return e !== 'ANULADA' && e !== 'APROBADA'
}

function canAnularFactura(f) {
  return String(f.estado || '').toUpperCase() !== 'ANULADA'
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(fetchAll)
</script>