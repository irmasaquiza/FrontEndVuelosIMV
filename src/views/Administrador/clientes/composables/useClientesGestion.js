import { computed, onMounted, reactive, ref } from 'vue'
import api from '@/api/axios'

export function useClientesGestion() {
  const clientes = ref([])
  const loadingClientes = ref(false)
  const clientesPage = ref(1)
  const clientesPageSize = ref(20)
  const clientesTotal = ref(0)
  const clientesTotalPages = ref(1)
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
    return ciudades.value.filter((ciudad) => String(ciudad.idPais) === String(form.idPaisNacionalidad))
  })

  const canNextClientePage = computed(() => {
    if (clientesTotalPages.value > clientesPage.value) {
      return true
    }

    return !clientesTotal.value && clientes.value.length === clientesPageSize.value
  })

  function setError(error, fallback = '') {
    successMsg.value = ''
    if (error?.response?.data?.errors) {
      errorMsg.value = Object.values(error.response.data.errors).flat().join(' | ')
    } else {
      errorMsg.value =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        error?.response?.data?.detalle ||
        error?.response?.data?.title ||
        error?.message ||
        fallback ||
        'Ha ocurrido un error inesperado.'
    }
    console.error('API error:', error?.response?.data ?? error)
  }

  function setSuccess(message) {
    errorMsg.value = ''
    successMsg.value = message
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  }

  function readClientesMeta(response) {
    const meta = response.data?.meta || {}
    const total =
      response.data?.total ||
      response.data?.totalRecords ||
      response.data?.total_registros ||
      meta.total ||
      meta.totalRecords ||
      meta.total_registros ||
      0

    const totalPages =
      response.data?.totalPages ||
      response.data?.total_pages ||
      meta.totalPages ||
      meta.total_pages ||
      0

    clientesTotal.value = Number(total || 0)

    if (totalPages) {
      clientesTotalPages.value = Number(totalPages)
      return
    }

    if (total) {
      clientesTotalPages.value = Math.max(1, Math.ceil(total / clientesPageSize.value))
      return
    }

    clientesTotalPages.value = clientes.value.length === clientesPageSize.value
      ? clientesPage.value + 1
      : clientesPage.value
  }

  async function fetchClientes(page = clientesPage.value) {
    loadingClientes.value = true

    try {
      const response = await api.get('/clientes', {
        params: {
          Page: page,
          PageSize: clientesPageSize.value,
          page,
          page_size: clientesPageSize.value
        }
      })

      clientes.value = response.data.data ?? response.data ?? []
      clientesPage.value = page
      readClientesMeta(response)
    } catch (error) {
      setError(error)
    } finally {
      loadingClientes.value = false
    }
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
    canNextClientePage,
    ciudadesFiltradas,
    clientesPage,
    clientesPageSize,
    clientesTotal,
    clientesTotalPages,
    deleteCliente,
    editCliente,
    editingCliente,
    errorMsg,
    fetchClientes,
    form,
    loadingClientes,
    paisesFiltrados,
    resetForm,
    submitCliente,
    successMsg
  }
}
