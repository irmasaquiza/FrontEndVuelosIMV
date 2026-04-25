<template>
  <section class="admin-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administrador</p>
        <h1>Gestion de reservas</h1>
        <p class="subtitle">
          Crea reservas, consulta por filtros avanzados y actualiza su estado con los codigos reales del backend.
        </p>
      </div>

      <div class="header-actions">
        <router-link class="ghost-btn" to="/admin">Volver al modulo</router-link>
        <router-link class="ghost-btn" to="/home">Inicio</router-link>
      </div>
    </header>

    <p v-if="feedbackError" class="feedback error">{{ feedbackError }}</p>
    <p v-if="feedbackSuccess" class="feedback success">{{ feedbackSuccess }}</p>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Nueva reserva</h2>
          <p>Relaciona cliente, pasajero, vuelo y asiento, y el sistema calcula el total estimado.</p>
        </div>
      </div>

      <form class="form-card" @submit.prevent="submitReserva">
        <div class="three-columns">
          <label class="field">
            <span>Cliente *</span>
            <select v-model="form.idCliente" required @change="onClienteChange">
              <option value="">Selecciona cliente</option>
              <option v-for="cliente in clientes" :key="entityId(cliente, ['id_cliente', 'idCliente'])" :value="String(entityId(cliente, ['id_cliente', 'idCliente']))">
                {{ getClienteNombre(cliente) }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Pasajero *</span>
            <select v-model="form.idPasajero" required>
              <option value="">Selecciona pasajero</option>
              <option v-for="pasajero in pasajerosFiltrados" :key="entityId(pasajero, ['id_pasajero', 'idPasajero'])" :value="String(entityId(pasajero, ['id_pasajero', 'idPasajero']))">
                {{ getPasajeroNombre(pasajero) }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Vuelo *</span>
            <select v-model="form.idVuelo" required @change="onVueloChange">
              <option value="">Selecciona vuelo</option>
              <option v-for="vuelo in vuelos" :key="entityId(vuelo, ['id_vuelo', 'idVuelo'])" :value="String(entityId(vuelo, ['id_vuelo', 'idVuelo']))">
                {{ getVueloEtiqueta(vuelo) }}
              </option>
            </select>
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Asiento *</span>
            <select v-model="form.idAsiento" required :disabled="!form.idVuelo || loadingAsientos" @change="calcularPrecios">
              <option value="">
                {{ loadingAsientos ? 'Cargando...' : 'Selecciona asiento' }}
              </option>
              <option
                v-for="asiento in asientosDisponibles"
                :key="entityId(asiento, ['id_asiento', 'idAsiento'])"
                :value="String(entityId(asiento, ['id_asiento', 'idAsiento']))"
              >
                {{ getAsientoEtiqueta(asiento) }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Fecha inicio viaje *</span>
            <input v-model="form.fechaInicio" type="datetime-local" required />
          </label>

          <label class="field">
            <span>Fecha fin viaje *</span>
            <input v-model="form.fechaFin" type="datetime-local" required />
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Subtotal</span>
            <input :value="form.subtotalReserva" type="number" disabled />
          </label>

          <label class="field">
            <span>IVA</span>
            <input :value="form.valorIva" type="number" disabled />
          </label>

          <label class="field">
            <span>Total</span>
            <input :value="form.totalReserva" type="number" disabled />
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Canal</span>
            <input v-model="form.origenCanalReserva" type="text" placeholder="WEB" />
          </label>

          <label class="field">
            <span>Email de contacto</span>
            <input v-model="form.contactoEmail" type="email" placeholder="cliente@email.com" />
          </label>

          <label class="field">
            <span>Telefono de contacto</span>
            <input v-model="form.contactoTelefono" type="text" placeholder="0999999999" />
          </label>
        </div>

        <label class="field">
          <span>Observaciones</span>
          <input v-model="form.observaciones" type="text" placeholder="Notas de la reserva" />
        </label>

        <button class="primary-btn" :disabled="loadingSubmit" type="submit">
          {{ loadingSubmit ? 'Guardando...' : 'Crear reserva' }}
        </button>
      </form>
    </section>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Buscar reservas</h2>
          <p>Filtros alineados con el endpoint `GET /api/v1/reservas`.</p>
        </div>
      </div>

      <div class="list-card">
        <div class="three-columns">
          <label class="field">
            <span>Codigo reserva</span>
            <input v-model="filters.CodigoReserva" type="text" placeholder="RSV-0001" />
          </label>

          <label class="field">
            <span>Cliente</span>
            <select v-model="filters.IdCliente">
              <option value="">Todos</option>
              <option v-for="cliente in clientes" :key="entityId(cliente, ['id_cliente', 'idCliente'])" :value="String(entityId(cliente, ['id_cliente', 'idCliente']))">
                {{ getClienteNombre(cliente) }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Pasajero</span>
            <select v-model="filters.IdPasajero">
              <option value="">Todos</option>
              <option v-for="pasajero in pasajeros" :key="entityId(pasajero, ['id_pasajero', 'idPasajero'])" :value="String(entityId(pasajero, ['id_pasajero', 'idPasajero']))">
                {{ getPasajeroNombre(pasajero) }}
              </option>
            </select>
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Vuelo</span>
            <select v-model="filters.IdVuelo">
              <option value="">Todos</option>
              <option v-for="vuelo in vuelos" :key="entityId(vuelo, ['id_vuelo', 'idVuelo'])" :value="String(entityId(vuelo, ['id_vuelo', 'idVuelo']))">
                {{ getVueloEtiqueta(vuelo) }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Estado</span>
            <select v-model="filters.EstadoReserva">
              <option value="">Todos</option>
              <option v-for="estado in estadosReserva" :key="estado.code" :value="estado.code">
                {{ estado.code }} - {{ estado.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Canal</span>
            <input v-model="filters.OrigenCanalReserva" type="text" placeholder="WEB / APP / CALLCENTER" />
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Total minimo</span>
            <input v-model="filters.TotalMin" type="number" min="0" step="0.01" />
          </label>

          <label class="field">
            <span>Total maximo</span>
            <input v-model="filters.TotalMax" type="number" min="0" step="0.01" />
          </label>

          <label class="field">
            <span>Pagina</span>
            <input v-model="filters.Page" type="number" min="1" step="1" />
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Fecha reserva inicio</span>
            <input v-model="filters.FechaReservaInicio" type="datetime-local" />
          </label>

          <label class="field">
            <span>Fecha reserva fin</span>
            <input v-model="filters.FechaReservaFin" type="datetime-local" />
          </label>

          <label class="field">
            <span>Tamano pagina</span>
            <input v-model="filters.PageSize" type="number" min="1" step="1" />
          </label>
        </div>

        <div class="three-columns">
          <label class="field">
            <span>Fecha inicio viaje</span>
            <input v-model="filters.FechaInicioViaje" type="datetime-local" />
          </label>

          <label class="field">
            <span>Fecha fin viaje</span>
            <input v-model="filters.FechaFinViaje" type="datetime-local" />
          </label>

          <div class="actions" style="align-self:end;">
            <button class="ghost-btn" :disabled="loadingList" @click="limpiarFiltros">
              Limpiar
            </button>
            <button class="primary-btn" :disabled="loadingList" @click="fetchReservas">
              {{ loadingList ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Cliente</th>
                <th>Pasajero</th>
                <th>Vuelo</th>
                <th>Asiento</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!reservas.length && !loadingList">
                <td colspan="8">No hay reservas registradas.</td>
              </tr>
              <tr v-for="reserva in reservas" :key="entityId(reserva, ['id_reserva', 'idReserva'])">
                <td>
                  <strong>{{ entityValue(reserva, ['codigo_reserva', 'codigoReserva']) || `Reserva #${entityId(reserva, ['id_reserva', 'idReserva'])}` }}</strong>
                  <br />
                  <span class="muted-text">{{ formatDateTime(entityValue(reserva, ['fecha_reserva', 'fechaReserva'])) }}</span>
                </td>
                <td>{{ getClienteNombreById(entityValue(reserva, ['id_cliente', 'idCliente'])) }}</td>
                <td>{{ getPasajeroNombreById(entityValue(reserva, ['id_pasajero', 'idPasajero'])) }}</td>
                <td>{{ getVueloNombreById(entityValue(reserva, ['id_vuelo', 'idVuelo'])) }}</td>
                <td>#{{ entityValue(reserva, ['id_asiento', 'idAsiento']) }}</td>
                <td>${{ formatMoney(entityValue(reserva, ['total_reserva', 'totalReserva'])) }}</td>
                <td>
                  <select
                    class="status-select"
                    :value="entityValue(reserva, ['estado_reserva', 'estadoReserva'])"
                    @change="cambiarEstado(reserva, $event.target.value)"
                  >
                    <option v-for="estado in estadosReserva" :key="estado.code" :value="estado.code">
                      {{ estado.code }} - {{ estado.label }}
                    </option>
                  </select>
                </td>
                <td>
                  <button class="text-btn" @click="verDetalle(reserva)">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span>Pagina {{ meta.page || filters.Page }} de {{ meta.total_pages || 1 }}</span>
          <span class="muted-text">Total registros: {{ meta.total || reservas.length }}</span>
        </div>
      </div>
    </section>

    <section v-if="detalleReserva" class="panel">
      <div class="panel-heading">
        <div>
          <h2>Detalle de la reserva</h2>
          <p>{{ entityValue(detalleReserva, ['codigo_reserva', 'codigoReserva']) }}</p>
        </div>
        <button class="ghost-btn" @click="detalleReserva = null">Cerrar</button>
      </div>

      <div class="table-wrap">
        <table>
          <tbody>
            <tr v-for="(value, key) in detalleReserva" :key="key">
              <th>{{ key }}</th>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createReserva,
  listAeropuertos,
  listAsientos,
  listClientes,
  listPasajeros,
  listReservas,
  listVuelos,
  updateReservaEstado
} from '../../../services/adminService'

const clientes = ref([])
const pasajeros = ref([])
const vuelos = ref([])
const aeropuertos = ref([])
const asientos = ref([])
const reservas = ref([])
const detalleReserva = ref(null)
const meta = ref({})

const loadingList = ref(false)
const loadingSubmit = ref(false)
const loadingAsientos = ref(false)
const feedbackError = ref('')
const feedbackSuccess = ref('')

const estadosReserva = [
  { code: 'PEN', label: 'Pendiente' },
  { code: 'CON', label: 'Confirmada' },
  { code: 'CAN', label: 'Cancelada' },
  { code: 'EXP', label: 'Expirada' },
  { code: 'FIN', label: 'Finalizada' },
  { code: 'EMI', label: 'Emitida' }
]

const form = reactive({
  idCliente: '',
  idPasajero: '',
  idVuelo: '',
  idAsiento: '',
  fechaInicio: '',
  fechaFin: '',
  subtotalReserva: 0,
  valorIva: 0,
  totalReserva: 0,
  origenCanalReserva: 'WEB',
  contactoEmail: '',
  contactoTelefono: '',
  observaciones: ''
})

const filters = reactive({
  IdCliente: '',
  IdPasajero: '',
  IdVuelo: '',
  CodigoReserva: '',
  EstadoReserva: '',
  OrigenCanalReserva: '',
  TotalMin: '',
  TotalMax: '',
  FechaReservaInicio: '',
  FechaReservaFin: '',
  FechaInicioViaje: '',
  FechaFinViaje: '',
  Page: 1,
  PageSize: 20
})

const pasajerosFiltrados = computed(() => {
  if (!form.idCliente) {
    return pasajeros.value
  }

  const relacionados = pasajeros.value.filter((pasajero) => {
    const idCliente = entityValue(pasajero, ['id_cliente', 'idCliente'])
    return String(idCliente ?? '') === String(form.idCliente)
  })

  return relacionados.length ? relacionados : pasajeros.value
})

const asientosDisponibles = computed(() => {
  return asientos.value.filter((asiento) => {
    const disponible = entityValue(asiento, ['disponible'])
    return disponible === true || disponible === 'true' || disponible === 1
  })
})

function entityId(entity, keys) {
  return entityValue(entity, keys)
}

function entityValue(entity, keys) {
  if (!entity) {
    return undefined
  }

  for (const key of keys) {
    if (entity[key] !== undefined && entity[key] !== null) {
      return entity[key]
    }
  }

  return undefined
}

function setError(error, fallback) {
  feedbackSuccess.value = ''
  feedbackError.value =
    error?.response?.data?.mensaje ||
    error?.response?.data?.detalle ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
}

function setSuccess(message) {
  feedbackError.value = ''
  feedbackSuccess.value = message
}

function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  return String(value).replace('T', ' ').slice(0, 16)
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2)
}

function toIsoStringOrNull(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function getClienteNombre(cliente) {
  const nombres = entityValue(cliente, ['nombres', 'nombre'])
  const apellidos = entityValue(cliente, ['apellidos', 'apellido'])
  return [nombres, apellidos].filter(Boolean).join(' ') || `Cliente #${entityId(cliente, ['id_cliente', 'idCliente'])}`
}

function getClienteNombreById(idCliente) {
  const cliente = clientes.value.find((item) => String(entityId(item, ['id_cliente', 'idCliente'])) === String(idCliente))
  return cliente ? getClienteNombre(cliente) : `#${idCliente}`
}

function getPasajeroNombre(pasajero) {
  const nombres = entityValue(pasajero, ['nombres', 'nombre_pasajero', 'nombrePasajero'])
  const apellidos = entityValue(pasajero, ['apellidos', 'apellido_pasajero', 'apellidoPasajero'])
  return [nombres, apellidos].filter(Boolean).join(' ') || `Pasajero #${entityId(pasajero, ['id_pasajero', 'idPasajero'])}`
}

function getPasajeroNombreById(idPasajero) {
  const pasajero = pasajeros.value.find((item) => String(entityId(item, ['id_pasajero', 'idPasajero'])) === String(idPasajero))
  return pasajero ? getPasajeroNombre(pasajero) : `#${idPasajero}`
}

function getAeropuertoCodigo(idAeropuerto) {
  const aeropuerto = aeropuertos.value.find((item) => String(entityId(item, ['id_aeropuerto', 'idAeropuerto'])) === String(idAeropuerto))
  return entityValue(aeropuerto, ['codigo_iata', 'codigoIata']) || `#${idAeropuerto}`
}

function getVueloEtiqueta(vuelo) {
  const numero = entityValue(vuelo, ['numero_vuelo', 'numeroVuelo'])
  const origen = getAeropuertoCodigo(entityValue(vuelo, ['id_aeropuerto_origen', 'idAeropuertoOrigen']))
  const destino = getAeropuertoCodigo(entityValue(vuelo, ['id_aeropuerto_destino', 'idAeropuertoDestino']))
  return `${numero} - ${origen} -> ${destino}`
}

function getVueloNombreById(idVuelo) {
  const vuelo = vuelos.value.find((item) => String(entityId(item, ['id_vuelo', 'idVuelo'])) === String(idVuelo))
  return vuelo ? getVueloEtiqueta(vuelo) : `#${idVuelo}`
}

function getAsientoEtiqueta(asiento) {
  const numero = entityValue(asiento, ['numero_asiento', 'numeroAsiento'])
  const clase = entityValue(asiento, ['clase'])
  const posicion = entityValue(asiento, ['posicion'])
  const precioExtra = entityValue(asiento, ['precio_extra', 'precioExtra'])
  const partes = [`${numero}`, clase]

  if (posicion) {
    partes.push(posicion)
  }

  if (Number(precioExtra || 0) > 0) {
    partes.push(`+$${formatMoney(precioExtra)}`)
  }

  return partes.join(' - ')
}

function calcularPrecios() {
  const vuelo = vuelos.value.find((item) => String(entityId(item, ['id_vuelo', 'idVuelo'])) === String(form.idVuelo))
  const asiento = asientos.value.find((item) => String(entityId(item, ['id_asiento', 'idAsiento'])) === String(form.idAsiento))

  const precioVuelo = Number(entityValue(vuelo, ['precio_base', 'precioBase']) || 0)
  const precioAsiento = Number(entityValue(asiento, ['precio_extra', 'precioExtra']) || 0)
  const subtotal = precioVuelo + precioAsiento
  const iva = subtotal * 0.15

  form.subtotalReserva = Number(subtotal.toFixed(2))
  form.valorIva = Number(iva.toFixed(2))
  form.totalReserva = Number((subtotal + iva).toFixed(2))
}

function onClienteChange() {
  const cliente = clientes.value.find((item) => String(entityId(item, ['id_cliente', 'idCliente'])) === String(form.idCliente))

  if (cliente) {
    form.contactoEmail = entityValue(cliente, ['correo', 'email']) || ''
    form.contactoTelefono = entityValue(cliente, ['telefono', 'telefono_principal']) || ''
  }

  if (!pasajerosFiltrados.value.some((pasajero) => String(entityId(pasajero, ['id_pasajero', 'idPasajero'])) === String(form.idPasajero))) {
    form.idPasajero = ''
  }
}

async function onVueloChange() {
  const vuelo = vuelos.value.find((item) => String(entityId(item, ['id_vuelo', 'idVuelo'])) === String(form.idVuelo))

  if (vuelo) {
    const salida = entityValue(vuelo, ['fecha_hora_salida', 'fechaHoraSalida'])
    const llegada = entityValue(vuelo, ['fecha_hora_llegada', 'fechaHoraLlegada'])

    form.fechaInicio = salida ? String(salida).slice(0, 16) : ''
    form.fechaFin = llegada ? String(llegada).slice(0, 16) : ''
  }

  form.idAsiento = ''
  asientos.value = []
  calcularPrecios()
  await fetchAsientos()
}

function buildReservaPayload() {
  return {
    idCliente: Number(form.idCliente),
    idPasajero: Number(form.idPasajero),
    idVuelo: Number(form.idVuelo),
    idAsiento: Number(form.idAsiento),
    fechaInicio: new Date(form.fechaInicio).toISOString(),
    fechaFin: new Date(form.fechaFin).toISOString(),
    subtotalReserva: Number(form.subtotalReserva),
    valorIva: Number(form.valorIva),
    totalReserva: Number(form.totalReserva),
    origenCanalReserva: form.origenCanalReserva || 'WEB',
    contactoEmail: form.contactoEmail || null,
    contactoTelefono: form.contactoTelefono || null,
    observaciones: form.observaciones || null
  }
}

function buildReservaFilters() {
  return {
    IdCliente: filters.IdCliente ? Number(filters.IdCliente) : undefined,
    IdPasajero: filters.IdPasajero ? Number(filters.IdPasajero) : undefined,
    IdVuelo: filters.IdVuelo ? Number(filters.IdVuelo) : undefined,
    CodigoReserva: filters.CodigoReserva || undefined,
    EstadoReserva: filters.EstadoReserva || undefined,
    OrigenCanalReserva: filters.OrigenCanalReserva || undefined,
    TotalMin: filters.TotalMin !== '' ? Number(filters.TotalMin) : undefined,
    TotalMax: filters.TotalMax !== '' ? Number(filters.TotalMax) : undefined,
    FechaReservaInicio: toIsoStringOrNull(filters.FechaReservaInicio) || undefined,
    FechaReservaFin: toIsoStringOrNull(filters.FechaReservaFin) || undefined,
    FechaInicioViaje: toIsoStringOrNull(filters.FechaInicioViaje) || undefined,
    FechaFinViaje: toIsoStringOrNull(filters.FechaFinViaje) || undefined,
    Page: Number(filters.Page || 1),
    PageSize: Number(filters.PageSize || 20)
  }
}

async function fetchCatalogs() {
  try {
    const [clientesResponse, pasajerosResponse, vuelosResponse, aeropuertosResponse] = await Promise.all([
      listClientes({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listPasajeros({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listVuelos({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listAeropuertos({ Page: 1, PageSize: 500, page: 1, page_size: 500 })
    ])

    clientes.value = Array.isArray(clientesResponse.data) ? clientesResponse.data : []
    pasajeros.value = Array.isArray(pasajerosResponse.data) ? pasajerosResponse.data : []
    vuelos.value = Array.isArray(vuelosResponse.data) ? vuelosResponse.data : []
    aeropuertos.value = Array.isArray(aeropuertosResponse.data) ? aeropuertosResponse.data : []

    if (!pasajeros.value.length) {
      feedbackError.value = 'No se recibieron pasajeros desde el endpoint. Revisa si el backend tiene registros cargados.'
    }
  } catch (error) {
    setError(error, 'No se pudieron cargar los catalogos de reservas.')
  }
}

async function fetchAsientos() {
  if (!form.idVuelo) {
    asientos.value = []
    return
  }

  loadingAsientos.value = true

  try {
    const data = await listAsientos(form.idVuelo)
    asientos.value = Array.isArray(data) ? data : []
  } catch (error) {
    setError(error, 'No se pudieron cargar los asientos del vuelo.')
  } finally {
    loadingAsientos.value = false
  }
}

async function fetchReservas() {
  loadingList.value = true

  try {
    const { data, meta: responseMeta } = await listReservas(buildReservaFilters())
    reservas.value = Array.isArray(data) ? data : []
    meta.value = responseMeta || {}
  } catch (error) {
    setError(error, 'No se pudieron cargar las reservas.')
  } finally {
    loadingList.value = false
  }
}

async function submitReserva() {
  if (!form.fechaInicio || !form.fechaFin) {
    feedbackError.value = 'Las fechas del viaje son obligatorias.'
    return
  }

  loadingSubmit.value = true

  try {
    await createReserva(buildReservaPayload())
    setSuccess('Reserva creada correctamente.')
    resetForm()
    await fetchReservas()
  } catch (error) {
    setError(error, 'No se pudo crear la reserva.')
  } finally {
    loadingSubmit.value = false
  }
}

async function cambiarEstado(reserva, nuevoEstado) {
  const idReserva = entityId(reserva, ['id_reserva', 'idReserva'])
  const estadoActual = entityValue(reserva, ['estado_reserva', 'estadoReserva'])

  if (nuevoEstado === estadoActual) {
    return
  }

  try {
    await updateReservaEstado(idReserva, {
      estadoReserva: nuevoEstado,
      motivoCancelacion: nuevoEstado === 'CAN' ? 'Cambio manual desde administracion' : null
    })

    setSuccess(`Estado actualizado a ${nuevoEstado}.`)
    await fetchReservas()
  } catch (error) {
    setError(error, 'No se pudo actualizar el estado de la reserva.')
  }
}

async function verDetalle(reserva) {
  detalleReserva.value = reserva
}

function resetForm() {
  form.idCliente = ''
  form.idPasajero = ''
  form.idVuelo = ''
  form.idAsiento = ''
  form.fechaInicio = ''
  form.fechaFin = ''
  form.subtotalReserva = 0
  form.valorIva = 0
  form.totalReserva = 0
  form.origenCanalReserva = 'WEB'
  form.contactoEmail = ''
  form.contactoTelefono = ''
  form.observaciones = ''
  asientos.value = []
}

async function limpiarFiltros() {
  filters.IdCliente = ''
  filters.IdPasajero = ''
  filters.IdVuelo = ''
  filters.CodigoReserva = ''
  filters.EstadoReserva = ''
  filters.OrigenCanalReserva = ''
  filters.TotalMin = ''
  filters.TotalMax = ''
  filters.FechaReservaInicio = ''
  filters.FechaReservaFin = ''
  filters.FechaInicioViaje = ''
  filters.FechaFinViaje = ''
  filters.Page = 1
  filters.PageSize = 20
  await fetchReservas()
}

onMounted(async () => {
  await fetchCatalogs()
  await fetchReservas()
})
</script>

<style scoped src="../admin.css"></style>
