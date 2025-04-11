import { useState } from "react";
import { FileSearch2, BadgeIcon as IdCard, LockKeyhole, UserCheck } from 'lucide-react';
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://10.0.1.249:8080/api/tramitador";

const OlvideContraseña = () => {
    // Estados para manejar el formulario
    const [formData, setFormData] = useState({
        tipoIdentificacion: "",
        identificacion: "",
        usuario: "",
        contrasena: ""
    });

    // Estados para controlar el flujo
    const [buscando, setBuscando] = useState(false);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(false);
    const [tramitadorId, setTramitadorId] = useState(null);
    const [error, setError] = useState("");

    // Manejar cambios en los inputs
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });

        // Si cambia el tipo o número de documento, resetear el usuario encontrado
        if (id === "tipoIdentificacion" || id === "identificacion") {
            setUsuarioEncontrado(false);
            setFormData(prev => ({
                ...prev,
                usuario: ""
            }));
        }
    };

    // Función para buscar el usuario
    const buscarUsuario = async () => {
        setError("");

        if (!formData.tipoIdentificacion || !formData.identificacion) {
            Swal.fire({
                icon: "error",
                title: "Datos incompletos",
                text: "Por favor, ingresa el tipo y número de documento",
            });
            return;
        }

        setBuscando(true);

        try {
            // Obtener todos los tramitadores
            const response = await axios.get(`${API_URL}`);

            // Buscar el tramitador con el tipo y número de documento que coincida
            const tramitadorEncontrado = response.data.find((t: { tipoIdentificacion: string; identificacion: string; }) =>
                t.tipoIdentificacion === formData.tipoIdentificacion &&
                t.identificacion === formData.identificacion
            );

            if (tramitadorEncontrado) {
                setFormData(prev => ({
                    ...prev,
                    usuario: tramitadorEncontrado.usuario
                }));
                setUsuarioEncontrado(true);
                setTramitadorId(tramitadorEncontrado.identificacion);

                Swal.fire({
                    icon: "success",
                    title: "Usuario encontrado",
                    text: "Ahora puedes cambiar tu contraseña",
                });
            } else {
                setError("No se encontró ningún usuario");

                Swal.fire({
                    icon: "error",
                    title: "Usuario no encontrado",
                    text: "No se encontró ningún usuario",
                });
            }
        } catch (error) {
            console.error("Error al buscar el usuario:", error);

            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Error al conectar con el servidor",
            });
        } finally {
            setBuscando(false);
        }
    };

    // Función para cambiar la contraseña
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!usuarioEncontrado) {
            Swal.fire({
                icon: "warning",
                title: "Usuario no validado",
                text: "Por favor, busca y valida tu usuario primero",
            });
            return;
        }

        if (!formData.contrasena || formData.contrasena.length < 8) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener al menos 8 caracteres",
            });
            return;
        }

        try {
            // Primero obtenemos los datos completos del tramitador
            const getResponse = await axios.get(`${API_URL}/${tramitadorId}`);
            const tramitadorData = getResponse.data;

            // Actualizamos solo la contraseña
            const dataToUpdate = {
                ...tramitadorData,
                contrasena: formData.contrasena
            };

            // Enviamos la actualización
            const response = await axios.put(`${API_URL}/${tramitadorId}`, dataToUpdate);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Contraseña actualizada",
                    text: "Tu contraseña ha sido actualizada correctamente",
                });

                // Limpiar el formulario
                setFormData({
                    tipoIdentificacion: "",
                    identificacion: "",
                    usuario: "",
                    contrasena: ""
                });
                setUsuarioEncontrado(false);
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);

            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: "No se pudo actualizar la contraseña",
            });
        }
    };

    return (
        <div className="container">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                                disabled={usuarioEncontrado}
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
                                    disabled={usuarioEncontrado}
                                />
                            </div>
                        </div>

                        <div className="col-md-2 mb-4 d-flex flex-column align-items-center justify-content-center">
                            <span className="form-label small fw-medium mb-2">Validar</span>

                            <button
                                type="button"
                                className="btn d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                style={{
                                    backgroundColor: usuarioEncontrado ? "#28a745" : "#31529c",
                                    width: "50px",
                                    height: "50px",
                                    border: "none",
                                    transition: "background-color 0.3s ease",
                                }}
                                title="Validar documento"
                                aria-label="Validar documento"
                                onClick={buscarUsuario}
                                disabled={buscando || usuarioEncontrado}
                            >
                                <FileSearch2 size={20} className="text-white" />
                            </button>
                        </div>
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
                            placeholder="Tu nombre de usuario aparecerá aquí"
                            required
                            value={formData.usuario}
                            onChange={handleChange}
                            readOnly
                            disabled={!usuarioEncontrado}
                        />
                    </div>
                    {usuarioEncontrado && (
                        <div className="form-text mt-1">Este es tu nombre de usuario registrado</div>
                    )}
                </div>

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
                            required
                            value={formData.contrasena}
                            onChange={handleChange}
                            disabled={!usuarioEncontrado}
                        />
                    </div>
                    {usuarioEncontrado && (
                        <div className="form-text mt-1">La contraseña debe tener al menos 8 caracteres</div>
                    )}
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
                    disabled={!usuarioEncontrado}
                >
                    <span className="small text-light">Cambiar Contraseña</span>
                </button>
            </form>
        </div>
    );
};

export default OlvideContraseña;