"use client"

import type React from "react"

import {
    User,
    LockKeyhole,
    BadgeIcon as IdCard,
    ArrowRight,
    ArrowLeft,
    Phone,
    MapPin,
    UserCheck,
    FileSearch2,
} from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import { authService, type TramitadorData } from "../Servicios/authServices"
import { useNavigate, Link } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"
import logonomas from "../assets/logo zafiro 1.png"

function Register() {
    const [formData, setFormData] = useState({
        tipoIdentificacion: "",
        identificacion: "",
        nombre: "",
        telefono: "",
        direccion: "",
        soporte_adjunto1: "",
        soporte_adjunto2: "",
        estado: "Activo",
        contrasena: "",
        perfil: "-",
        usuario: "",
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState("")
    const [opcion, setOpcion] = useState("-")



    const API_VALIDARDOCUMENTO = import.meta.env.VITE_API_VALIDARDOCUMENTO;

    const [validando, setValidando] = useState(false)
    const [validado, setValidado] = useState(false)
    const [_mensajeError, setMensajeError] = useState("")
    const [_mensajeExito, setMensajeExito] = useState("")

    const validarDocumento = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!formData.tipoIdentificacion) {
            setMensajeError("Por favor, selecciona un tipo de documento")
            return
        }

        if (!formData.identificacion) {
            setMensajeError("Por favor, ingresa el número de documento")
            return
        }

        setValidando(true)
        setMensajeError("")

        try {
            const response = await axios.post(`${API_VALIDARDOCUMENTO}`, {
                tipoDocumento: formData.tipoIdentificacion,
                numeroDocumento: formData.identificacion,
            })

            if (response.data.valido === "true") {
                setFormData({
                    ...formData,
                    nombre: response.data.nombre,
                })
                setValidado(true)
                setMensajeExito("Documento validado correctamente")

                Swal.fire({
                    icon: "success",
                    title: "Documento validado",
                    text: "Documento validado correctamente",
                })
            } else {
                setMensajeError(response.data.mensaje || "No se pudo validar el documento")

                Swal.fire({
                    icon: "error",
                    title: "Error al validar",
                    text: response.data.mensaje || "No se pudo validar el documento",
                })
            }
        } catch (error: any) {
            setMensajeError("Error al conectar con el servidor: " + (error.message || "Error desconocido"))

            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Error al conectar con el servidor: " + (error.message || "Error desconocido"),
            })
        } finally {
            setValidando(false)
        }
    }

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

            const tramitadorData: TramitadorData = {
                identificacion: formData.identificacion,
                tipoIdentificacion: formData.tipoIdentificacion,
                nombre: formData.nombre,
                telefono: formData.telefono,
                direccion: formData.direccion,
                soporteAdjunto1: formData.soporte_adjunto1,
                soporteAdjunto2: formData.soporte_adjunto2,
                estado: formData.estado,
                usuario: formData.usuario,
                contrasena: formData.contrasena,
                perfil: formData.perfil,
            }

            await authService.register(tramitadorData)
            setSuccessMessage("Registro exitoso. Por favor inicia sesión con tus credenciales.")
            setTimeout(() => {
                navigate("/login")
            }, 1000)
        } catch (error: any) {
            setError(error.message || "Error al registrar usuario")
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
                                <div className="col-lg-6 d-none d-lg-block" style={{ backgroundColor: "#31529c" }}>
                                    <div className="position-relative h-100">
                                        <Link
                                            className="text-decoration-none text-white position-absolute top-0 start-0 p-4 d-flex align-items-center"
                                            to="/login"
                                        >
                                            <ArrowLeft size={16} className="me-1" /> Iniciar Sesión
                                        </Link>
                                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white text-center p-4 p-md-5">
                                            <div className="mb-4">
                                                <div className="bg-white bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">

                                                    <img src={logonomas} alt="logoZafiro" style={{ width: "100px" }} />
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-3">
                                                ZAFIRO
                                            </h2>
                                            <p className="text-white-50 mb-0">
                                                Crea tu cuenta y empieza a disfrutar
                                                <br />
                                                de todas nuestras funcionalidades.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 p-4 p-md-5">
                                    <div className="mb-4 mb-md-5">
                                        <h2 className="fw-bold mb-3">Registrarse</h2>
                                        <h4 className="h6 fw-bold mb-2">Crea tu cuenta</h4>
                                        <p className="text-muted small mb-0">
                                            Bienvenido a <strong>nuestro sistema</strong>
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="col-md-6 mb-4">
                                            <label htmlFor="perfil" className="form-label small fw-medium">
                                                ¿Usted es?
                                            </label>
                                            <select
                                                id="perfil"
                                                className="form-select"
                                                required
                                                value={formData.perfil}
                                                onChange={(e) => {
                                                    setOpcion(e.target.value)
                                                    setFormData({
                                                        ...formData,
                                                        perfil: e.target.value,
                                                    })
                                                }}
                                            >
                                                <option value="-">-</option>
                                                <option value="Tramitador">Tramitador</option>
                                                <option value="Paciente">Paciente</option>
                                            </select>
                                        </div>

                                        {opcion === "Tramitador" && (
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-4">
                                                        <label htmlFor="tipoIdentificacion" className="form-label small fw-medium">
                                                            Tipo documento
                                                        </label>
                                                        <select
                                                            id="tipoIdentificacion"
                                                            className="form-select"
                                                            required
                                                            value={formData.tipoIdentificacion}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Seleccione un tipo de documento</option>
                                                            <option value="CC">CC</option>
                                                            <option value="CE">CE</option>
                                                            <option value="CN">CN</option>
                                                            <option value="MS">MS</option>
                                                            <option value="NI">NI</option>
                                                            <option value="PA">PA</option>
                                                            <option value="PE">PE</option>
                                                            <option value="PT">PT</option>
                                                            <option value="RC">RC</option>
                                                            <option value="SC">SC</option>
                                                            <option value="TI">TI</option>
                                                            <option value="AS">AS</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6 mb-4">
                                                        <label htmlFor="identificacion" className="form-label small fw-medium">
                                                            Documento de identidad
                                                        </label>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-light">
                                                                <IdCard size={20} className="text-secondary" />
                                                            </span>
                                                            <input
                                                                id="identificacion"
                                                                type="number"
                                                                className="form-control border-start-0"
                                                                placeholder="Ingresa tu documento"
                                                                required
                                                                value={formData.identificacion}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="nombre" className="form-label small fw-medium">
                                                        Nombre completo
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light">
                                                            <User size={20} className="text-secondary" />
                                                        </span>
                                                        <input
                                                            id="nombre"
                                                            type="text"
                                                            className="form-control border-start-0"
                                                            placeholder="Ingresa tu nombre completo"
                                                            required
                                                            value={formData.nombre}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {opcion === "Paciente" && (
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-4 mb-4">
                                                        <label htmlFor="tipoIdentificacion" className="form-label small fw-medium">
                                                            Tipo documento
                                                        </label>
                                                        <select
                                                            id="tipoIdentificacion"
                                                            className="form-select"
                                                            required
                                                            value={formData.tipoIdentificacion}
                                                            onChange={handleChange}
                                                            disabled={validado}
                                                        >
                                                            <option value="">Seleccione un tipo de documento</option>
                                                            <option value="CC">CC</option>
                                                            <option value="CE">CE</option>
                                                            <option value="CN">CN</option>
                                                            <option value="MS">MS</option>
                                                            <option value="NI">NI</option>
                                                            <option value="PA">PA</option>
                                                            <option value="PE">PE</option>
                                                            <option value="PT">PT</option>
                                                            <option value="RC">RC</option>
                                                            <option value="SC">SC</option>
                                                            <option value="TI">TI</option>
                                                            <option value="AS">AS</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6 mb-4">
                                                        <label htmlFor="identificacion" className="form-label small fw-medium">
                                                            Documento de identidad
                                                        </label>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-light">
                                                                <IdCard size={20} className="text-secondary" />
                                                            </span>
                                                            <input
                                                                id="identificacion"
                                                                type="text"
                                                                className="form-control border-start-0"
                                                                placeholder="Ingresa tu documento"
                                                                required
                                                                value={formData.identificacion}
                                                                onChange={handleChange}
                                                                disabled={validado}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-2 mb-4 d-flex flex-column align-items-center justify-content-center">
                                                        <span className="form-label small fw-medium mb-2">Validar</span>

                                                        <button
                                                            type="button"
                                                            className="btn d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                                            style={{
                                                                backgroundColor: validado ? "#28a745" : "#31529c",
                                                                width: "50px",
                                                                height: "50px",
                                                                border: "none",
                                                                transition: "background-color 0.3s ease",
                                                            }}
                                                            title="Validar documento"
                                                            aria-label="Validar documento"
                                                            onMouseOver={(e) =>
                                                                (e.currentTarget.style.backgroundColor = validado ? "#218838" : "#26407d")
                                                            }
                                                            onMouseOut={(e) =>
                                                                (e.currentTarget.style.backgroundColor = validado ? "#28a745" : "#31529c")
                                                            }
                                                            onClick={validarDocumento}
                                                            disabled={
                                                                validando || validado || !formData.tipoIdentificacion || !formData.identificacion
                                                            }
                                                        >
                                                            <FileSearch2 size={20} className="text-white" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="nombre" className="form-label small fw-medium">
                                                        Nombre completo
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light">
                                                            <User size={20} className="text-secondary" />
                                                        </span>
                                                        <input
                                                            id="nombre"
                                                            type="text"
                                                            className="form-control border-start-0"
                                                            required
                                                            value={formData.nombre}
                                                            onChange={handleChange}
                                                            readOnly={true}
                                                            disabled={!validado}
                                                            placeholder="Nombre completo del afiliado"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <label htmlFor="telefono" className="form-label small fw-medium">
                                                Teléfono
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <Phone size={20} className="text-secondary" />
                                                </span>
                                                <input
                                                    id="telefono"
                                                    type="tel"
                                                    className="form-control border-start-0"
                                                    placeholder="Ingresa tu número de teléfono"
                                                    required
                                                    value={formData.telefono}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="direccion" className="form-label small fw-medium">
                                                Dirección
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <MapPin size={20} className="text-secondary" />
                                                </span>
                                                <input
                                                    id="direccion"
                                                    type="text"
                                                    className="form-control border-start-0"
                                                    placeholder="Ingresa tu dirección"
                                                    required
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="usuario" className="form-label small fw-medium">
                                                Usuario
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <UserCheck size={20} className="text-secondary" />
                                                </span>
                                                <input
                                                    id="usuario"
                                                    type="text"
                                                    className="form-control border-start-0"
                                                    placeholder="Ingresa tu nombre de usuario"
                                                    required
                                                    value={formData.usuario}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-text mt-2">Este será tu identificador único para iniciar sesión</div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="contrasena" className="form-label small fw-medium">
                                                Contraseña
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <LockKeyhole size={20} className="text-secondary" />
                                                </span>
                                                <input
                                                    id="contrasena"
                                                    type="password"
                                                    className="form-control border-start-0"
                                                    placeholder="Crea una contraseña segura"
                                                    required
                                                    value={formData.contrasena}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-text mt-2">La contraseña debe tener al menos 8 caracteres</div>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {successMessage && (
                                            <div className="alert alert-success" role="alert">
                                                {successMessage}
                                            </div>
                                        )}

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
                                                "Creando cuenta..."
                                            ) : (
                                                <>
                                                    Crear Cuenta
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

                                <div className="col-12 d-lg-none text-center p-4" style={{ backgroundColor: "#31529c" }}>
                                    <p className="text-white mb-2">¿Ya tienes una cuenta?</p>
                                    <Link to="/login" className="btn btn-outline-light">
                                        <ArrowLeft size={16} className="me-1" /> Iniciar Sesión
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

export default Register
