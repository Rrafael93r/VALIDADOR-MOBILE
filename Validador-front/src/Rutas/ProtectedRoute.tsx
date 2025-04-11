"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login")
      } else if (requiredRole && !hasPermission(requiredRole)) {
        navigate("/acceso-denegado")
      }
    }
  }, [isAuthenticated, loading, navigate, requiredRole, hasPermission])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
