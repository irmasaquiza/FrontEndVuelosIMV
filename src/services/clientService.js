import api from '../api/axios'

function extractPayload(response) {
  const payload = response?.data
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return { data: payload.data, meta: payload.meta ?? null }
  }
  return { data: payload, meta: null }
}

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}

export async function listAeropuertos(filters = {}) {
  const params = cleanParams({ PageSize: 1000, page_size: 1000, ...filters })
  const response = await api.get('/aeropuertos', { params })
  return extractPayload(response)
}

export async function searchVuelos(filters = {}) {
  const params = cleanParams({ PageSize: 1000, page_size: 1000, ...filters })
  const response = await api.get('/vuelos', { params })
  return extractPayload(response)
}

export async function listAsientos(idVuelo, filters = {}) {
  const response = await api.get(`/vuelos/${idVuelo}/asientos`, { params: cleanParams(filters) })
  return extractPayload(response).data
}

export async function createPasajero(payload) {
  const response = await api.post('/pasajeros', payload)
  return extractPayload(response).data
}

export async function createReserva(payload) {
  const response = await api.post('/reservas', payload)
  return extractPayload(response).data
}

export async function listMyReservations(filters = {}) {
  const response = await api.get('/reservas', { params: cleanParams(filters) })
  return extractPayload(response)
}

export async function confirmReserva(idReserva) {
  const response = await api.post(`/reservas/${idReserva}/confirmar`, null)
  return extractPayload(response).data
}

export async function cancelReserva(idReserva) {
  const response = await api.post(`/reservas/${idReserva}/cancelar`, null)
  return extractPayload(response).data
}

export async function listMyBoletos() {
  const response = await api.get('/boletos/mis-boletos')
  return extractPayload(response)
}

export async function listMyFacturas(filters = {}) {
  const params = cleanParams({ PageSize: 1000, page_size: 1000, ...filters })
  const response = await api.get('/facturas', { params })
  return extractPayload(response)
}

export async function listEquipaje(idBoleto) {
  const response = await api.get(`/boletos/${idBoleto}/equipaje`)
  return extractPayload(response).data
}

export async function createEquipaje(idBoleto, payload) {
  const response = await api.post(`/boletos/${idBoleto}/equipaje`, payload)
  return extractPayload(response).data
}

export async function updateEquipajeEstado(idBoleto, idEquipaje, estadoEquipaje) {
  const response = await api.patch(`/boletos/${idBoleto}/equipaje/${idEquipaje}/estado`, {
    estadoEquipaje
  })
  return extractPayload(response).data
}

export async function approveFactura(idFactura) {
  const response = await api.patch(`/facturas/${idFactura}/aprobar`, null)
  return extractPayload(response).data
}
