import { useState } from "react"

export default function IntermedioExcel({ onSubmit }) {
  const [rutaExcels, setRutaExcels] = useState("")
  const [rutaFichas, setRutaFichas] = useState("")
  const [resultado, setResultado] = useState(null)

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
  
  const buttonStyle = {
    width: '180px',
    marginLeft: '60px',
    marginRight: 'auto',
    backgroundColor: '#059669',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }

  const resultadoStyle = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#f9fafb'
  }

  const listaStyle = {
    marginTop: '10px',
    paddingLeft: '20px'
  }

  const itemStyle = {
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '4px'
  }

  const handleSubmit = async () => {
    try {
      const response = await onSubmit({ rutaExcels, rutaFichas }, "intermedio");
      setResultado(response);
      setRutaExcels("");
      setRutaFichas("");
    } catch (error) {
      console.error("Error:", error);
      setResultado({
        success: false,
        error: "Error al ejecutar el proceso"
      });
    }
  }

  const renderLista = (titulo, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{marginTop: '15px'}}>
        <h4 style={{marginBottom: '10px'}}>{titulo} ({items.length})</h4>
        <ul style={listaStyle}>
          {items.map((item, index) => (
            <li key={index} style={itemStyle}>
              {item.nombre_archivo}
              {item.razon && ` - ${item.razon}`}
              {item.ficha && ` - Ficha: ${item.ficha}`}
              {item.extension && ` - Extensión: ${item.extension}`}
            </li>
          ))}
        </ul>
      </div>
    );
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
          onClick={handleSubmit}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
        >
          Ejecutar Intermedio
        </button>

        {resultado && (
          <div style={resultadoStyle}>
            <h4 style={{color: resultado.success ? '#059669' : '#dc2626', marginBottom: '15px'}}>
              {resultado.success ? '✅ Proceso completado' : '❌ Error en el proceso'}
            </h4>
            
            {resultado.mensaje && <p>{resultado.mensaje}</p>}
            {resultado.error && <p style={{color: '#dc2626'}}>{resultado.error}</p>}

            {resultado.estadisticas && (
              <div>
                <p><strong>Total archivos:</strong> {resultado.estadisticas.total_archivos}</p>
                <p><strong>Archivos movidos:</strong> {resultado.estadisticas.archivos_movidos}</p>
                <p><strong>Archivos omitidos:</strong> {resultado.estadisticas.archivos_omitidos}</p>
                <p><strong>Archivos inválidos:</strong> {resultado.estadisticas.archivos_invalidos}</p>
              </div>
            )}

            {renderLista("Archivos movidos", resultado.archivos_movidos)}
            {renderLista("Archivos omitidos", resultado.archivos_omitidos)}
            {renderLista("Archivos inválidos", resultado.archivos_invalidos)}
          </div>
        )}
      </div>
    </div>
  )
}