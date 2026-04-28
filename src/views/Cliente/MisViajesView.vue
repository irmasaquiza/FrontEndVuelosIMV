<template>
  <div class="mis-viajes-shell">
    
    <!-- Navbar -->
    <header class="client-header-solid d-flex justify-content-between align-items-center p-3 shadow-sm">
      <div class="login-logo text-dark cursor-pointer" @click="$router.push('/dashboard')">
        <div class="login-logo-icon bg-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ffffff"/>
          </svg>
        </div>
        <span class="fw-bold fs-5 ms-2" style="color: #d60f2b;">NachoFlight</span>
      </div>
      <div>
        <button @click="$router.push('/dashboard')" class="btn btn-outline-secondary fw-bold rounded-pill px-4">Volver al inicio</button>
      </div>
    </header>

    <div class="container py-5">
      
      <div class="d-flex align-items-center gap-3 mb-5">
        <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
             style="width:56px;height:56px;background:#fff0f2;">
          <i class="bi bi-briefcase-fill text-danger fs-3"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-1 h2">Mis Viajes</h1>
          <p class="text-muted mb-0">Gestiona tus reservas y visualiza tus boletos emitidos.</p>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="errorMsg" class="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-2 mb-4">
        <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="alert alert-success shadow-sm border-0 d-flex align-items-center gap-2 mb-4">
        <i class="bi bi-check-circle-fill"></i> {{ successMsg }}
      </div>

      <!-- Tabs -->
      <ul class="nav nav-pills mb-4 gap-2 custom-tabs">
        <li class="nav-item">
          <button class="nav-link fw-bold px-4 py-2 rounded-pill" :class="{ 'active bg-danger': activeTab === 'reservas', 'text-dark bg-white border': activeTab !== 'reservas' }" @click="activeTab = 'reservas'">
            Mis Reservas
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-bold px-4 py-2 rounded-pill" :class="{ 'active bg-danger': activeTab === 'boletos', 'text-dark bg-white border': activeTab !== 'boletos' }" @click="activeTab = 'boletos'">
            Mis Boletos
          </button>
        </li>
      </ul>

      <!-- CONTENIDO: RESERVAS -->
      <div v-if="activeTab === 'reservas'">
        <div v-if="loadingReservas" class="text-center py-5">
          <span class="spinner-border text-danger" style="width: 3rem; height: 3rem;"></span>
          <p class="text-muted mt-3">Cargando tus reservas...</p>
        </div>
        
        <div v-else-if="reservas.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
          <i class="bi bi-journal-x text-muted" style="font-size: 4rem;"></i>
          <h3 class="h5 fw-bold mt-3">No tienes reservas</h3>
          <p class="text-muted">Aún no has realizado ninguna reserva con nosotros.</p>
          <button class="btn btn-danger fw-bold rounded-pill px-4 mt-2" @click="$router.push('/dashboard')">Buscar vuelos</button>
        </div>

        <div v-else class="row g-4">
          <div class="col-md-6 col-xl-4" v-for="r in reservas" :key="r.idReserva">
            <div class="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
              <div class="position-absolute top-0 start-0 w-100" style="height: 4px;" 
                   :class="r.estadoReserva === 'CON' ? 'bg-success' : (r.estadoReserva === 'CAN' ? 'bg-secondary' : 'bg-warning')"></div>
              
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span class="text-uppercase small fw-bold text-muted d-block mb-1">Código de Reserva</span>
                    <h5 class="fw-bold mb-0" style="letter-spacing: 1px;">{{ r.codigoReserva || `RSV-${r.idReserva}` }}</h5>
                  </div>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :class="{
                          'bg-warning text-dark': r.estadoReserva !== 'CON' && r.estadoReserva !== 'CAN',
                          'bg-success text-white': r.estadoReserva === 'CON',
                          'bg-secondary text-white': r.estadoReserva === 'CAN'
                        }">
                    {{ r.estadoReserva === 'CON' ? 'Confirmada' : (r.estadoReserva === 'CAN' ? 'Cancelada' : 'Pendiente') }}
                  </span>
                </div>

                <div class="bg-light rounded-3 p-3 mb-4">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="small text-muted fw-bold">Vuelo ID</span>
                    <span class="small fw-bold">{{ r.idVuelo }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="small text-muted fw-bold">Asiento ID</span>
                    <span class="small fw-bold">{{ r.idAsiento }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="small text-muted fw-bold">Fecha Res.</span>
                    <span class="small fw-bold">{{ new Date(r.fechaReserva || r.fechaInicio).toLocaleDateString() }}</span>
                  </div>
                </div>

                <div class="invoice-strip rounded-3 p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="small text-muted fw-bold text-uppercase d-block">Factura</span>
                      <span class="fw-bold">{{ getFacturaId(r) ? `#${getFacturaId(r)}` : 'No emitida' }}</span>
                    </div>
                    <span class="badge rounded-pill px-3 py-2" :class="getFacturaBadgeClass(r)">
                      {{ getFacturaEstado(r) }}
                    </span>
                  </div>
                  <button
                    v-if="canPayFactura(r)"
                    class="btn btn-danger fw-bold rounded-pill w-100 mt-3"
                    :disabled="paymentLoading"
                    @click="openPayment(r, 'reserva')"
                  >
                    <i class="bi bi-credit-card-2-front-fill me-1"></i>
                    Pagar
                  </button>
                </div>

                <!-- Botones de Acción (Solo si está pendiente) -->
                <div v-if="r.estadoReserva !== 'CON' && r.estadoReserva !== 'CAN'" class="d-grid gap-2">
                  <button class="btn btn-success fw-bold rounded-pill" :disabled="procesandoId === r.idReserva" @click="handleConfirmar(r.idReserva)">
                    <span v-if="procesandoId === r.idReserva" class="spinner-border spinner-border-sm me-2"></span>
                    Confirmar Reserva
                  </button>
                  <button class="btn btn-outline-secondary fw-bold rounded-pill" :disabled="procesandoId === r.idReserva" @click="handleCancelar(r.idReserva)">
                    Cancelar
                  </button>
                </div>
                
                <div v-else-if="r.estadoReserva === 'CON'" class="alert alert-success mb-0 py-2 small text-center border-0">
                  <i class="bi bi-check-circle-fill me-1"></i> Reserva lista y boleto emitido
                </div>
                <div v-else class="alert alert-secondary mb-0 py-2 small text-center border-0">
                  <i class="bi bi-x-circle-fill me-1"></i> Esta reserva fue cancelada
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENIDO: BOLETOS -->
      <div v-if="activeTab === 'boletos'">
        <div v-if="loadingBoletos" class="text-center py-5">
          <span class="spinner-border text-danger" style="width: 3rem; height: 3rem;"></span>
          <p class="text-muted mt-3">Buscando tus boletos emitidos...</p>
        </div>
        
        <div v-else-if="boletos.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
          <i class="bi bi-ticket-perforated text-muted" style="font-size: 4rem;"></i>
          <h3 class="h5 fw-bold mt-3">No tienes boletos</h3>
          <p class="text-muted">Tus boletos aparecerán aquí una vez que confirmes tus reservas.</p>
          <button class="btn btn-outline-danger fw-bold rounded-pill px-4 mt-2" @click="activeTab = 'reservas'">Ver mis reservas</button>
        </div>

        <div v-else class="row g-4">
          <div class="col-lg-6" v-for="b in boletos" :key="b.idBoleto">
            <!-- Boarding Pass Style Card -->
            <div
              class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-row boarding-card"
              :class="{ 'boarding-card-paid': isFacturaPagada(b) }"
            >
              <!-- Franja lateral -->
              <div
                class="text-white d-flex flex-column justify-content-between p-3 text-center"
                :class="isFacturaPagada(b) ? 'paid-boarding-strip' : 'bg-danger'"
                style="width: 80px; writing-mode: vertical-rl; transform: rotate(180deg);"
              >
                <span class="fw-bold letter-spacing-2 mt-2">
                  {{ isFacturaPagada(b) ? 'PAGADO' : 'BOARDING PASS' }}
                </span>
                <i class="bi bi-airplane-fill fs-4 mb-2" style="transform: rotate(90deg);"></i>
              </div>
              
              <!-- Contenido principal -->
              <div class="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-light text-danger border border-danger fw-bold px-3 py-2 rounded-pill">
                      CLASE {{ b.clase }}
                    </span>
                    <span class="fw-bold text-muted small text-uppercase">Boleto {{ b.codigoBoleto || `#${b.idBoleto}` }}</span>
                  </div>

                  <div v-if="isFacturaPagada(b)" class="paid-banner rounded-4 p-3 mb-3 d-flex align-items-center gap-3">
                    <div class="paid-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-check-lg"></i>
                    </div>
                    <div>
                      <span class="d-block fw-bold text-success">Pagado</span>
                      <span class="small text-muted">Tu factura ya fue aprobada. Las acciones de pago y equipaje quedan bloqueadas.</span>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-6">
                      <span class="small text-muted fw-bold d-block text-uppercase">Vuelo</span>
                      <span class="fs-4 fw-bold text-dark">{{ b.idVuelo }}</span>
                    </div>
                    <div class="col-6 text-end">
                      <span class="small text-muted fw-bold d-block text-uppercase">Asiento</span>
                      <span class="fs-4 fw-bold text-danger">{{ b.idAsiento || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-end border-top pt-3 mt-auto">
                  <div>
                    <span class="small text-muted fw-bold d-block text-uppercase">Reserva Asociada</span>
                    <span class="fw-bold">{{ b.idReserva }}</span>
                  </div>
                  <div class="text-end">
                    <span class="small text-muted fw-bold d-block text-uppercase">Estado</span>
                    <span class="fw-bold" :class="b.estadoBoleto === 'ACTIVO' ? 'text-success' : 'text-secondary'">
                      {{ b.estadoBoleto }}
                    </span>
                  </div>
                </div>

                <div class="invoice-strip rounded-3 p-3 mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="small text-muted fw-bold text-uppercase d-block">Factura</span>
                      <span class="fw-bold">{{ getFacturaId(b) ? `#${getFacturaId(b)}` : 'Sin factura' }}</span>
                    </div>
                    <span class="badge rounded-pill px-3 py-2" :class="getFacturaBadgeClass(b)">
                      {{ getFacturaEstado(b) }}
                    </span>
                  </div>
                  <button
                    v-if="canPayFactura(b)"
                    class="btn btn-danger fw-bold rounded-pill w-100 mt-3"
                    :disabled="paymentLoading"
                    @click="openPayment(b, 'boleto')"
                  >
                    <i class="bi bi-credit-card-2-front-fill me-1"></i>
                    Pagar
                  </button>
                  <button
                    v-else-if="isFacturaPagada(b)"
                    class="btn btn-success fw-bold rounded-pill w-100 mt-3"
                    disabled
                  >
                    <i class="bi bi-check-circle-fill me-1"></i>
                    Pagado
                  </button>
                </div>

                <button
                  class="btn btn-outline-danger fw-bold rounded-pill mt-3"
                  :disabled="loadingEquipaje || isFacturaPagada(b)"
                  @click="abrirEquipaje(b)"
                  :title="isFacturaPagada(b) ? 'El boleto pagado no permite agregar equipaje desde esta vista.' : ''"
                >
                  <i class="bi bi-suitcase2-fill me-1"></i>
                  {{ isFacturaPagada(b) ? 'Equipaje bloqueado' : 'Gestionar equipaje' }}
                </button>
              </div>

              <!-- Falso QR o Barcode -->
              <div class="bg-light p-3 d-flex align-items-center justify-content-center border-start border-dashed" style="width: 120px;">
                <div class="text-center">
                  <i class="bi bi-qr-code text-dark" style="font-size: 4rem; opacity: 0.8;"></i>
                  <div class="small text-muted mt-2" style="font-size: 0.6rem;">ESCANEAME</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Equipaje -->
    <div
      v-if="boletoEquipaje"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background: rgba(0,0,0,.45); z-index: 1050;"
      @click.self="cerrarEquipaje"
    >
      <div class="card border-0 shadow-lg rounded-4" style="width: 95%; max-width: 820px; max-height: 90vh; overflow-y: auto;">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <p class="text-uppercase small fw-bold text-danger mb-1">Equipaje</p>
              <h3 class="h5 fw-bold mb-0">{{ boletoEquipaje.codigoBoleto || `Boleto #${boletoEquipaje.idBoleto}` }}</h3>
              <p class="text-muted small mb-0">Registra o revisa equipaje asociado a este boleto.</p>
            </div>
            <button class="btn btn-outline-secondary fw-bold rounded-pill px-3" @click="cerrarEquipaje">
              Cerrar
            </button>
          </div>

          <div class="row g-3 align-items-end mb-4">
            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small">Tipo *</label>
              <select v-model="equipajeForm.tipo" class="form-select">
                <option value="MANO">Mano</option>
                <option value="BODEGA">Bodega</option>
                <option value="ESPECIAL">Especial</option>
              </select>
              <div v-if="equipajeForm.tipo === 'MANO'" class="small mt-1 fw-semibold" style="color:#d97706;">
                Máx. 10 kg
              </div>
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small">Peso (kg) *</label>
              <input v-model.number="equipajeForm.pesoKg" type="number" min="0.01" step="0.01" class="form-control" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small">Dimensiones</label>
              <input v-model.trim="equipajeForm.dimensionesCm" placeholder="55x40x20" class="form-control" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small">Descripción</label>
              <input v-model.trim="equipajeForm.descripcionEquipaje" placeholder="Maleta gris..." class="form-control" />
            </div>

            <div class="col-12 col-md-1 d-grid">
              <button class="btn btn-danger fw-bold" :disabled="loadingEquipaje" @click="submitEquipaje">
                <span v-if="loadingEquipaje" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <i v-else class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>

          <div v-if="loadingEquipaje" class="text-center py-4">
            <span class="spinner-border text-danger"></span>
            <p class="text-muted mt-2 mb-0">Cargando equipaje...</p>
          </div>

          <div v-else class="table-responsive rounded-3 border">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="small text-uppercase">Etiqueta</th>
                  <th class="small text-uppercase">Tipo</th>
                  <th class="small text-uppercase">Peso</th>
                  <th class="small text-uppercase">Dimensiones</th>
                  <th class="small text-uppercase">Estado</th>
                  <th class="small text-uppercase">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="equipajes.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">Sin equipaje registrado.</td>
                </tr>
                <tr v-for="e in equipajes" :key="e.idEquipaje">
                  <td class="fw-bold text-danger">{{ e.numeroEtiqueta || `EQ-${e.idEquipaje}` }}</td>
                  <td class="small fw-semibold">{{ e.tipo }}</td>
                  <td class="small text-muted">{{ Number(e.pesoKg || 0).toFixed(2) }} kg</td>
                  <td class="small text-muted">{{ e.dimensionesCm || '—' }}</td>
                  <td>
                    <select
                      class="form-select form-select-sm fw-semibold"
                      style="width: auto;"
                      :value="e.estadoEquipaje"
                      @change="cambiarEstadoEquipaje(e, $event.target.value)"
                    >
                      <option value="REGISTRADO">REGISTRADO</option>
                      <option value="EMBARCADO">EMBARCADO</option>
                      <option value="EN_TRANSITO">EN_TRANSITO</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="PERDIDO">PERDIDO</option>
                      <option value="DAÑADO">DAÑADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td class="small text-muted">{{ e.descripcionEquipaje || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <PaymentModal
      v-if="paymentTarget"
      :payment="paymentTarget"
      :loading="paymentLoading"
      :error="paymentError"
      @close="closePayment"
      @confirm="confirmPayment"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import PaymentModal from '../../components/PaymentModal.vue'
import {
  listMyReservations,
  listMyBoletos,
  listMyFacturas,
  confirmReserva,
  cancelReserva,
  listEquipaje,
  createEquipaje,
  updateEquipajeEstado,
  approveFactura
} from '../../services/clientService'

const activeTab = ref('reservas')

const reservas = ref([])
const boletos = ref([])
const facturas = ref([])
const equipajes = ref([])
const boletoEquipaje = ref(null)
const paymentTarget = ref(null)
const paidFacturaIds = ref(loadPaidFacturaIds())

const loadingReservas = ref(false)
const loadingBoletos = ref(false)
const loadingEquipaje = ref(false)
const paymentLoading = ref(false)
const procesandoId = ref(null)

const errorMsg = ref('')
const successMsg = ref('')
const paymentError = ref('')

const equipajeForm = reactive({
  tipo: 'MANO',
  pesoKg: 0,
  dimensionesCm: '',
  descripcionEquipaje: ''
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function loadPaidFacturaIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem('paidFacturaIds') || '[]').map(String))
  } catch {
    return new Set()
  }
}

function persistPaidFacturaId(idFactura) {
  if (!idFactura) return
  paidFacturaIds.value = new Set([...paidFacturaIds.value, String(idFactura)])
  localStorage.setItem('paidFacturaIds', JSON.stringify([...paidFacturaIds.value]))
}

function entityValue(entity, keys) {
  if (!entity) return undefined

  for (const key of keys) {
    if (entity[key] !== undefined && entity[key] !== null && entity[key] !== '') {
      return entity[key]
    }
  }

  return undefined
}

function getFacturaId(item) {
  return entityValue(resolveFactura(item), ['idFactura', 'id_factura', 'facturaId', 'factura_id'])
}

function getFacturaEstado(item) {
  if (item?.facturaPagadaLocal) return 'APR'

  const idFactura = getFacturaId(item)
  if (idFactura && paidFacturaIds.value.has(String(idFactura))) return 'APR'

  const factura = resolveFactura(item)
  const estado = entityValue(factura, [
    'estadoFactura',
    'estado_factura',
    'estado',
    'estadoPago',
    'estado_pago',
    'facturaEstado',
    'factura_estado'
  ])

  return String(estado || (idFactura ? 'ABI' : 'SIN')).toUpperCase()
}

function getFacturaTotal(item) {
  const factura = resolveFactura(item)
  return entityValue(factura, ['totalFactura', 'total_factura', 'total', 'montoTotal', 'monto_total']) ||
    entityValue(item, ['precioFinal', 'precio_final']) ||
    entityValue(item, ['totalReserva', 'total_reserva'])
}

function resolveFactura(item) {
  if (!item) return null
  if (item.factura) return item.factura

  const directFacturaId = entityValue(item, ['idFactura', 'id_factura', 'facturaId', 'factura_id'])
  if (directFacturaId) {
    const facturaById = facturas.value.find((factura) =>
      String(entityValue(factura, ['idFactura', 'id_factura', 'facturaId', 'factura_id'])) === String(directFacturaId)
    )

    if (facturaById) return facturaById
  }

  const idReserva = entityValue(item, ['idReserva', 'id_reserva'])
  if (idReserva) {
    const facturaByReserva = facturas.value.find((factura) =>
      String(entityValue(factura, ['idReserva', 'id_reserva'])) === String(idReserva)
    )

    if (facturaByReserva) return facturaByReserva
  }

  return item
}

function formatMoney(value) {
  if (value === undefined || value === null || value === '') return 'Total pendiente'
  return `$${Number(value || 0).toFixed(2)}`
}

function isFacturaAbierta(item) {
  return getFacturaEstado(item) === 'ABI'
}

function isFacturaPagada(item) {
  const estado = getFacturaEstado(item)
  return estado === 'APR' || estado === 'PAGADA' || estado === 'PAGADO'
}

function canPayFactura(item) {
  return Boolean(getFacturaId(item)) && isFacturaAbierta(item)
}

function getFacturaBadgeClass(item) {
  if (isFacturaPagada(item)) return 'bg-success text-white'
  if (isFacturaAbierta(item)) return 'bg-warning text-dark'
  return 'bg-light text-muted border'
}

function setFacturaPagadaLocal(item, idFactura = getFacturaId(item)) {
  persistPaidFacturaId(idFactura)

  item.facturaPagadaLocal = true
  item.estadoFactura = 'APR'
  item.estado = item.estado === 'ABI' ? 'APR' : item.estado

  if (item.factura) {
    item.factura.estado = 'APR'
    item.factura.estadoFactura = 'APR'
  }

  const factura = resolveFactura(item)
  if (factura && factura !== item) {
    factura.estado = 'APR'
    factura.estadoFactura = 'APR'
  }

  const updateMatchingFactura = (candidate) => {
    if (!candidate) return
    const candidateFacturaId = getFacturaId(candidate)
    if (idFactura && String(candidateFacturaId) === String(idFactura)) {
      candidate.facturaPagadaLocal = true
      candidate.estadoFactura = 'APR'
      candidate.estado = candidate.estado === 'ABI' ? 'APR' : candidate.estado
      if (candidate.factura) {
        candidate.factura.estado = 'APR'
        candidate.factura.estadoFactura = 'APR'
      }
    }
  }

  reservas.value.forEach(updateMatchingFactura)
  boletos.value.forEach(updateMatchingFactura)
  facturas.value.forEach((factura) => {
    const facturaId = entityValue(factura, ['idFactura', 'id_factura', 'facturaId', 'factura_id'])
    if (idFactura && String(facturaId) === String(idFactura)) {
      factura.estado = 'APR'
      factura.estadoFactura = 'APR'
    }
  })
}

function openPayment(item, type) {
  const idFactura = getFacturaId(item)
  if (!idFactura) {
    errorMsg.value = 'No se encontró una factura para pagar.'
    return
  }

  paymentError.value = ''
  paymentTarget.value = {
    idFactura,
    item,
    type,
    label: type === 'boleto'
      ? `Boleto ${item.codigoBoleto || `#${item.idBoleto}`}`
      : `Reserva ${item.codigoReserva || `#${item.idReserva}`}`,
    totalDisplay: formatMoney(getFacturaTotal(item))
  }
}

function closePayment() {
  if (paymentLoading.value) return
  paymentTarget.value = null
  paymentError.value = ''
}

async function confirmPayment() {
  if (!paymentTarget.value?.idFactura) return

  paymentLoading.value = true
  paymentError.value = ''
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await sleep(2200)
    const paidFacturaId = paymentTarget.value.idFactura
    const paidItem = paymentTarget.value.item

    await approveFactura(paidFacturaId)
    setFacturaPagadaLocal(paidItem, paidFacturaId)

    successMsg.value = 'Pago realizado con éxito.'
    paymentTarget.value = null
    await Promise.all([fetchReservas(), fetchBoletos(), fetchFacturas()])
    setFacturaPagadaLocal(paidItem, paidFacturaId)
  } catch (error) {
    console.error('Error al aprobar factura:', error)
    paymentError.value = error?.response?.data?.mensaje || 'No se pudo procesar el pago. Intenta nuevamente.'
  } finally {
    paymentLoading.value = false
  }
}

const fetchReservas = async () => {
  loadingReservas.value = true
  errorMsg.value = ''
  try {
    const res = await listMyReservations()
    reservas.value = res?.data || []
    reservas.value.forEach((reserva) => {
      const idFactura = getFacturaId(reserva)
      if (idFactura && paidFacturaIds.value.has(String(idFactura))) {
        setFacturaPagadaLocal(reserva, idFactura)
      }
    })
    // Ordenar para mostrar pendientes primero, luego confirmadas, luego canceladas (opcional)
    reservas.value.sort((a, b) => b.idReserva - a.idReserva)
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    errorMsg.value = 'No se pudieron cargar tus reservas.'
  } finally {
    loadingReservas.value = false
  }
}

const fetchBoletos = async () => {
  loadingBoletos.value = true
  errorMsg.value = ''
  try {
    const res = await listMyBoletos()
    boletos.value = res?.data || []
    boletos.value.forEach((boleto) => {
      const idFactura = getFacturaId(boleto)
      if (idFactura && paidFacturaIds.value.has(String(idFactura))) {
        setFacturaPagadaLocal(boleto, idFactura)
      }
    })
  } catch (error) {
    console.error('Error al obtener boletos:', error)
    errorMsg.value = 'No se pudieron cargar tus boletos.'
  } finally {
    loadingBoletos.value = false
  }
}

const fetchFacturas = async () => {
  try {
    const res = await listMyFacturas()
    facturas.value = Array.isArray(res?.data) ? res.data : []
    facturas.value.forEach((factura) => {
      const idFactura = entityValue(factura, ['idFactura', 'id_factura', 'facturaId', 'factura_id'])
      if (idFactura && paidFacturaIds.value.has(String(idFactura))) {
        factura.estado = 'APR'
        factura.estadoFactura = 'APR'
      }
    })
  } catch (error) {
    console.error('Error al obtener facturas:', error)
    facturas.value = []
  }
}

const handleConfirmar = async (idReserva) => {
  if (!confirm('¿Estás seguro de que deseas confirmar esta reserva y emitir el boleto?')) return
  
  procesandoId.value = idReserva
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    await confirmReserva(idReserva)
    successMsg.value = '¡Reserva confirmada con éxito! Tu boleto ha sido generado automáticamente.'
    await fetchReservas()
    await fetchBoletos() // Refrescamos boletos por si cambia de tab
  } catch (error) {
    console.error(error)
    errorMsg.value = error?.response?.data?.mensaje || 'Error al confirmar la reserva.'
  } finally {
    procesandoId.value = null
  }
}

const handleCancelar = async (idReserva) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) return
  
  procesandoId.value = idReserva
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    await cancelReserva(idReserva)
    successMsg.value = 'La reserva ha sido cancelada correctamente.'
    await fetchReservas()
  } catch (error) {
    console.error(error)
    errorMsg.value = error?.response?.data?.mensaje || 'Error al cancelar la reserva.'
  } finally {
    procesandoId.value = null
  }
}

const resetEquipajeForm = () => {
  equipajeForm.tipo = 'MANO'
  equipajeForm.pesoKg = 0
  equipajeForm.dimensionesCm = ''
  equipajeForm.descripcionEquipaje = ''
}

const abrirEquipaje = async (boleto) => {
  if (isFacturaPagada(boleto)) {
    errorMsg.value = 'El boleto pagado no permite agregar equipaje desde esta vista.'
    return
  }

  boletoEquipaje.value = boleto
  resetEquipajeForm()
  await fetchEquipaje(boleto.idBoleto)
}

const cerrarEquipaje = () => {
  boletoEquipaje.value = null
  equipajes.value = []
  resetEquipajeForm()
}

const fetchEquipaje = async (idBoleto) => {
  loadingEquipaje.value = true
  errorMsg.value = ''

  try {
    const data = await listEquipaje(idBoleto)
    equipajes.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error al obtener equipaje:', error)
    equipajes.value = []
    errorMsg.value = error?.response?.data?.mensaje || 'No se pudo cargar el equipaje.'
  } finally {
    loadingEquipaje.value = false
  }
}

const submitEquipaje = async () => {
  if (!boletoEquipaje.value?.idBoleto) return

  if (isFacturaPagada(boletoEquipaje.value)) {
    errorMsg.value = 'El boleto pagado no permite agregar equipaje desde esta vista.'
    return
  }

  if (!equipajeForm.pesoKg || equipajeForm.pesoKg <= 0) {
    errorMsg.value = 'El peso del equipaje es obligatorio.'
    return
  }

  loadingEquipaje.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await createEquipaje(boletoEquipaje.value.idBoleto, {
      idBoleto: boletoEquipaje.value.idBoleto,
      tipo: equipajeForm.tipo,
      pesoKg: Number(equipajeForm.pesoKg),
      descripcionEquipaje: equipajeForm.descripcionEquipaje || null,
      precioExtra: 0,
      dimensionesCm: equipajeForm.dimensionesCm || null
    })

    successMsg.value = 'Equipaje agregado correctamente.'
    resetEquipajeForm()
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
  } catch (error) {
    console.error('Error al crear equipaje:', error)
    errorMsg.value = error?.response?.data?.mensaje || 'No se pudo registrar el equipaje.'
  } finally {
    loadingEquipaje.value = false
  }
}

const cambiarEstadoEquipaje = async (equipaje, nuevoEstado) => {
  if (!boletoEquipaje.value?.idBoleto || nuevoEstado === equipaje.estadoEquipaje) return

  try {
    await updateEquipajeEstado(boletoEquipaje.value.idBoleto, equipaje.idEquipaje, nuevoEstado)
    successMsg.value = `Estado actualizado a ${nuevoEstado}.`
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
  } catch (error) {
    console.error('Error al actualizar equipaje:', error)
    errorMsg.value = error?.response?.data?.mensaje || 'No se pudo actualizar el estado del equipaje.'
  }
}

onMounted(() => {
  fetchReservas()
  fetchBoletos()
  fetchFacturas()
})
</script>

<style scoped>
.mis-viajes-shell {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.client-header-solid {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.login-logo-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}

.border-dashed {
  border-left-style: dashed !important;
  border-left-width: 2px !important;
  border-left-color: #dee2e6 !important;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.custom-tabs .nav-link {
  transition: all 0.3s ease;
}

.invoice-strip {
  background: linear-gradient(135deg, #fff7f8, #ffffff);
  border: 1px solid #ffe1e6;
}

.boarding-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.boarding-card-paid {
  border: 1px solid #bbf7d0 !important;
  box-shadow: 0 12px 30px rgba(22, 101, 52, 0.12) !important;
}

.paid-boarding-strip {
  background: linear-gradient(180deg, #16a34a, #166534);
}

.paid-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.paid-icon {
  width: 42px;
  height: 42px;
  background: #16a34a;
  color: #fff;
  flex: 0 0 auto;
}
</style>
