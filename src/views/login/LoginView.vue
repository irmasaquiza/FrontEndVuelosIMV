<template>
  <LoginPanel
    :errors="errors"
    :form="form"
    :general-error="generalError"
    :loading="loading"
    :show-password="showPassword"
    :touched="touched"
    @submit-login="handleLogin"
    @toggle-password="togglePasswordVisibility"
  />
</template>

<script setup>
import LoginPanel from './components/LoginPanel.vue'
import { useLogin } from './composables/useLogin'

const {
  errors,
  form,
  generalError,
  handleLogin,
  loading,
  showPassword,
  togglePasswordVisibility,
  touched
} = useLogin()
</script>
