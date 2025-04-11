import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../Componentes/Header"

const AccesoDenegado = () => {
  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
              <div className="mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: "80px", height: "80px", backgroundColor: "#f8d7da" }}
                >
                  <span className="display-4 text-danger">!</span>
                </div>
              </div>
              <h1 className="display-5 mb-3">Acceso Denegado</h1>
              <p className="lead text-muted mb-4">Lo sentimos, no tienes permiso para acceder a esta página.</p>
              <Link to="/dashboard" className="btn btn-primary d-inline-flex align-items-center">
                <ArrowLeft size={18} className="me-2" />
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccesoDenegado
