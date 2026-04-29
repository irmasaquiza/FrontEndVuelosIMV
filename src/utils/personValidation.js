export const DOCUMENT_MESSAGES = {
  CEDULA: 'La cédula debe tener 10 dígitos numéricos',
  RUC: 'El RUC debe tener 13 dígitos numéricos válidos',
  PASAPORTE: 'El pasaporte debe tener entre 6 y 9 caracteres alfanuméricos'
}

export const EMAIL_MESSAGE = 'Ingrese un correo electrónico válido'
export const BIRTH_DATE_MESSAGE = 'Debes ser mayor de 18 años para realizar una reserva'
export const PHONE_MESSAGE = 'El número de teléfono debe tener 10 dígitos numéricos'

export function sanitizeDocument(value = '', documentType = 'CEDULA') {
  if (documentType === 'PASAPORTE') {
    return String(value).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9)
  }

  return String(value).replace(/\D/g, '').slice(0, documentType === 'RUC' ? 13 : 10)
}

export function sanitizeEmail(value = '') {
  return String(value).replace(/\s/g, '')
}

export function sanitizePhone(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 10)
}

export function validateCedula(cedula = '') {
  if (!/^\d{10}$/.test(cedula)) return false

  const province = Number(cedula.slice(0, 2))
  const thirdDigit = Number(cedula[2])
  if (province < 1 || province > 24 || thirdDigit > 5) return false

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  const sum = coefficients.reduce((total, coefficient, index) => {
    const product = Number(cedula[index]) * coefficient
    return total + (product > 9 ? product - 9 : product)
  }, 0)

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === Number(cedula[9])
}

export function getDocumentError(value = '', documentType = 'CEDULA') {
  if (documentType === 'CEDULA') {
    return validateCedula(value) ? '' : DOCUMENT_MESSAGES.CEDULA
  }

  if (documentType === 'RUC') {
    return /^\d{13}$/.test(value) && validateCedula(value.slice(0, 10)) ? '' : DOCUMENT_MESSAGES.RUC
  }

  return /^[a-zA-Z0-9]{6,9}$/.test(value) ? '' : DOCUMENT_MESSAGES.PASAPORTE
}

export function getEmailError(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : EMAIL_MESSAGE
}

export function getPhoneError(value = '') {
  return /^\d{10}$/.test(value) ? '' : PHONE_MESSAGE
}

export function getBirthDateError(value = '') {
  if (!value) return BIRTH_DATE_MESSAGE

  const birthDate = new Date(value)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return Number.isNaN(birthDate.getTime()) || age < 18 ? BIRTH_DATE_MESSAGE : ''
}

export function getDocumentMeta(documentType = 'CEDULA') {
  if (documentType === 'RUC') {
    return { inputMode: 'numeric', maxLength: 13, placeholder: 'Ej. 1712345678001' }
  }

  if (documentType === 'PASAPORTE') {
    return { inputMode: 'text', maxLength: 9, placeholder: 'Ej. AB123456' }
  }

  return { inputMode: 'numeric', maxLength: 10, placeholder: 'Ej. 1712345678' }
}
