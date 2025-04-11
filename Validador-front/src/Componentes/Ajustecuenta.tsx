import { useState, useEffect } from "react"
import { User, LockKeyhole, BadgeIcon as IdCard, Phone, MapPin, UserCheck, Save } from 'lucide-react'
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import { useAuth } from "../Servicios/useAuth"

const API_URL = "http://10.0.1.249:8080/api/tramitador"

const Ajustecuenta = () => {

    const auth = useAuth()
    const user = auth?.user || null

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [formData, setFormData] = useState({
        tipoIdentificacion: "",
        identificacion: "",
        nombre: "",
        telefono: "",
        direccion: "",
        soporteAdjunto1: "",
        soporteAdjunto2: "",
        estado: "",
        usuario: "",
        contrasena: "",
        confirmarContrasena: "",
        perfil: "", // Añadido el campo perfil que faltaba
    })
    const [changePassword, setChangePassword] = useState(false)
    const [originalData, setOriginalData] = useState<{
        tipoIdentificacion?: string;
        identificacion?: string;
        nombre?: string;
        telefono?: string;
        direccion?: string;
        soporteAdjunto1?: string;
        soporteAdjunto2?: string;
        estado?: string;
        usuario?: string;
        contrasena?: string;
        perfil?: string;
    } | null>(null)

    // Cargar datos del usuario cuando el componente se monta
    useEffect(() => {
        const fetchUserData = async () => {
            // Si no hay usuario autenticado o no hay identificación, mostrar formulario vacío
            if (!user || !user.identificacion) {
                setLoading(false)
                setError("No hay usuario autenticado. Por favor, inicie sesión.")
                return
            }

            try {
                const response = await axios.get(`${API_URL}/${user.identificacion}`)
                const userData = response.data

                // Guardar datos originales para referencia
                setOriginalData(userData)

                setFormData({
                    tipoIdentificacion: userData.tipoIdentificacion || "",
                    identificacion: userData.identificacion || "",
                    nombre: userData.nombre || "",
                    telefono: userData.telefono || "",
                    direccion: userData.direccion || "",
                    soporteAdjunto1: userData.soporteAdjunto1 || "",
                    soporteAdjunto2: userData.soporteAdjunto2 || "",
                    estado: userData.estado || "",
                    usuario: userData.usuario || "",
                    contrasena: "",
                    confirmarContrasena: "",
                    perfil: userData.perfil || "", // Incluir el perfil
                })
                setLoading(false)
            } catch (err) {
                console.error("Error al cargar datos del usuario:", err)
                setError("No se pudieron cargar los datos del usuario. Por favor, intente nuevamente.")
                setLoading(false)
            }
        }

        fetchUserData()
    }, [user])

    // Manejar cambios en los inputs
    const handleChange = (e: any) => {
        const { id, value } = e.target
        setFormData({
            ...formData,
            [id]: value,
        })
    }

    // Manejar envío del formulario
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        // Verificar si hay usuario autenticado
        if (!user || !user.identificacion) {
            setError("No hay usuario autenticado. Por favor, inicie sesión.")
            return
        }

        // Validaciones
        if (changePassword) {
            if (formData.contrasena.length < 8) {
                setError("La contraseña debe tener al menos 8 caracteres")
                return
            }

            if (formData.contrasena !== formData.confirmarContrasena) {
                setError("Las contraseñas no coinciden")
                return
            }
        }

        try {

            const dataToSend = {
                ...formData,

                contrasena: changePassword ? formData.contrasena : originalData?.contrasena || "",
            }

            if ('confirmarContrasena' in dataToSend) {
                delete (dataToSend as { confirmarContrasena?: string }).confirmarContrasena
            }


            console.log("Datos a enviar:", dataToSend)


            const response = await axios.put(`${API_URL}/${formData.identificacion}`, dataToSend)

            if (response.status === 200) {
                setSuccess("Datos actualizados correctamente")


                const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
                const updatedUser = { ...currentUser, ...response.data }
                localStorage.setItem("user", JSON.stringify(updatedUser))


                if (auth && auth.checkAuth) {
                    auth.checkAuth()
                }
            }
        } catch (err: any) {
            console.error("Error al actualizar datos:", err)
            console.error("Respuesta del servidor:", err.response?.data)
            console.error("Estado HTTP:", err.response?.status)
            setError(err.response?.data || "Error al actualizar los datos. Por favor, intente nuevamente.")
        }
    }

    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }


    if (!user) {
        return (
            <div className="container card p-4 mb-4 shadow-sm border rounded-4 mt-3">
                <div className="alert alert-warning" role="alert">
                    Debe iniciar sesión para acceder a esta página.
                </div>
            </div>
        )
    }

    return (
        <div className="container card p-4 mb-4 shadow-sm border rounded-4 mt-3">
            <h1 className="mb-4">Ajustes de Cuenta</h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                            disabled
                        >
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="CE">CE</option>
                            <option value="CN">CN</option>
                            <option value="MS">MS</option>
                            <option value="NI">NI</option>
                            <option value="PA">PA</option>
                            <option value="PE">PE</option>
                            <option value="PT">PT</option>
                            <option value="RC">RC</option>
                            <option value="SC">SC</option>
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
                                placeholder="Documento de identidad"
                                required
                                value={formData.identificacion}
                                onChange={handleChange}
                                disabled
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


                <input
                    type="hidden"
                    id="perfil"
                    value={formData.perfil}
                />


                <input
                    type="hidden"
                    id="estado"
                    value={formData.estado}
                />


                <input
                    type="hidden"
                    id="soporteAdjunto1"
                    value={formData.soporteAdjunto1}
                />


                <input
                    type="hidden"
                    id="soporteAdjunto2"
                    value={formData.soporteAdjunto2}
                />

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
                            placeholder="Nombre de usuario"
                            required
                            value={formData.usuario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-text mt-2">Este es tu identificador único para iniciar sesión</div>
                </div>

                <div className="mb-4">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="changePasswordCheck"
                            checked={changePassword}
                            onChange={() => setChangePassword(!changePassword)}
                        />
                        <label className="form-check-label" htmlFor="changePasswordCheck">
                            Cambiar contraseña
                        </label>
                    </div>
                </div>

                {changePassword && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="contrasena" className="form-label small fw-medium">
                                Nueva Contraseña
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <LockKeyhole size={20} className="text-secondary" />
                                </span>
                                <input
                                    id="contrasena"
                                    type="password"
                                    className="form-control border-start-0"
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required={changePassword}
                                />
                            </div>
                            <div className="form-text mt-2">La contraseña debe tener al menos 8 caracteres</div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmarContrasena" className="form-label small fw-medium">
                                Confirmar Contraseña
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <LockKeyhole size={20} className="text-secondary" />
                                </span>
                                <input
                                    id="confirmarContrasena"
                                    type="password"
                                    className="form-control border-start-0"
                                    placeholder="Confirma tu nueva contraseña"
                                    value={formData.confirmarContrasena}
                                    onChange={handleChange}
                                    required={changePassword}
                                />
                            </div>
                        </div>
                    </>
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
                >
                    <Save size={18} className="me-2" />
                    Guardar Cambios
                </button>
            </form>
        </div>
    )
}

export default Ajustecuenta