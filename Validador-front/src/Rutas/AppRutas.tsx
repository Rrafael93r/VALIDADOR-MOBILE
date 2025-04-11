"use client"

import type React from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "../Servicios/useAuth"
import Login from "../Paginas/Login"
import Register from "../Paginas/Register"
import PaginaPrincipal from "../Paginas/PaginaPrincipal"
import Registrotramite from "../Paginas/PaginaRegistroTramite"
import AdministrarUsuario from "../Paginas/PaginaAjusteUsuario"
import Historial from "../Paginas/PaginaHistorial"
import AccesoDenegado from "../Paginas/AccesoDenegado"
import { useEffect } from "react"

function AppRoutes() {
    return (
        <AuthProvider>
            {/* Elimina el Router de aquí */}
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/acceso-denegado" element={<AccesoDenegado />} />

                {/* Rutas protegidas con layout común */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <>
                                <PaginaPrincipal />
                            </>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/AdministrarUsuario"
                    element={
                        <ProtectedRoute>
                            <>
                                <AdministrarUsuario />
                            </>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/historial"
                    element={
                        <ProtectedRoute>
                            <>
                                <Historial />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* Ruta solo para pacientes */}
                <Route
                    path="/RegistroTramite"
                    element={
                        <ProtectedRoute requiredRole="Paciente">
                            <>
                                <Registrotramite />
                            </>
                        </ProtectedRoute>
                    }
                />

                {/* Redirección por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    )
}

// Componente para proteger rutas
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
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

export default AppRoutes