

import { useState, useEffect } from "react"
import { User, BadgeIcon as IdCard, FileText, FileSearch2 } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.css"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../Servicios/useAuth"

const Registrotramite = () => {
    interface Sede {
        incremento: number
        ciudad: string
        nombresede: string
    }

    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [sedes, setSedes] = useState<Sede[]>([])
    const [_sedeSeleccionada, setSedeSeleccionada] = useState("")
    const [nombreTramitador, setNombreTramitador] = useState("")
    const [buscandoTramitador, setBuscandoTramitador] = useState(false)
    const [tramitadorEncontrado, setTramitadorEncontrado] = useState(false)

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/sede")
            .then((response) => {
                setSedes(response.data)
            })
            .catch((error) => {
                console.error("Error fetching sedes:", error)
            })
    }, [])

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    // Estados para manejar el formulario
    // Actualizar el estado inicial de formData para incluir los campos correctos
    const [formData, setFormData] = useState({
        tipoDocumentoAfiliado: user?.tipoIdentificacion || "",
        numeroDocumentoAfiliado: user?.identificacion || "",
        nombreAfiliado: user?.nombre || "",
        tipoDocumentoTramitador: user?.tipoIdentificacion || "",
        numeroDocumentoTramitador: user?.identificacion || "",
        tipoIdentificacion: user?.tipoIdentificacion || "",
        identificacion: user?.identificacion || "",
        nombre: user?.nombre || "",
        sede: "",
    })

    // Estado para manejar archivos
    const [archivos, setArchivos] = useState({
        soporteAdjunto1: null,
        soporteAdjunto2: null,
        soporteFormula: null,
    })


    const [validado, setValidado] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [mensajeError, setMensajeError] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")

    
    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                tipoDocumentoTramitador: user.tipoIdentificacion || "CC",
                numeroDocumentoTramitador: user.identificacion || "",
                tipoDocumentoAfiliado: user.tipoIdentificacion || "",
                numeroDocumentoAfiliado: user.identificacion || "",
                nombreAfiliado: user.nombre || "",
                tipoIdentificacion: user.tipoIdentificacion || "",
                identificacion: user.identificacion || "",
                nombre: user.nombre || "",
            }))
        }
    }, [user])

    // Manejar cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target

  
        const fieldMap: { [key: string]: string } = {
            tipoIdentificacion: "tipoDocumentoAfiliado",
            identificacion: "numeroDocumentoAfiliado",
            nombre: "nombreAfiliado",
            tipoIdentificacionTramitador: "tipoDocumentoTramitador",
            identificacionTramitador: "numeroDocumentoTramitador",
            sede: "sede",
        }

        const fieldName = fieldMap[id] || id

        setFormData({
            ...formData,
            [fieldName]: value,
        })

        // Si cambia el tipo o número de documento del tramitador, resetear el nombre
        if (id === "tipoIdentificacionTramitador" || id === "identificacionTramitador") {
            setNombreTramitador("")
            setTramitadorEncontrado(false)
        }
    }

    // Manejar cambios en los archivos
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target

        if (files && files.length > 0) {
            const fieldName = id === "soporte_adjunto1" ? "soporteAdjunto1" : "soporteAdjunto2"

            setArchivos({
                ...archivos,
                [fieldName]: files[0],
            })
        }
    }


    const buscarTramitador = async () => {
        const tipoDocumento = (document.getElementById("tipoIdentificacionTramitador") as HTMLSelectElement)?.value
        const numeroDocumento = (document.getElementById("identificacionTramitador") as HTMLInputElement)?.value

        if (!tipoDocumento) {
            setMensajeError("Por favor, selecciona un tipo de documento para el tramitador")
            return
        }

        if (!numeroDocumento) {
            setMensajeError("Por favor, ingresa el número de documento del tramitador")
            return
        }

        setBuscandoTramitador(true)
        setMensajeError("")

        try {
            // Obtener todos los tramitadores
            const response = await axios.get("http://localhost:8080/api/tramitador")
            console.log("Tramitadores obtenidos:", response.data)

            
            const tramitadorEncontrado = response.data.find((t: any) => {
                const perfilMatch =
                    t.perfil &&
                    (t.perfil.toLowerCase() === "tramitador" ||
                        t.perfil.toLowerCase() === "tramitador " || 
                        t.perfil.toLowerCase() === " tramitador" || 
                        t.perfil.toLowerCase() === "Tramitador".toLowerCase())

                console.log(
                    `Comparando: ${t.tipoIdentificacion}=${tipoDocumento}, ${t.identificacion}=${numeroDocumento}, perfil=${t.perfil}, match=${perfilMatch}`,
                )

                return t.tipoIdentificacion === tipoDocumento && t.identificacion === numeroDocumento && perfilMatch
            })

            if (tramitadorEncontrado) {
                console.log("Tramitador encontrado:", tramitadorEncontrado)
                setNombreTramitador(tramitadorEncontrado.nombre)
                setTramitadorEncontrado(true)

                Swal.fire({
                    icon: "success",
                    title: "Tramitador encontrado",
                    text: `Se ha encontrado el tramitador: ${tramitadorEncontrado.nombre}`,
                })
            } else {
                console.log("No se encontró tramitador con los criterios especificados")
                setNombreTramitador("")
                setTramitadorEncontrado(false)


                
                const tramitadorSinPerfilCorrecto = response.data.find(
                    (t: any) => t.tipoIdentificacion === tipoDocumento && t.identificacion === numeroDocumento,
                )

                if (tramitadorSinPerfilCorrecto) {
                    Swal.fire({
                        icon: "error",
                        title: "Tramitador no válido",
                        text: `Se encontró el documento pero no tiene el perfil 'tramitador'. Su perfil actual es: '${tramitadorSinPerfilCorrecto.perfil || "no definido"}'`,
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Tramitador no encontrado",
                        text: "No se encontró un tramitador con el documento indicado",
                    })
                }
            }
        } catch (error: any) {
            console.error("Error al buscar el tramitador:", error)
            setMensajeError("Error al buscar el tramitador: " + (error.message || "Error desconocido"))

            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Error al conectar con el servidor: " + (error.message || "Error desconocido"),
            })
        } finally {
            setBuscandoTramitador(false)
        }
    }



    // Función para enviar el formulario completo
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()



        if (!formData.sede) {
            setMensajeError("Por favor, selecciona una sede")
            return
        }

        // Verificar si se requiere el archivo frontal
        if (!archivos.soporteAdjunto1) {
            setMensajeError("Por favor, adjunta la imagen frontal del documento")
            return
        }

        // Verificar que se haya encontrado el tramitador
        if (!tramitadorEncontrado || !nombreTramitador) {
            setMensajeError("Por favor, busca y verifica el tramitador antes de continuar")
            return
        }

        setEnviando(true)
        setMensajeError("")
        setMensajeExito("")

       
        const now = new Date()

        const pad = (n: number) => n.toString().padStart(2, "0")

        // Extraer y formatear las partes de la fecha y hora
        const horas = pad(now.getHours())
        const minutos = pad(now.getMinutes())
        const segundos = pad(now.getSeconds())
        const dia = pad(now.getDate())
        const mes = pad(now.getMonth() + 1)
        const anio = now.getFullYear().toString().slice(-2)

        const codigoGenerado = `${horas}${minutos}${segundos}${dia}${mes}${anio}`
        // Fecha y hora actual
        const fechaActual = new Date().toISOString().split("T")[0]
        const horaActual = new Date().toTimeString().split(" ")[0]

        try {
            // Crear FormData para enviar archivos
            const formDataToSend = new FormData()

            // Agregar datos del formulario
            formDataToSend.append("codigoGenerado", codigoGenerado)
            formDataToSend.append("fechaRegistro", fechaActual)
            formDataToSend.append("horaRegistro", horaActual)
            formDataToSend.append("tipoDocumentoAfiliado", formData.tipoDocumentoAfiliado)
            formDataToSend.append("numeroDocumentoAfiliado", formData.numeroDocumentoAfiliado)
            formDataToSend.append("nombreAfiliado", formData.nombreAfiliado)
            formDataToSend.append("tipoDocumentoTramitador", formData.tipoDocumentoTramitador)
            formDataToSend.append("numeroDocumentoTramitador", formData.numeroDocumentoTramitador)
            formDataToSend.append("sede", formData.sede)
            formDataToSend.append("estado", "Pendiente")

            // Agregar archivos
            if (archivos.soporteAdjunto1) {
                formDataToSend.append("soporteAdjunto1", archivos.soporteAdjunto1)
            }

            if (archivos.soporteAdjunto2) {
                formDataToSend.append("soporteAdjunto2", archivos.soporteAdjunto2)
            }
            if (!archivos.soporteFormula) {
                if (archivos.soporteFormula) {
                    formDataToSend.append("soporteFormula", archivos.soporteFormula)
                }
            }

            // Enviar datos al servidor
            const response = await axios.post("http://localhost:8080/api/registroafiliado", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 201) {
                setMensajeExito("Trámite registrado exitosamente con código: " + codigoGenerado)

                Swal.fire({
                    icon: "success",
                    title: "Trámite registrado",
                    text: "Trámite registrado exitosamente con código: " + codigoGenerado,
                })

                // Limpiar formulario
                setFormData({
                    tipoDocumentoAfiliado: "",
                    numeroDocumentoAfiliado: "",
                    nombreAfiliado: "",
                    tipoDocumentoTramitador: user?.tipoIdentificacion || "",
                    numeroDocumentoTramitador: user?.identificacion || "",
                    tipoIdentificacion: "",
                    identificacion: "",
                    nombre: "",
                    sede: "",
                })
                setArchivos({
                    soporteAdjunto1: null,
                    soporteAdjunto2: null,
                    soporteFormula: null,
                })
                setValidado(false)
                setNombreTramitador("")
                setTramitadorEncontrado(false)

                // Limpiar los campos de archivo
                const fileInput1 = document.getElementById("soporte_adjunto1") as HTMLInputElement
                const fileInput2 = document.getElementById("soporte_adjunto2") as HTMLInputElement
                const fileInput3 = document.getElementById("soporte_formula") as HTMLInputElement
                if (fileInput1) fileInput1.value = ""
                if (fileInput2) fileInput2.value = ""
                if (fileInput3) fileInput3.value = ""
            }
        } catch (error: any) {
            setMensajeError("Error al registrar el trámite: " + (error.message || "Error desconocido"))

            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: "Error al registrar el trámite: " + (error.message || "Error desconocido"),
            })
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="container card p-4 mb-4 shadow-sm border rounded-4 mt-3">
            <h1 className="mb-4">Registro de Trámite</h1>

            {mensajeError && (
                <div className="alert alert-danger" role="alert">
                    {mensajeError}
                </div>
            )}

            {mensajeExito && (
                <div className="alert alert-success" role="alert">
                    {mensajeExito}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                        >
                            <option value="CC">CC</option>

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
                                value={formData.identificacion}
                                required
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
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="card p-4 mb-4 shadow-sm border rounded-4">
                    <p className="mb-4">
                        Por favor, adjunta imágenes claras de la parte frontal y posterior del documento de identidad del afiliado.
                    </p>

                    <div className="row">
                        <div className="mb-4 col-md-6">
                            <label htmlFor="soporte_adjunto1" className="form-label small fw-medium">
                                Frontal <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FileText size={20} className="text-secondary" />
                                </span>
                                <input
                                    id="soporte_adjunto1"
                                    type="file"
                                    className="form-control border-start-0"
                                    required
                                    onChange={handleFileChange}
                                    accept="image, application/pdf/*"
                                />
                            </div>
                            {validado && !archivos.soporteAdjunto1 && (
                                <div className="form-text text-danger mt-1">Este campo es obligatorio</div>
                            )}
                        </div>

                        <div className="mb-4 col-md-6">
                            <label htmlFor="soporte_adjunto2" className="form-label small fw-medium">
                                Posterior
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FileText size={20} className="text-secondary" />
                                </span>
                                <input
                                    id="soporte_adjunto2"
                                    type="file"
                                    className="form-control border-start-0"
                                    onChange={handleFileChange}
                                    accept="image/*, application/pdf"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-4 mb-4 shadow-sm border rounded-4">
                    <p className="mb-4">Por favor, adjunta imágenes claras de la formula medica.</p>

                    <div className="row">
                        <div className="mb-4 ">
                            <label htmlFor="soporte_adjunto1" className="form-label small fw-medium">
                                Formula <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FileText size={20} className="text-secondary" />
                                </span>
                                <input
                                    id="soporte_adjunto1"
                                    type="file"
                                    className="form-control border-start-0"
                                    required
                                    onChange={handleFileChange}
                                    accept="image, application/pdf/*"
                                />
                            </div>
                            {validado && !archivos.soporteAdjunto1 && (
                                <div className="form-text text-danger mt-1">Este campo es obligatorio</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-4">
                        <label htmlFor="tipoIdentificacionTramitador" className="form-label small fw-medium">
                            Tipo documento tramitador
                        </label>
                        <select
                            id="tipoIdentificacionTramitador"
                            className="form-select"
                            required
                            onChange={handleChange}
                            value={formData.tipoDocumentoTramitador}
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
                        <label htmlFor="identificacionTramitador" className="form-label small fw-medium">
                            Documento de identidad tramitador
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <IdCard size={20} className="text-secondary" />
                            </span>
                            <input
                                id="identificacionTramitador"
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Ingresa documento del tramitador"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 mb-4 d-flex flex-column align-items-center justify-content-center">
                        <span className="form-label small fw-medium mb-2">Buscar Tramitador</span>

                        <button
                            type="button"
                            className="btn d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                            style={{
                                backgroundColor: tramitadorEncontrado ? "#28a745" : "#31529c",
                                width: "50px",
                                height: "50px",
                                border: "none",
                                transition: "background-color 0.3s ease",
                            }}
                            title="Buscar tramitador"
                            aria-label="Buscar tramitador"
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = tramitadorEncontrado ? "#218838" : "#26407d")
                            }
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = tramitadorEncontrado ? "#28a745" : "#31529c")}
                            onClick={buscarTramitador}
                            disabled={
                                buscandoTramitador ||
                                !formData.tipoDocumentoTramitador ||
                                !formData.numeroDocumentoTramitador
                            }
                        >
                            <FileSearch2 size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="nombreTramitador" className="form-label small fw-medium">
                        Nombre completo
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-light">
                            <User size={20} className="text-secondary" />
                        </span>
                        <input
                            id="nombreTramitador"
                            type="text"
                            className="form-control border-start-0"
                            required
                            value={nombreTramitador}
                            placeholder="Nombre completo del Tramitador"
                        />
                    </div>
                    {validado && !nombreTramitador && (
                        <div className="form-text text-info mt-1">
                            Haga clic en el botón "Buscar Tramitador" para obtener el nombre automáticamente
                        </div>
                    )}
                </div>

                <div className="col-md-6 mb-4">
                    <label htmlFor="sede" className="form-label small fw-medium">
                        Selecciona la sede en la que deseas realizar el trámite
                    </label>
                    <select
                        id="sede"
                        className="form-select"
                        required
                        value={formData.sede}
                        onChange={(e) => {
                            const value = e.target.value
                            setSedeSeleccionada(value)
                            setFormData((prev) => ({ ...prev, sede: value })) // ← Esto actualiza el formData correctamente
                        }}
                    >
                        <option value="">Seleccione una sede</option>
                        {sedes.map((sede: any) => (
                            <option key={sede.id} value={sede.id}>
                                {sede.nombresede}
                            </option>
                        ))}
                    </select>


                </div>

                <button
                    type="submit"
                    className="btn btn-lg w-100 mb-4 text-white d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: "#31529c",
                        transition: "all 0.3s ease",
                    }}
                    disabled={!formData.sede || enviando || !archivos.soporteAdjunto1 || !tramitadorEncontrado}
                >
                    {enviando ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registrando...
                        </>
                    ) : (
                        "Registrar trámite"
                    )}
                </button>
            </form>
        </div>
    )
}

export default Registrotramite
