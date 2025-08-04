import { useState } from "react"

export default function SalidaPDF({ onSubmit }) {
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
    color: '#7c3aed',
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
    maxWidth: '280px',  // ← AGREGAR ESTA LÍNEA
    margin: '0 auto',   // ← AGREGAR ESTA LÍNEA
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    textAlign: 'center'
    }

    const buttonStyle = {
    width: '180px',
    marginLeft: '60px',      // ← Pégalo a la izquierda
    marginRight: 'auto',    // ← Espacio automático a la derecha
    backgroundColor: '#7c3aed',
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
          📥 Proceso de Salida de los PDFS
        </h3>
      </div>
      <div style={contentStyle}>
        <div>
          <label style={labelStyle}>
            Ruta de la carpeta donde estan las subcarpetas con los jucios de evaluacion ya listos: 
          </label>
          <input
            type="text"
            value={ruta}
            onChange={(e) => setRuta(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/salida"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <button
            onClick={() => {
              onSubmit({ ruta }, "salida");  // ← Ejecuta la función
              setRuta("");                    // ← Limpia el input
            }}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
        >
          Ejecutar Salida
        </button>
      </div>
    </div>
  )
}