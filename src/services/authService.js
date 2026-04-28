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

export async function registerAccount(payload) {
  const response = await api.post('/auth/register', payload)
  return extractPayload(response).data
}
