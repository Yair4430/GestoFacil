import { useState } from "react"

export default function IntermedioExcel({ onSubmit }) {
  const [rutaExcels, setRutaExcels] = useState("")
  const [rutaFichas, setRutaFichas] = useState("")

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
    color: '#059669',
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
    backgroundColor: '#059669',
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
          📊 Proceso Intermedio de los Excel
        </h3>
      </div>
      <div style={contentStyle}>
        <div>
          <label style={labelStyle}>
            Ruta de la carpeta donde estan los Excel:
          </label>
          <input
            type="text"
            value={rutaExcels}
            onChange={(e) => setRutaExcels(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/archivo.xlsx"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#059669'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div>
          <label style={labelStyle}>
            Ruta de la carpeta donde estan las subcarpetas con los jucios de evaluacion:
          </label>
          <input
            type="text"
            value={rutaFichas}
            onChange={(e) => setRutaFichas(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/a/fichas"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#059669'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
          <button
            onClick={() => {
              onSubmit({ rutaExcels, rutaFichas }, "intermedio");  // ← CORREGIDO: usar rutaExcels y rutaFichas
              setRutaExcels("");                                   // ← CORREGIDO: limpiar rutaExcels
              setRutaFichas("");                                   // ← CORREGIDO: limpiar rutaFichas
            }}
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
          >
            Ejecutar Intermedio
          </button>
      </div>
    </div>
  )
}