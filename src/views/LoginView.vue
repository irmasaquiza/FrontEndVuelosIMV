<template>
  <div>
    <h1>Login ✈️</h1>

    <input v-model="login" placeholder="Usuario" />
    <br /><br />

    <input v-model="password" type="password" placeholder="Contraseña" />
    <br /><br />

    <button @click="handleLogin">Ingresar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const login = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', {
      login: login.value,
      password: password.value
    })

    console.log(res.data)

    const token = res.data.data.token

    localStorage.setItem('token', token)

    alert('Login correcto 🔥')

    router.push('/home')
  } catch (error) {
    console.error(error)
    alert('Error en login 😢')
  }
}
</script>