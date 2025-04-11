"use client"

import axios from "axios"

const API_URL = "http://10.0.1.249:8080/api/tramitador"

export interface TramitadorData {
  identificacion: string
  tipoIdentificacion: string
  nombre: string
  telefono: string
  direccion: string
  soporteAdjunto1: string
  soporteAdjunto2: string
  estado: string
  usuario: string
  contrasena: string
  perfil: string
}

export const authService = {
  async login(usuario: string, contrasena: string) {
    try {
      console.log("Intentando login con usuario:", usuario)

      // Primero, buscar el tramitador por usuario para obtener la identificación
      const tramitadores = await axios.get(`${API_URL}`)
      console.log("Tramitadores obtenidos:", tramitadores.data.length)

      const tramitador = tramitadores.data.find((t: any) => t.usuario === usuario)
      if (!tramitador) {
        console.error("Usuario no encontrado:", usuario)
        throw new Error("Usuario no encontrado")
      }

      console.log("Tramitador encontrado:", tramitador.identificacion)

      // Ahora hacer login con identificación y contraseña
      const response = await axios.post(`${API_URL}/login`, {
        identificacion: tramitador.identificacion,
        contrasena,
      })

      console.log("Respuesta de login:", response.status)

      if (response.data) {
        console.log("Datos de usuario recibidos:", response.data)
        return response.data
      }

      throw new Error("Credenciales inválidas")
    } catch (error: any) {
      console.error("Error en login:", error)
      if (error.response?.status === 401) {
        throw new Error("Usuario o contraseña incorrectos")
      }
      throw new Error(error.message || "Error al iniciar sesión. Por favor intente más tarde.")
    }
  },

  async register(tramitadorData: TramitadorData) {
    try {
      // Validaciones del lado del cliente
      if (!this.validatePassword(tramitadorData.contrasena)) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Corregir nombres de propiedades para que coincidan con el backend
      const dataToSend = {
        ...tramitadorData,
        soporteAdjunto1: tramitadorData.soporteAdjunto1,
        soporteAdjunto2: tramitadorData.soporteAdjunto2,
        perfil: tramitadorData.perfil || "Tramitador" // Valor por defecto
      }

      const registerResponse = await axios.post(API_URL, dataToSend)
      return registerResponse.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || "Error al registrar usuario")
    }
  },

  logout() {
    localStorage.removeItem("user")
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error("Error al parsear usuario actual:", error)
      return null
    }
  },

  isAuthenticated() {
    return !!this.getCurrentUser()
  },

  // Utilidades de validación
  validatePassword(password: string): boolean {
    return password.length >= 8
  },

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  },
}
