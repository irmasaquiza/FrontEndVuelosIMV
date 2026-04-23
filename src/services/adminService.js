import api from '../api/axios'

function extractPayload(response) {
  const payload = response?.data

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return {
      data: payload.data,
      meta: payload.meta ?? null
    }
  }

  return {
    data: payload,
    meta: null
  }
}

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}

export async function listPaises(filters = {}) {
  const response = await api.get('/paises', {
    params: cleanParams(filters)
  })

  return extractPayload(response)
}

export async function listCiudades(filters = {}) {
  const response = await api.get('/ciudades', {
    params: cleanParams(filters)
  })

  return extractPayload(response)
}

export async function createCiudad(payload) {
  const response = await api.post('/ciudades', payload)
  return extractPayload(response).data
}

export async function updateCiudad(idCiudad, payload) {
  const response = await api.put(`/ciudades/${idCiudad}`, payload)
  return extractPayload(response).data
}

export async function deleteCiudad(idCiudad) {
  await api.delete(`/ciudades/${idCiudad}`)
}

export async function listAeropuertos(filters = {}) {
  const response = await api.get('/aeropuertos', {
    params: cleanParams(filters)
  })

  return extractPayload(response)
}

export async function createAeropuerto(payload) {
  const response = await api.post('/aeropuertos', payload)
  return extractPayload(response).data
}

export async function updateAeropuerto(idAeropuerto, payload) {
  const response = await api.put(`/aeropuertos/${idAeropuerto}`, payload)
  return extractPayload(response).data
}

export async function deleteAeropuerto(idAeropuerto) {
  await api.delete(`/aeropuertos/${idAeropuerto}`)
}

export async function listVuelos(filters = {}) {
  const response = await api.get('/vuelos', {
    params: cleanParams(filters)
  })

  return extractPayload(response)
}

export async function createVuelo(payload) {
  const response = await api.post('/vuelos', payload)
  return extractPayload(response).data
}

export async function updateVuelo(idVuelo, payload) {
  const response = await api.put(`/vuelos/${idVuelo}`, payload)
  return extractPayload(response).data
}

export async function updateVueloEstado(idVuelo, estadoVuelo) {
  const response = await api.patch(`/vuelos/${idVuelo}/estado`, {
    estado_vuelo: estadoVuelo
  })

  return extractPayload(response).data
}

export async function deleteVuelo(idVuelo) {
  await api.delete(`/vuelos/${idVuelo}`)
}

export async function listEscalas(idVuelo) {
  const response = await api.get(`/vuelos/${idVuelo}/escalas`)
  return extractPayload(response).data
}

export async function createEscala(idVuelo, payload) {
  const response = await api.post(`/vuelos/${idVuelo}/escalas`, payload)
  return extractPayload(response).data
}

export async function deleteEscala(idVuelo, idEscala) {
  await api.delete(`/vuelos/${idVuelo}/escalas/${idEscala}`)
}

export async function listAsientos(idVuelo, filters = {}) {
  const response = await api.get(`/vuelos/${idVuelo}/asientos`, {
    params: cleanParams(filters)
  })

  return extractPayload(response).data
}

export async function createAsiento(idVuelo, payload) {
  const response = await api.post(`/vuelos/${idVuelo}/asientos`, payload)
  return extractPayload(response).data
}

export async function updateAsientoDisponibilidad(idVuelo, idAsiento, disponible) {
  const response = await api.patch(`/vuelos/${idVuelo}/asientos/${idAsiento}`, {
    disponible
  })

  return extractPayload(response).data
}
