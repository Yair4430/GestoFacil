export default function ResultadoElegante({ resultado, isError, onClose }) {
  if (!resultado) return null

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '12px'
  }

  const closeButtonStyle = {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '16px'
  }

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  }

  const statCardStyle = {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  }

  const listStyle = {
    maxHeight: '200px',
    overflow: 'auto',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '12px'
  }

  const itemStyle = {
    padding: '8px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem'
  }

  // 🔴 Si es un error
  if (isError || !resultado.success) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h3 style={{color: '#ef4444', margin: 0}}>❌ Error en el Proceso</h3>
            <button style={closeButtonStyle} onClick={onClose}>✕</button>
          </div>
          <p style={{color: '#dc2626'}}>
            {typeof resultado.error === "string"
              ? resultado.error
              : JSON.stringify(resultado.error || resultado)}
          </p>
        </div>
      </div>
    )
  }

  // ✅ Si tiene estadísticas (entrada, intermedio o salida)
  if (resultado.estadisticas) {
    // --- ENTRADA ---
    if (resultado.archivos_movidos && resultado.archivos_invalidos !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Entrada Completada</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            {/* estadísticas */}
            <div style={statsStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb'}}>
                  {resultado.estadisticas.total_archivos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Total Archivos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#059669'}}>
                  {resultado.estadisticas.archivos_movidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Archivos Movidos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626'}}>
                  {resultado.estadisticas.archivos_invalidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Archivos Inválidos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed'}}>
                  {resultado.estadisticas.carpetas_creadas}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Carpetas Creadas</div>
              </div>
            </div>

            {/* archivos movidos */}
            {resultado.archivos_movidos.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#059669', marginBottom: '8px'}}>📁 Archivos Procesados:</h4>
                <div style={listStyle}>
                  {resultado.archivos_movidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{archivo.nombre_original}</strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        → Ficha {archivo.ficha} | {archivo.instructor}
                        {archivo.fue_renombrado && <span style={{color: '#dc2626'}}> (Renombrado)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* archivos inválidos */}
            {resultado.archivos_invalidos.length > 0 && (
              <div>
                <h4 style={{color: '#dc2626', marginBottom: '8px'}}>⚠️ Archivos con Formato Inválido:</h4>
                <div style={listStyle}>
                  {resultado.archivos_invalidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      {typeof archivo === "string"
                        ? archivo
                        : `${archivo.nombre_archivo || "??"} - ${archivo.razon || "Sin razón"}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // --- INTERMEDIO EXCEL ---
    if (resultado.archivos_omitidos !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Intermedio Excel Completado</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            {/* ... código existente para intermedio Excel ... */}
          </div>
        </div>
      )
    }

    // --- INTERMEDIO PDFs ---
    if (resultado.carpetas_procesadas !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#dc2626', margin: 0}}>✅ Intermedio PDFs Completado</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            {/* Estadísticas principales */}
            <div style={statsStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626'}}>
                  {resultado.carpetas_procesadas}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Carpetas Procesadas</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#059669'}}>
                  {resultado.carpetas_procesadas - (resultado.carpetas_con_errores || 0)}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Carpetas Exitosas</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444'}}>
                  {resultado.carpetas_con_errores || 0}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Carpetas con Errores</div>
              </div>
            </div>

            {/* Resultados detallados por carpeta */}
            {resultado.resultados_detallados && resultado.resultados_detallados.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#dc2626', marginBottom: '8px'}}>📊 Resultados por Carpeta:</h4>
                <div style={listStyle}>
                  {resultado.resultados_detallados.map((carpeta, index) => (
                    <div key={index} style={itemStyle}>
                      <strong style={{color: carpeta.errores.length > 0 ? '#ef4444' : '#059669'}}>
                        {carpeta.carpeta}
                      </strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        📄 {carpeta.archivos_procesados} archivos | 
                        📖 {carpeta.total_paginas} páginas |
                        {carpeta.errores.length > 0 ? (
                          <span style={{color: '#ef4444'}}> ❌ {carpeta.errores.length} error(es)</span>
                        ) : (
                          <span style={{color: '#059669'}}> ✅ Éxito</span>
                        )}
                      </span>
                      {carpeta.archivo_final && (
                        <div style={{fontSize: '0.75rem', color: '#3b82f6', marginTop: '4px'}}>
                          📁 {carpeta.archivo_final.split('/').pop() || carpeta.archivo_final}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errores generales */}
            {resultado.errores && resultado.errores.length > 0 && (
              <div>
                <h4 style={{color: '#ef4444', marginBottom: '8px'}}>❌ Errores Generales:</h4>
                <div style={listStyle}>
                  {resultado.errores.map((error, index) => (
                    <div key={index} style={itemStyle}>
                      {typeof error === "string" ? error : JSON.stringify(error)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // --- SALIDA ---
    if (resultado.archivos_procesados !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Salida Completada</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            {/* ... código existente para salida ... */}
          </div>
        </div>
      )
    }
  }

  // ✅ Resultado simple
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{color: '#059669', margin: 0}}>✅ Proceso Completado</h3>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>
        <p>
          {typeof resultado === "string"
            ? resultado
            : resultado.message || JSON.stringify(resultado)}
        </p>
      </div>
    </div>
  )
}