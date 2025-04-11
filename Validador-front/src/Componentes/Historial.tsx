"use client"

import { useEffect, useState } from "react"
import {
    Calendar,
    Clock,
    FileText,
    Search,
    User,
    MapPin,
    Loader2,
    BadgeAlert,
    BadgeIcon as BadgeClock,
    BadgeX,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from "lucide-react"
import axios from "axios"
import { useAuth } from "../Servicios/useAuth"


interface Tramite {
    codigoGenerado: string
    fechaRegistro: string
    horaRegistro: string
    tipoDocumentoAfiliado: string
    numeroDocumentoAfiliado: string
    nombreAfiliado: string
    tipoDocumentoTramitador: string
    numeroDocumentoTramitador: string
    sede: string
    estado: string
}

const Historial = () => {
    const { user, isAuthenticated } = useAuth()
    const [tramites, setTramites] = useState<Tramite[]>([])
    const [filteredTramites, setFilteredTramites] = useState<Tramite[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterEstado, setFilterEstado] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [error, setError] = useState("")

    // Determinar el perfil del usuario
    const isTramitador = user?.perfil === "Tramitador"
    const isPaciente = user?.perfil === "Paciente"

    // Función para cargar los trámites
    const cargarTramites = () => {
        setLoading(true)
        setError("")

        axios
            .get("http://10.0.1.249:8080/api/registroafiliado")
            .then((response) => {
                let tramitesData = response.data

                // Filtrar trámites según el perfil del usuario
                if (isTramitador && user) {
                    // Si es tramitador, solo mostrar sus propios trámites
                    tramitesData = tramitesData.filter(
                        (tramite: Tramite) =>
                            tramite.numeroDocumentoTramitador === user.identificacion &&
                            tramite.tipoDocumentoTramitador === user.tipoIdentificacion,
                    )
                } else if (isPaciente && user) {
                    // Si es paciente, solo mostrar trámites donde su documento coincide con el afiliado
                    tramitesData = tramitesData.filter(
                        (tramite: Tramite) =>
                            tramite.numeroDocumentoAfiliado === user.identificacion &&
                            tramite.tipoDocumentoAfiliado === user.tipoIdentificacion,
                    )
                }
                // Si es supervisor o admin, mostrar todos los trámites (no filtramos)

                setTramites(tramitesData)
                setFilteredTramites(tramitesData)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error al obtener los trámites:", error)
                setError("No se pudieron cargar los trámites. Por favor, intente nuevamente.")
                setLoading(false)
            })
    }

    useEffect(() => {
        if (isAuthenticated) {
            cargarTramites()
        }
    }, [isAuthenticated])

    useEffect(() => {
        let result = tramites

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(
                (tramite) =>
                    tramite.codigoGenerado.toLowerCase().includes(term) ||
                    tramite.nombreAfiliado.toLowerCase().includes(term) ||
                    tramite.numeroDocumentoAfiliado.toLowerCase().includes(term) ||
                    tramite.sede.toLowerCase().includes(term),
            )
        }

        // Filtrar por estado
        if (filterEstado) {
            result = result.filter((tramite) => tramite.estado === filterEstado)
        }

        setFilteredTramites(result)
        setCurrentPage(1) // Resetear a la primera página cuando se filtra
    }, [searchTerm, filterEstado, tramites])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredTramites.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)


    const renderEstadoBadge = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "pendiente":
                return (
                    <span className="badge bg-warning text-dark d-flex align-items-center gap-1 justify-content-center">
                        <BadgeClock size={14} />
                        Pendiente
                    </span>
                )
            case "abierto":
                return (
                    <span className="badge bg-info text-dark d-flex align-items-center gap-1 justify-content-center">
                        <BadgeAlert size={14} />
                        Abierto
                    </span>
                )
            case "cerrado":
                return (
                    <span className="badge bg-danger d-flex align-items-center gap-1 justify-content-center">
                        <BadgeX size={14} />
                        Cerrado
                    </span>
                )
            default:
                return <span className="badge bg-secondary">{estado}</span>
        }
    }


    return (
        <div className="container py-4">
            <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                        <h2 className="card-title mb-3 mb-md-0">
                            <FileText className="me-2 text-primary" size={28} />
                            Historial de Trámites
                            {isTramitador && " (Mis trámites)"}
                            {isPaciente && " (Mis solicitudes)"}
                        </h2>
                        <button
                            className="btn btn-outline-primary d-flex align-items-center gap-2"
                            onClick={cargarTramites}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            Actualizar
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <Search size={18} className="text-secondary" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Buscar por código, nombre o documento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <select className="form-select" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Abierto">Abierto</option>
                                <option value="Cerrado">Cerrado</option>
                            </select>

                            <button
                                className="btn btn-outline-primary d-flex align-items-center gap-2"
                                onClick={() => {
                                    setSearchTerm("")
                                    setFilterEstado("")
                                }}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Loader2 size={40} className="text-primary animate-spin mb-3" />
                            <p className="text-muted">Cargando trámites...</p>
                        </div>
                    ) : filteredTramites.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-nowrap">
                                                Código
                                            </th>
                                            <th scope="col" className="text-nowrap">
                                                Afiliado
                                            </th>
                                            <th scope="col" className="text-nowrap">
                                                Documento
                                            </th>
                                            <th scope="col" className="text-nowrap">
                                                Fecha
                                            </th>
                                            <th scope="col" className="text-nowrap">
                                                Sede
                                            </th>
                                            {/* Ocultar columna de documento tramitador para usuarios con perfil "Tramitador" */}
                                            {!isTramitador && (
                                                <th scope="col" className="text-nowrap">
                                                    Documento Tramitador
                                                </th>
                                            )}
                                            <th scope="col" className="text-nowrap">
                                                Estado
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((tramite) => (
                                            <tr key={tramite.codigoGenerado}>
                                                <td className="fw-medium text-primary">{tramite.codigoGenerado}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <User size={18} className="text-secondary me-2" />
                                                        {tramite.nombreAfiliado}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark">
                                                        {tramite.tipoDocumentoAfiliado}: {tramite.numeroDocumentoAfiliado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <div className="d-flex align-items-center">
                                                            <Calendar size={14} className="text-secondary me-1" />
                                                            <small>{tramite.fechaRegistro}</small>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <Clock size={14} className="text-secondary me-1" />
                                                            <small>{tramite.horaRegistro}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <MapPin size={16} className="text-secondary me-1" />
                                                        {tramite.sede}
                                                    </div>
                                                </td>
                                                {/* Ocultar columna de documento tramitador para usuarios con perfil "Tramitador" */}
                                                {!isTramitador && (
                                                    <td>
                                                        <span className="badge bg-light text-dark">
                                                            {tramite.tipoDocumentoTramitador}: {tramite.numeroDocumentoTramitador}
                                                        </span>
                                                    </td>
                                                )}
                                                <td>{renderEstadoBadge(tramite.estado)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>



                            {/* Versión móvil de la tabla (visible solo en pantallas pequeñas) 
                            <div className="d-md-none">
                                {currentItems.map((tramite) => (
                                    <div key={tramite.codigoGenerado} className="card mb-3 border">
                                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                            <span className="fw-medium text-primary">{tramite.codigoGenerado}</span>
                                            {renderEstadoBadge(tramite.estado)}
                                        </div>
                                        <div className="card-body p-3">
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center mb-1">
                                                    <User size={16} className="text-secondary me-2" />
                                                    <strong className="me-1">Afiliado:</strong> {tramite.nombreAfiliado}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-light text-dark ms-4 ps-2">
                                                        {tramite.tipoDocumentoAfiliado}: {tramite.numeroDocumentoAfiliado}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <Calendar size={16} className="text-secondary me-2" />
                                                    <strong className="me-1">Fecha:</strong> {tramite.fechaRegistro}
                                                </div>
                                                <div className="d-flex align-items-center ms-4 ps-2">
                                                    <Clock size={14} className="text-secondary me-1" />
                                                    <small>{tramite.horaRegistro}</small>
                                                </div>
                                            </div>
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <MapPin size={16} className="text-secondary me-2" />
                                                    <strong className="me-1">Sede:</strong> {tramite.sede}
                                                </div>
                                            </div>
                                            
                                            {!isTramitador && (
                                                <div className="mb-3">
                                                    <strong className="d-block mb-1">Documento Tramitador:</strong>
                                                    <span className="badge bg-light text-dark ms-1">
                                                        {tramite.tipoDocumentoTramitador}: {tramite.numeroDocumentoTramitador}
                                                    </span>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                ))}
                            </div>

                            */}

                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
                                <div className="text-muted small mb-3 mb-md-0 text-center text-md-start">
                                    Mostrando {indexOfFirstItem + 1} a{" "}
                                    {indexOfLastItem > filteredTramites.length ? filteredTramites.length : indexOfLastItem} de{" "}
                                    {filteredTramites.length} trámites
                                </div>
                                <nav aria-label="Paginación de trámites" className="d-flex justify-content-center">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                                <ChevronLeft size={16} />
                                            </button>
                                        </li>
                                        {Array.from({ length: Math.ceil(filteredTramites.length / itemsPerPage) }).map((_, index) => {
                                            const pageNum = index + 1
                                            const isCurrentPage = currentPage === pageNum


                                            const isMobile = window.innerWidth < 768
                                            const isAdjacentPage = Math.abs(currentPage - pageNum) <= 1
                                            const isFirstOrLastPage =
                                                pageNum === 1 || pageNum === Math.ceil(filteredTramites.length / itemsPerPage)

                                            if (!isMobile || isCurrentPage || isAdjacentPage || isFirstOrLastPage) {
                                                return (
                                                    <li key={index} className={`page-item ${isCurrentPage ? "active" : ""}`}>
                                                        <button className="page-link" onClick={() => paginate(pageNum)}>
                                                            {pageNum}
                                                        </button>
                                                    </li>
                                                )
                                            } else if (isMobile && (pageNum === currentPage - 2 || pageNum === currentPage + 2)) {
                                                return (
                                                    <li key={index} className="page-item disabled">
                                                        <button className="page-link">...</button>
                                                    </li>
                                                )
                                            }
                                            return null
                                        })}
                                        <li
                                            className={`page-item ${currentPage === Math.ceil(filteredTramites.length / itemsPerPage) ? "disabled" : ""
                                                }`}
                                        >
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                                <ChevronRight size={16} />
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <FileText size={48} className="text-muted" />
                            </div>
                            <h5>No se encontraron trámites</h5>
                            <p className="text-muted">
                                {searchTerm || filterEstado
                                    ? "No hay trámites que coincidan con los criterios de búsqueda."
                                    : "Aún no hay trámites registrados en el sistema."}
                            </p>
                            {(searchTerm || filterEstado) && (
                                <button
                                    className="btn btn-outline-primary mt-2"
                                    onClick={() => {
                                        setSearchTerm("")
                                        setFilterEstado("")
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Historial
