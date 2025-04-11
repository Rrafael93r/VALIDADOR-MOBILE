"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authService } from "./authServices"

interface User {
  usuario: string
  nombre: string
  tipoIdentificacion: string
  identificacion: string
  perfil?: string
  [key: string]: any
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  login: (usuario: string, contrasena: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  hasPermission: (role: string | string[]) => boolean
}

// Crear un valor por defecto para el contexto
const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  checkAuth: () => {},
  hasPermission: () => false,
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const userStr = localStorage.getItem("user")
      console.log("checkAuth - userStr:", userStr)

      if (userStr && userStr !== "undefined" && userStr !== "null") {
        try {
          const currentUser = JSON.parse(userStr)
          if (currentUser && currentUser.identificacion) {
            setIsAuthenticated(true)
            setUser(currentUser)
            console.log("Usuario autenticado:", currentUser)
          } else {
            console.warn("Datos de usuario incompletos:", currentUser)
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem("user")
          }
        } catch (parseError) {
          console.error("Error al parsear datos de usuario:", parseError)
          setIsAuthenticated(false)
          setUser(null)
          localStorage.removeItem("user")
        }
      } else {
        console.log("No hay datos de usuario en localStorage")
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (usuario: string, contrasena: string) => {
    try {
      // Llamar al servicio de autenticación
      const userData = await authService.login(usuario, contrasena)

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Verificar que se guardó correctamente
      const savedUser = localStorage.getItem("user")
      console.log("Usuario guardado en localStorage:", savedUser)

      // Actualizar estado
      setIsAuthenticated(true)
      setUser(userData)
    } catch (error) {
      console.error("Error durante login:", error)
      throw error
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("user")
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error("Error durante logout:", error)
    }
  }

  // Función para verificar si el usuario tiene un rol específico
  const hasPermission = (role: string | string[]) => {
    // Si no hay usuario autenticado, no tiene permisos
    if (!user) return false

    // Si el usuario es paciente, tiene acceso a todo
    if (user.perfil === "Paciente") return true

    // Verificar si el rol del usuario coincide con el rol requerido
    if (Array.isArray(role)) {
      return role.includes(user.perfil || "")
    } else {
      return user.perfil === role
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuth,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
