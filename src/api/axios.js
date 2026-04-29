import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:44361/api/v1',
  //baseURL: 'https://microserviciovuelosapi20260421231751-ebfchba0auh0ekat.brazilsouth-01.azurewebsites.net/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
