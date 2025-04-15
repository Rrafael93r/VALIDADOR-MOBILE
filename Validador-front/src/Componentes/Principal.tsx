"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"
import { FileText, History, User } from "lucide-react"

const PaginaPrincipal = () => {
  const { user } = useAuth()

  // Determinar si el usuario es tramitador o paciente
  const isPaciente = user?.perfil === "Paciente"

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Bienvenido a la plataforma</h2>

              {user && (
                <div className="p-3 bg-light rounded">
                  <h4>Información del usuario</h4>
                  <p>
                    <strong>Usuario:</strong> {user.usuario}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {user.nombre}
                  </p>
                  <p>
                    <strong>Documento:</strong> {user.tipoIdentificacion} {user.identificacion}
                  </p>
                  <p>
                    <strong>Perfil:</strong> {user.perfil || "No especificado"}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h4>Funcionalidades disponibles</h4>
                <div className="row mt-3">
                  {/* Gestión de trámites - Solo visible para pacientes */}
                  {isPaciente && (
                    <div className="col-md-4 mb-3">
                      <div className="card h-100 border-primary">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="rounded-circle p-2 me-2" style={{ backgroundColor: "#e6f0ff" }}>
                              <FileText size={24} className="text-primary" />
                            </div>
                            <h5 className="card-title mb-0">Gestión de trámites</h5>
                          </div>
                          <p className="card-text">Administra tus trámites en curso y solicita nuevos servicios.</p>
                          <Link
                            to="/RegistroTramite"
                            className="btn btn-primary w-100"
                            style={{ backgroundColor: "#31529c" }}
                          >
                            Acceder
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Historial - Visible para todos */}
                  <div className="col-md-4 mb-3">
                    <div className="card h-100 border-primary">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle p-2 me-2" style={{ backgroundColor: "#e6f0ff" }}>
                            <History size={24} className="text-primary" />
                          </div>
                          <h5 className="card-title mb-0">Historial</h5>
                        </div>
                        <p className="card-text">Consulta el historial de tus trámites y solicitudes en proceso.</p>
                        <Link to="/historial" className="btn btn-primary w-100" style={{ backgroundColor: "#31529c" }}>
                          Acceder
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Gestión de usuario - Visible para todos */}
                  <div className="col-md-4 mb-3">
                    <div className="card h-100 border-primary">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle p-2 me-2" style={{ backgroundColor: "#e6f0ff" }}>
                            <User size={24} className="text-primary" />
                          </div>
                          <h5 className="card-title mb-0">Gestiona tu Usuario</h5>
                        </div>
                        <p className="card-text">Actualiza tu información personal y datos de contacto.</p>
                        <Link
                          to="/AdministrarUsuario"
                          className="btn btn-primary w-100"
                          style={{ backgroundColor: "#31529c" }}
                        >
                          Acceder
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaPrincipal
