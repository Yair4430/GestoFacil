import React, { useState } from "react";

const RenombrarPDFFinal = () => {
  const [ruta, setRuta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Usando la variable de entorno
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("ruta", ruta);

      const res = await fetch(`${API_BASE_URL}/renombrarPDFFinal`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la petición al servidor");

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="doc-container">
      <div className="doc-card" data-component="salida">
        <h2 className="doc-card-title">📤 Renombrar PDFs, Sacarlos y borralos de las Subcarpetas</h2>
        
        <form onSubmit={manejarSubmit}>
          <div className="doc-form-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta Principal"
              value={ruta}
              onChange={(e) => setRuta(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="doc-btn doc-btn-salida"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="doc-loading"></span> Procesando...
              </>
            ) : "Ejecutar"}
          </button>
        </form>

        {error && <div className="doc-error-message">{error}</div>}

        {resultado && (
          <div className="doc-resultado">
            {resultado.success ? (
              <>
                <h3 className="doc-success-message">✅ {resultado.mensaje}</h3>
                
                <div className="doc-stats-container">
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.total_pdfs}</div>
                    <div>Total PDFs</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.renombrados_ok}</div>
                    <div>Renombrados OK</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.marcados_repetidos}</div>
                    <div>Marcados Repetidos</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.errores}</div>
                    <div>Errores</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.carpetas_eliminadas}</div>
                    <div>Carpetas Eliminadas</div>
                  </div>
                </div>

                {resultado.archivos_procesados.length > 0 && (
                  <>
                    <h4>📑 Archivos Procesados</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_procesados.map((archivo, index) => (
                        <li key={index} className="doc-file-item">
                          <div><strong>{archivo.nombre_original}</strong> → {archivo.nombre_final}</div>
                          <div>Tipo: {archivo.tipo}</div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.errores.length > 0 && (
                  <>
                    <h4>⚠️ Errores</h4>
                    <ul className="doc-file-list">
                      {resultado.errores.map((err, index) => (
                        <li key={index} className="doc-file-item doc-error-item">
                          {err.archivo ? (
                            <>
                              <div><strong>{err.archivo}:</strong></div>
                              <div>{err.error}</div>
                            </>
                          ) : (
                            <div>{err.error}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <div className="doc-error-message">❌ {resultado.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenombrarPDFFinal;