<template>
  <div
    class="payment-backdrop"
    @click.self="$emit('close')"
  >
    <section class="payment-modal card border-0 shadow-lg rounded-5 overflow-hidden">
      <div class="payment-hero text-white p-4">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p class="text-uppercase small fw-bold opacity-75 mb-1">Pasarela segura</p>
            <h2 class="h4 fw-bold mb-1">Confirmar pago</h2>
            <p class="mb-0 opacity-75 small">{{ payment?.label || 'Factura seleccionada' }}</p>
          </div>
          <button class="btn btn-light btn-sm rounded-pill fw-bold px-3" :disabled="loading" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>

      <div class="card-body p-4">
        <div class="payment-summary rounded-4 p-3 mb-4">
          <span class="small text-muted text-uppercase fw-bold d-block">Total a pagar</span>
          <strong class="fs-2 text-dark">{{ payment?.totalDisplay || 'Total pendiente' }}</strong>
          <span class="badge rounded-pill bg-warning text-dark ms-2">ABI</span>
        </div>

        <div v-if="error" class="alert alert-danger border-0 shadow-sm small">
          {{ error }}
        </div>

        <form class="row g-3" @submit.prevent="$emit('confirm', cardForm)">
          <div class="col-12">
            <label class="form-label text-uppercase small fw-bold text-muted">Numero de tarjeta</label>
            <input
              v-model.trim="cardForm.number"
              class="form-control payment-input"
              inputmode="numeric"
              maxlength="19"
              placeholder="4242 4242 4242 4242"
              required
              :disabled="loading"
            />
          </div>

          <div class="col-12">
            <label class="form-label text-uppercase small fw-bold text-muted">Nombre del titular</label>
            <input
              v-model.trim="cardForm.name"
              class="form-control payment-input"
              placeholder="Nombre como aparece en la tarjeta"
              required
              :disabled="loading"
            />
          </div>

          <div class="col-6">
            <label class="form-label text-uppercase small fw-bold text-muted">Expira</label>
            <input
              v-model.trim="cardForm.expiration"
              class="form-control payment-input"
              maxlength="5"
              placeholder="MM/AA"
              required
              :disabled="loading"
            />
          </div>

          <div class="col-6">
            <label class="form-label text-uppercase small fw-bold text-muted">CVV</label>
            <input
              v-model.trim="cardForm.cvv"
              class="form-control payment-input"
              inputmode="numeric"
              maxlength="4"
              placeholder="123"
              required
              :disabled="loading"
            />
          </div>

          <div class="col-12 pt-2">
            <button class="btn btn-danger w-100 fw-bold rounded-pill py-3" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              {{ loading ? 'Procesando pago seguro...' : 'Confirmar Pago' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  payment: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

defineEmits(['close', 'confirm'])

const cardForm = reactive({
  number: '',
  name: '',
  expiration: '',
  cvv: ''
})

watch(
  () => props.payment?.idFactura,
  () => {
    cardForm.number = ''
    cardForm.name = ''
    cardForm.expiration = ''
    cardForm.cvv = ''
  }
)
</script>

<style scoped>
.payment-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(6px);
}

.payment-modal {
  width: min(100%, 520px);
}

.payment-hero {
  background: linear-gradient(135deg, #d60f2b, #a00824, #42000e);
}

.payment-summary {
  background: linear-gradient(135deg, #fff7f8, #ffffff);
  border: 1px solid #ffe1e6;
}

.payment-input {
  min-height: 48px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.payment-input:focus {
  border-color: #d60f2b;
  box-shadow: 0 0 0 0.2rem rgba(214, 15, 43, 0.12);
}
</style>
