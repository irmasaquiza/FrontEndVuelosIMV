<template>
  <section class="admin-page">

    <h1>Facturas 💳</h1>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <!-- FORM -->
    <div class="panel">
      <h3>Nueva factura</h3>

      <form @submit.prevent="submitFactura" class="grid">

        <!-- RESERVA -->
        <label>
          Reserva *
          <select v-model="form.idReserva">
            <option value="">Selecciona</option>
            <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
              {{ r.codigoReserva || 'Reserva #' + r.idReserva }}
            </option>
          </select>
        </label>

        <!-- CLIENTE AUTO -->
        <label>
          Cliente
          <select v-model="form.idCliente" disabled>
            <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
              {{ c.nombres }} {{ c.apellidos }}
            </option>
          </select>
        </label>

        <!-- SUBTOTAL -->
        <label>
          Subtotal
          <input :value="form.subtotal" disabled />
        </label>

        <!-- IVA -->
        <label>
          IVA
          <input :value="form.valorIva" disabled />
        </label>

        <!-- CARGO -->
        <label>
          Cargo servicio
          <input v-model.number="form.cargoServicio" @input="calcularTotal" />
        </label>

        <!-- TOTAL -->
        <label>
          Total
          <input :value="form.total" disabled />
        </label>

        <!-- OTROS -->
        <label>
          Canal
          <input v-model="form.origenCanalFactura" />
        </label>

        <label>
          Observaciones
          <input v-model="form.observacionesFactura" />
        </label>

        <button>Emitir factura</button>

      </form>
    </div>

    <!-- LISTA -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Factura</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!facturas.length">
          <td colspan="4">No hay facturas registradas.</td>
        </tr>
        <tr v-for="f in facturas" :key="f.idFactura">
          <td>{{ f.numeroFactura || 'Factura #' + f.idFactura }}</td>
          <td>${{ f.total }}</td>
          <td>{{ f.estado }}</td>
          <td class="acciones">
            <button
              class="btn-aprobar"
              :disabled="!canAprobarFactura(f)"
              @click="aprobarFacturaItem(f)"
            >
              Aprobar
            </button>
            <button
              class="btn-anular"
              :disabled="!canAnularFactura(f)"
              @click="anularFactura(f)"
            >
              Anular
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/api/axios'

const clientes = ref([])
const reservas = ref([])
const facturas = ref([])

const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  idCliente: '',
  idReserva: '',
  subtotal: 0,
  valorIva: 0,
  cargoServicio: 0,
  total: 0,
  observacionesFactura: '',
  origenCanalFactura: 'WEB'
})

/* 🔥 AUTO COMPLETAR DESDE RESERVA */
watch(
  () => form.idReserva,
  () => {
    if (!form.idReserva) return

    const r = reservas.value.find(
      r => String(r.idReserva) === String(form.idReserva)
    )

    console.log("RESERVA:", r)

    if (r) {
      form.idCliente = r.idCliente
      form.subtotal = r.subtotalReserva
      form.valorIva = r.valorIva
      form.total = r.totalReserva
    }
  }
)

/* 🔥 RECALCULAR TOTAL */
function calcularTotal() {
  form.total =
    Number(form.subtotal || 0) +
    Number(form.valorIva || 0) +
    Number(form.cargoServicio || 0)
}

/* ---------------- FETCH ---------------- */

async function fetchAll() {
  const resClientes = await api.get('/clientes',{params:{page:1,page_size:100}})
  const resReservas = await api.get('/reservas',{params:{page:1,page_size:100}})

  console.log("RESERVAS LISTA:", resReservas.data)

  clientes.value = resClientes.data.data
  reservas.value = resReservas.data.data

  fetchFacturas()
}

async function fetchFacturas() {
  const res = await api.get('/facturas',{params:{page:1,page_size:50}})
  facturas.value = res.data.data
}

/* ---------------- CREATE ---------------- */

async function submitFactura() {
  try {

    const payload = {
      idCliente: Number(form.idCliente),
      idReserva: Number(form.idReserva),
      subtotal: Number(form.subtotal),
      valorIva: Number(form.valorIva),
      cargoServicio: Number(form.cargoServicio),
      total: Number(form.total),
      observacionesFactura: form.observacionesFactura,
      origenCanalFactura: form.origenCanalFactura
    }

    console.log("🚀 JSON FACTURA:", payload)

    await api.post('/facturas', payload)

    successMsg.value = "Factura creada 🔥"
    fetchFacturas()

  } catch (e) {
    console.log(e)
    errorMsg.value = e.message
  }
}

/* ---------------- ANULAR ---------------- */

async function anularFactura(f) {
  try {
    await api.patch(`/facturas/${f.idFactura}/anular`, {})
    successMsg.value = 'Factura anulada correctamente'
    errorMsg.value = ''
    fetchFacturas()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || e.message
  }
}

async function aprobarFacturaItem(f) {
  try {
    await api.patch(`/facturas/${f.idFactura}/aprobar`, {})
    successMsg.value = 'Factura aprobada correctamente'
    errorMsg.value = ''
    fetchFacturas()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || e.message
  }
}

function canAprobarFactura(f) {
  const estado = String(f.estado || '').toUpperCase()
  return estado !== 'ANULADA' && estado !== 'APROBADA'
}

function canAnularFactura(f) {
  const estado = String(f.estado || '').toUpperCase()
  return estado !== 'ANULADA'
}

/* ---------------- INIT ---------------- */

onMounted(fetchAll)
</script>

<style>
.admin-page{padding:20px}
.panel{margin:20px 0;padding:15px;border:1px solid #ccc}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tabla{width:100%;margin-top:15px;border-collapse:collapse}
.tabla td,.tabla th{border:1px solid #ccc;padding:8px}
.acciones{display:flex;gap:8px;flex-wrap:wrap}
.btn-aprobar{background:#dcfce7;color:#166534;border:1px solid #86efac;padding:8px 12px;border-radius:8px;cursor:pointer}
.btn-anular{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;padding:8px 12px;border-radius:8px;cursor:pointer}
.btn-aprobar:disabled,.btn-anular:disabled{opacity:.55;cursor:not-allowed}
.error{color:red}
.success{color:green}
</style>
