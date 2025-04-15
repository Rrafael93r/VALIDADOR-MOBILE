"use client"

import axios from "axios"



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

const API_TRAMITADOR = import.meta.env.VITE_API_TRAMITADOR;

export const authService = {
  async login(usuario: string, contrasena: string) {
    try {

      // Primero, buscar el tramitador por usuario para obtener la identificación
      const tramitadores = await axios.get(`${API_TRAMITADOR}`)

      const tramitador = tramitadores.data.find((t: any) => t.usuario === usuario)
      if (!tramitador) {
        throw new Error("Usuario no encontrado")
      }


      // Ahora hacer login con identificación y contraseña
      const response = await axios.post(`${API_TRAMITADOR}/login`, {
        identificacion: tramitador.identificacion,
        contrasena,
      })


      if (response.data) {
        return response.data
      }

      throw new Error("Credenciales inválidas")
    } catch (error: any) {
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

      const registerResponse = await axios.post(API_TRAMITADOR, dataToSend)
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
