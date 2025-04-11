"use client"

import { useState, useEffect } from "react"
import { User, LockKeyhole, ArrowRight } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"
import Logonomas from "../assets/logo zafiro 1.png"
import OlvideContraseña from "./OlvideContraseña"
import { Modal } from "react-bootstrap"


function Login() {
  const [formData, setFormData] = useState({
    usuario: "",
    contrasena: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: any) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Intentando login con:", formData.usuario)
      await login(formData.usuario, formData.contrasena)
      console.log("Login exitoso, redirigiendo...")
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Error en handleSubmit:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card shadow border-0 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-6 p-4 p-md-5">
                  <div className="mb-4 mb-md-5">
                    <h2 className="fw-bold mb-3">Iniciar Sesión</h2>
                    <h4 className="h6 fw-bold mb-2">Accede a tu cuenta</h4>
                    <p className="text-muted small mb-0">
                      Bienvenido de vuelta a <strong>nuestro sistema</strong>
                    </p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="usuario" className="form-label small fw-medium">
                        Usuario
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">
                          <User size={20} className="text-secondary" />
                        </span>
                        <input
                          id="usuario"
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Ingresa tu usuario"
                          required
                          value={formData.usuario}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <Modal show={showModal} onHide={handleClose} centered size="xl">
                      <Modal.Header closeButton style={{}}>¿Olvido su contraseña?</Modal.Header>
                      <Modal.Body>
                        <OlvideContraseña />
                      </Modal.Body>
                    </Modal>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="contrasena" className="form-label small fw-medium">
                          Contraseña
                        </label>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleShow} style={{ background: "none", border: "none", color: "#31529c", textDecoration: "underline" }}>
                          <span className="small text-muted">Olvidé mi contraseña</span>
                        </button>
                      </div>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light">
                          <LockKeyhole size={20} className="text-secondary" />
                        </span>
                        <input
                          id="contrasena"
                          type="password"
                          className="form-control border-start-0"
                          placeholder="Ingresa tu contraseña"
                          required
                          value={formData.contrasena}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Recordar mi sesión
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg w-100 mb-4 text-white d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#31529c",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#26407d")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#31529c")}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          Iniciar Sesión
                          <ArrowRight size={18} className="ms-2" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="position-relative my-4">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small">
                      o
                    </span>
                  </div>

                  <p className="text-center text-muted small mb-0">Copyright © 2025 Todos los derechos reservados</p>
                </div>

                <div className="col-lg-6 d-none d-lg-block" style={{ backgroundColor: "#31529c" }}>
                  <div className="position-relative h-100">
                    <Link
                      className="text-decoration-none text-white position-absolute top-0 end-0 p-4 d-flex align-items-center"
                      to="/register"
                    >
                      Registrarse <ArrowRight size={16} className="ms-1" />
                    </Link>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white text-center p-4 p-md-5">
                      <div className="mb-4">
                        <div className="bg-white bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                          <img src={Logonomas} alt="" style={{
                            width: "100px",
                          }} />

                        </div>
                      </div>
                      <h2 className="fw-bold mb-3">ZAFIRO</h2>
                      <p className="text-white-50 mb-0">
                        Inicia sesión para continuar y acceder
                        <br />a todas nuestras funcionalidades
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 d-lg-none text-center p-4" style={{ backgroundColor: "#31529c" }}>
                  <p className="text-white mb-2">¿No tienes una cuenta?</p>
                  <Link to="/register" className="btn btn-outline-light">
                    Registrarse <ArrowRight size={16} className="ms-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

