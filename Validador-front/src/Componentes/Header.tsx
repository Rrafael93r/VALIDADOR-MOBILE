"use client"

import { useState, useEffect } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"
import { Menu, X } from "lucide-react"
import ImgLogoNombre from "../assets/letras zafiro.png"

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  // Determinar si el usuario es tramitador o paciente
  const isTramitador = user?.perfil === "Tramitador"
  const isPaciente = user?.perfil === "Paciente"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setMenuOpen(false)
  }, [navigate])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ backgroundColor: "#31529c" }}>
      <div className="container">
        <a className="navbar-brand fw-bold d-flex align-items-center" href="/dashboard" aria-label="Ir al dashboard">
          <img
            src={ImgLogoNombre}
            alt="Logo de la aplicación"
            width="150"
            height="auto"
            className="img-fluid"
          />
        </a>

        <button
          className="navbar-toggler border-light"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarSupportedContent"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item mx-1">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-pill ${isActive ? "bg-white text-primary" : "text-white"}`
                }
                to="/dashboard"
              >
                Inicio
              </NavLink>
            </li>

            {/* Solo mostrar "Trámite" para pacientes */}
            {isPaciente && (
              <li className="nav-item mx-1">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-pill ${isActive ? "bg-white text-primary" : "text-white"}`
                  }
                  to="/RegistroTramite"
                >
                  Trámite
                </NavLink>
              </li>
            )}

            {/* Historial visible para todos */}
            <li className="nav-item mx-1">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-pill ${isActive ? "bg-white text-primary" : "text-white"}`
                }
                to="/historial"
              >
                Historial
              </NavLink>
            </li>

            {/* Ajustar cuenta visible para todos */}
            <li className="nav-item mx-1">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-pill ${isActive ? "bg-white text-primary" : "text-white"}`
                }
                to="/AdministrarUsuario"
              >
                Ajustar Cuenta
              </NavLink>
            </li>

            <li className="nav-item mx-1">
              <button
                className="nav-link text-white px-3 py-2 rounded-pill border-0"
                style={{ backgroundColor: "#2e91f3", cursor: "pointer" }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
