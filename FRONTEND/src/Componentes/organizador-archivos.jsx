import { useState } from "react"
import axios from "axios"
import EntradaPDF from "./entrada-pdf"
import IntermedioExcel from "./intermedio-excel"
import SalidaPDF from "./salida-pdf"
import ModalAyuda from "./modal-ayuda"

export default function OrganizadorArchivos() {
  const [mensaje, setMensaje] = useState("")
  const [isError, setIsError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (data, endpoint) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value))

      const res = await axios.post(`http://localhost:8000/${endpoint}`, formData)
      setMensaje(res.data.message)
      setIsError(false)
    } catch (error) {
      setMensaje(error.response?.data?.error || "Ocurrió un error inesperado")
      setIsError(true)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '24px',
    fontFamily: 'Arial, sans-serif'
  }

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  }

  const headerStyle = {
    textAlign: 'center',
    position: 'relative'
  }

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  }

  const subtitleStyle = {
    color: '#6b7280'
  }

  const helpButtonStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const gridStyle = {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  }

  const alertStyle = {
    padding: '16px',
    borderRadius: '8px',
    border: isError ? '1px solid #fecaca' : '1px solid #bbf7d0',
    backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
    color: isError ? '#991b1b' : '#166534'
  }

  const alertContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  return (
    <div style={containerStyle}>
      <div style={mainStyle}>
        <div style={headerStyle}>
          <button 
            style={helpButtonStyle}
            onClick={() => setShowModal(true)}
            title="Ayuda"
          >
            ?
          </button>
          <h1 style={titleStyle}>GestionFacil</h1>
          <p style={subtitleStyle}>Programa para la organización de juicios de evaluación mediante va a avanzando el proceso de certificación en complementaria (Forma masiva)</p>
        </div>

        <div style={gridStyle}>
          <EntradaPDF onSubmit={handleSubmit} />
          <IntermedioExcel onSubmit={handleSubmit} />
          <SalidaPDF onSubmit={handleSubmit} />
        </div>

        {mensaje && (
          <div style={alertStyle}>
            <div style={alertContentStyle}>
              <span>{isError ? "❌" : "✅"}</span>
              <span>{mensaje}</span>
            </div>
          </div>
        )}
      </div>

      <ModalAyuda 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  )
}