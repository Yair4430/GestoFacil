import { useState } from "react"

export default function IntermedioPDF({ onSubmit }) {
  const [ruta, setRuta] = useState("")

  const cardStyle = {
    backgroundColor: '#fff5f5',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #fed7d7'
  }

  const headerStyle = {
    marginBottom: '16px'
  }

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#dc2626',
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
    color: '#7f1d1d',
    marginBottom: '4px'
  }

  const inputStyle = {
    width: '100%',
    maxWidth: '280px',
    margin: '0 auto',
    padding: '8px 12px',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    textAlign: 'center',
    backgroundColor: '#fef2f2'
  }

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center'
  }

  const buttonStyle = {
    width: '180px',
    marginLeft: '60px',
    marginRight: 'auto',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '500'
  }

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          🔄 Proceso Intermedio de PDFS
        </h3>
      </div>
      <div style={contentStyle}>
        <div>
          <label style={labelStyle}>
            Ruta de la carpeta con los PDFs a unir:
          </label>
          <input
            type="text"
            value={ruta}
            onChange={(e) => setRuta(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/a/carpeta/pdfs"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.backgroundColor = '#fee2e2';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#fecaca';
              e.target.style.backgroundColor = '#fef2f2';
            }}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button
            onClick={() => {
              onSubmit({ ruta }, "intermedio-pdfs");
              setRuta("");
            }}
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            Ejecutar Intermedio
          </button>
        </div>
      </div>
    </div>
  )
}