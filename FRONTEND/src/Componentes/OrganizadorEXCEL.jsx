import React, { useState } from "react";
import "./styles.css"

export default function OrganizadorEXCEL() {
  const [rutaExcels, setRutaExcels] = useState("");
  const [rutaFichas, setRutaFichas] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("rutaExcels", rutaExcels);
      formData.append("rutaFichas", rutaFichas);

      const res = await fetch("http://127.0.0.1:8000/organizadorEXCEL", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la solicitud");

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      setError("Hubo un problema al procesar la solicitud.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-container">
      <div className="doc-card" data-component="intermedio-excel">
        <h2 className="doc-card-title">📊 Organizador de Excel a Subcarpetas</h2>

        <form onSubmit={handleSubmit}>
          <div className="doc-form-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta con los Excels"
              value={rutaExcels}
              onChange={(e) => setRutaExcels(e.target.value)}
              required
            />
          </div>
          <div className="doc-form-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta con las subcarpetas"
              value={rutaFichas}
              onChange={(e) => setRutaFichas(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="doc-btn doc-btn-intermedio-excel"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="doc-loading"></span> Procesando...
              </>
            ) : "Ejecutar"}
          </button>
        </form>

        {error && <div className="doc-error-message">{error}</div>}

        {resultado && (
          <div className="doc-resultado">
            <h3 className="doc-success-message">✅ {resultado.success ? "Proceso completado" : "Error en el proceso"}</h3>
            
            {resultado.success ? (
              <>
                <p>{resultado.mensaje}</p>
                
                <div className="doc-stats-container">
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.total_archivos}</div>
                    <div>Total archivos</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.archivos_movidos}</div>
                    <div>Archivos movidos</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.archivos_omitidos}</div>
                    <div>Archivos omitidos</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.archivos_invalidos}</div>
                    <div>Archivos inválidos</div>
                  </div>
                </div>

                {resultado.archivos_movidos.length > 0 && (
                  <>
                    <h4>📁 Archivos Movidos</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_movidos.map((archivo, idx) => (
                        <li key={idx} className="doc-file-item">
                          <div><strong>{archivo.nombre_archivo}</strong> → {archivo.carpeta_destino}</div>
                          <div>Ficha: {archivo.ficha} | Ext: {archivo.extension}</div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.archivos_omitidos.length > 0 && (
                  <>
                    <h4>⚠️ Archivos Omitidos</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_omitidos.map((archivo, idx) => (
                        <li key={idx} className="doc-file-item">
                          <div><strong>{archivo.nombre_archivo}</strong></div>
                          <div>Razón: {archivo.razon}</div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.archivos_invalidos.length > 0 && (
                  <>
                    <h4>❌ Archivos Inválidos</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_invalidos.map((archivo, idx) => (
                        <li key={idx} className="doc-file-item">
                          <div><strong>{archivo.nombre_archivo}</strong></div>
                          <div>Razón: {archivo.razon}</div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <div className="doc-error-message">{resultado.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}