import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AppRoutes from "./Rutas/AppRutas"
import { AuthProvider } from "./Servicios/useAuth"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App