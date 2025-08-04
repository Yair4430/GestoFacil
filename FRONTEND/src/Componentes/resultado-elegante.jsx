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

  // Si es un error simple
  if (isError || !resultado.success) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h3 style={{color: '#ef4444', margin: 0}}>❌ Error en el Proceso</h3>
            <button style={closeButtonStyle} onClick={onClose}>✕</button>
          </div>
          <p style={{color: '#dc2626'}}>{resultado.error || resultado}</p>
        </div>
      </div>
    )
  }

  // Si es resultado exitoso con datos estructurados
  if (resultado.estadisticas) {
    // RESULTADO PARA ENTRADA
    if (resultado.archivos_movidos && resultado.archivos_invalidos !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Entrada Completada</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

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

            {resultado.archivos_invalidos.length > 0 && (
              <div>
                <h4 style={{color: '#dc2626', marginBottom: '8px'}}>⚠️ Archivos con Formato Inválido:</h4>
                <div style={listStyle}>
                  {resultado.archivos_invalidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      {archivo}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // RESULTADO PARA INTERMEDIO
    if (resultado.archivos_omitidos !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Intermedio Completado</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            <div style={statsStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb'}}>
                  {resultado.estadisticas.total_archivos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Total Excel</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#059669'}}>
                  {resultado.estadisticas.archivos_movidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Archivos Movidos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b'}}>
                  {resultado.estadisticas.archivos_omitidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Archivos Omitidos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626'}}>
                  {resultado.estadisticas.archivos_invalidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Archivos Inválidos</div>
              </div>
            </div>

            {resultado.archivos_movidos.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#059669', marginBottom: '8px'}}>📊 Excel Movidos:</h4>
                <div style={listStyle}>
                  {resultado.archivos_movidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{archivo.nombre_archivo}</strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        → Ficha {archivo.ficha} | Tipo: {archivo.extension.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.archivos_omitidos.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#f59e0b', marginBottom: '8px'}}>⚠️ Archivos Omitidos:</h4>
                <div style={listStyle}>
                  {resultado.archivos_omitidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{archivo.nombre_archivo}</strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        Razón: {archivo.razon}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.archivos_invalidos.length > 0 && (
              <div>
                <h4 style={{color: '#dc2626', marginBottom: '8px'}}>❌ Archivos Inválidos:</h4>
                <div style={listStyle}>
                  {resultado.archivos_invalidos.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{archivo.nombre_archivo}</strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        Razón: {archivo.razon}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // RESULTADO PARA SALIDA
    if (resultado.archivos_procesados !== undefined) {
      return (
        <div style={overlayStyle} onClick={onClose}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h3 style={{color: '#059669', margin: 0}}>✅ Salida Completada</h3>
              <button style={closeButtonStyle} onClick={onClose}>✕</button>
            </div>

            <div style={statsStyle}>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb'}}>
                  {resultado.estadisticas.total_pdfs}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Total PDFs</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#059669'}}>
                  {resultado.estadisticas.renombrados_ok}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Renombrados OK</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b'}}>
                  {resultado.estadisticas.marcados_repetidos}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Marcados Repetidos</div>
              </div>
              <div style={statCardStyle}>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed'}}>
                  {resultado.estadisticas.carpetas_eliminadas}
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>Carpetas Eliminadas</div>
              </div>
            </div>

            {resultado.archivos_procesados.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{color: '#059669', marginBottom: '8px'}}>📄 Archivos Procesados:</h4>
                <div style={listStyle}>
                  {resultado.archivos_procesados.map((archivo, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{archivo.nombre_original}</strong>
                      <br />
                      <span style={{color: '#6b7280', fontSize: '0.8rem'}}>
                        → {archivo.nombre_final} | 
                        <span style={{color: archivo.tipo === 'OK' ? '#059669' : '#f59e0b'}}>
                          {archivo.tipo}
                        </span>
                        {archivo.fue_renumerado && <span style={{color: '#dc2626'}}> (Renumerado)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.errores.length > 0 && (
              <div>
                <h4 style={{color: '#dc2626', marginBottom: '8px'}}>❌ Errores:</h4>
                <div style={listStyle}>
                  {resultado.errores.map((error, index) => (
                    <div key={index} style={itemStyle}>
                      <strong>{error.archivo}</strong>
                      <br />
                      <span style={{color: '#dc2626', fontSize: '0.8rem'}}>
                        {error.error}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  // Resultado simple (mensaje de texto)
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{color: '#059669', margin: 0}}>✅ Proceso Completado</h3>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>
        <p>{resultado.message || resultado}</p>
      </div>
    </div>
  )
}