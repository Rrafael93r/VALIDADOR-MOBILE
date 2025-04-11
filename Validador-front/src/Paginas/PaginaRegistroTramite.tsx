"use client"

import Header from "../Componentes/Header"
import Registrotramite from "../Componentes/Registrotramite"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"

const PaginaRegistroTramite = () => {
  const { user, hasPermission } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar si el usuario tiene permiso para acceder a esta página
    if (user && !hasPermission("Paciente")) {
      navigate("/acceso-denegado")
    }
  }, [user, hasPermission, navigate])

  return (
    <>
      <Header />
      <Registrotramite />
    </>
  )
}

export default PaginaRegistroTramite
