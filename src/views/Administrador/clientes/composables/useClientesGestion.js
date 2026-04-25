import { computed, onMounted, reactive, ref } from 'vue'
import api from '@/api/axios'

export function useClientesGestion() {
  const clientes = ref([])
  const paises = ref([])
  const ciudades = ref([])

  const busquedaPais = ref('')
  const errorMsg = ref('')
  const successMsg = ref('')
  const editingCliente = ref(null)

  const form = reactive({
    tipoIdentificacion: 'CEDULA',
    numeroIdentificacion: '',
    nombres: '',
    apellidos: '',
    razonSocial: '',
    correo: '',
    telefono: '',
    direccion: '',
    idCiudadResidencia: null,
    idPaisNacionalidad: null,
    fechaNacimiento: '',
    nacionalidad: '',
    genero: 'MASCULINO',
    estado: 'ACTIVO'
  })

  const paisesFiltrados = computed(() =>
    paises.value.filter((pais) =>
      pais.nombre.toLowerCase().includes(busquedaPais.value.toLowerCase())
    )
  )

  const ciudadesFiltradas = computed(() => {
    if (!form.idPaisNacionalidad) return []
    return ciudades.value.filter((ciudad) => ciudad.idPais === form.idPaisNacionalidad)
  })

  function setError(error) {
    successMsg.value = ''
    if (error.response?.data?.errors) {
      errorMsg.value = Object.values(error.response.data.errors).flat().join(' | ')
    } else {
      errorMsg.value = error.response?.data?.title || error.response?.data?.message || error.message
    }
    console.error('API error:', error.response?.data ?? error)
  }

  function setSuccess(message) {
    errorMsg.value = ''
    successMsg.value = message
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  }

  async function fetchClientes() {
    const response = await api.get('/clientes', { params: { page: 1, page_size: 50 } })
    clientes.value = response.data.data
  }

  async function fetchPaises() {
    const response = await api.get('/paises', { params: { page: 1, page_size: 200 } })
    paises.value = response.data.data
  }

  async function fetchCiudades() {
    const response = await api.get('/ciudades', { params: { page: 1, page_size: 200 } })
    ciudades.value = response.data.data
  }

  function editCliente(cliente) {
    editingCliente.value = cliente
    busquedaPais.value = ''

    form.tipoIdentificacion = cliente.tipoIdentificacion ?? 'CEDULA'
    form.numeroIdentificacion = cliente.numeroIdentificacion ?? ''
    form.nombres = cliente.nombres ?? ''
    form.apellidos = cliente.apellidos ?? ''
    form.razonSocial = cliente.razonSocial ?? ''
    form.correo = cliente.correo ?? ''
    form.telefono = cliente.telefono ?? ''
    form.direccion = cliente.direccion ?? ''
    form.nacionalidad = cliente.nacionalidad ?? ''
    form.genero = cliente.genero ?? 'MASCULINO'
    form.estado = cliente.estado ?? 'ACTIVO'
    form.fechaNacimiento = cliente.fechaNacimiento ? cliente.fechaNacimiento.slice(0, 16) : ''
    form.idPaisNacionalidad = cliente.idPaisNacionalidad ?? null
    form.idCiudadResidencia = cliente.idCiudadResidencia ?? null
  }

  function buildPostPayload() {
    return {
      tipoIdentificacion: form.tipoIdentificacion,
      numeroIdentificacion: form.numeroIdentificacion,
      nombres: form.nombres,
      apellidos: form.apellidos,
      razonSocial: form.razonSocial || null,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      idCiudadResidencia: form.idCiudadResidencia ? Number(form.idCiudadResidencia) : null,
      idPaisNacionalidad: form.idPaisNacionalidad ? Number(form.idPaisNacionalidad) : null,
      fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento).toISOString() : null,
      nacionalidad: form.nacionalidad,
      genero: form.genero
    }
  }

  function buildPutPayload() {
    return {
      nombres: form.nombres,
      apellidos: form.apellidos,
      razonSocial: form.razonSocial || null,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      idCiudadResidencia: form.idCiudadResidencia ? Number(form.idCiudadResidencia) : null,
      idPaisNacionalidad: form.idPaisNacionalidad ? Number(form.idPaisNacionalidad) : null,
      fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento).toISOString() : null,
      nacionalidad: form.nacionalidad,
      genero: form.genero,
      estado: form.estado
    }
  }

  async function submitCliente() {
    errorMsg.value = ''

    try {
      if (editingCliente.value) {
        await api.put(`/clientes/${editingCliente.value.idCliente}`, buildPutPayload())
        setSuccess('Cliente actualizado')
      } else {
        await api.post('/clientes', buildPostPayload())
        setSuccess('Cliente creado')
      }

      resetForm()
      fetchClientes()
    } catch (error) {
      setError(error)
    }
  }

  async function deleteCliente(cliente) {
    if (!confirm(`Eliminar a ${cliente.nombres} ${cliente.apellidos}?`)) return

    try {
      await api.delete(`/clientes/${cliente.idCliente}`)
      setSuccess('Cliente eliminado')
      fetchClientes()
    } catch (error) {
      setError(error)
    }
  }

  function resetForm() {
    form.tipoIdentificacion = 'CEDULA'
    form.numeroIdentificacion = ''
    form.nombres = ''
    form.apellidos = ''
    form.razonSocial = ''
    form.correo = ''
    form.telefono = ''
    form.direccion = ''
    form.idCiudadResidencia = null
    form.idPaisNacionalidad = null
    form.fechaNacimiento = ''
    form.nacionalidad = ''
    form.genero = 'MASCULINO'
    form.estado = 'ACTIVO'
    busquedaPais.value = ''
    editingCliente.value = null
  }

  onMounted(() => {
    fetchClientes()
    fetchPaises()
    fetchCiudades()
  })

  return {
    clientes,
    busquedaPais,
    ciudadesFiltradas,
    deleteCliente,
    editCliente,
    editingCliente,
    errorMsg,
    form,
    paisesFiltrados,
    resetForm,
    submitCliente,
    successMsg
  }
}
