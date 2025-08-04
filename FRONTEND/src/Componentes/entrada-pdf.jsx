import { useState } from "react"

export default function EntradaPDF({ onSubmit }) {
  const [ruta, setRuta] = useState("")

  const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  }

  const headerStyle = {
    marginBottom: '16px'
  }

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  }

  const inputStyle = {
    width: '100%',
    maxWidth: '280px',
    margin: '0 auto',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    textAlign: 'center'
  }

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center'  // ← ESTO CENTRA EL BOTÓN
  }

  const buttonStyle = {
    width: '180px',
    marginLeft: '60px',      // ← Pégalo a la izquierda
    marginRight: 'auto',    // ← Espacio automático a la derecha
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          📄 Proceso de Entrada de los PDFS
        </h3>
      </div>
      <div style={contentStyle}>
        <div>
          <label style={labelStyle}>
            Ruta de la carpeta donde estan los jucios de evaluacion:
          </label>
          <input
            type="text"
            value={ruta}
            onChange={(e) => setRuta(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/a/carpeta/pdfs"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button
            onClick={() => {
              onSubmit({ ruta }, "entrada");  // ← Ejecuta la función
              setRuta("");                    // ← Limpia el input
            }}
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Ejecutar Entrada
          </button>
        </div>
      </div>
    </div>
  )
}