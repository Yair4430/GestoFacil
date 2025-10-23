import React, { useState } from "react";
import "./styles.css"

export default function SubcarpetasPDF() {
  const [ruta, setRuta] = useState("");
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
      formData.append("ruta", ruta);

      const res = await fetch("http://127.0.0.1:8000/entrada", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }

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
      <div className="doc-card" data-component="entrada">
        <h2 className="doc-card-title">📂Crear Subcarpetas y organizar PDFs</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="doc-input-button-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta Principal"
              value={ruta}
              onChange={(e) => setRuta(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="doc-btn doc-btn-entrada"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="doc-loading"></span> Procesando...
                </>
              ) : "Ejecutar"}
            </button>
          </div>
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
                    <div className="doc-stat-value">{resultado.estadisticas.archivos_invalidos}</div>
                    <div>Archivos inválidos</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.estadisticas.carpetas_creadas}</div>
                    <div>Carpetas creadas</div>
                  </div>
                </div>

                {resultado.archivos_movidos.length > 0 && (
                  <>
                    <h4>📑 Archivos Movidos</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_movidos.map((archivo, index) => (
                        <li key={index} className="doc-file-item">
                          <div><strong>{archivo.nombre_original}</strong> → {archivo.nombre_final}</div>
                          <div>Ficha: {archivo.ficha} | Instructor: {archivo.instructor}</div>
                          {archivo.fue_renombrado && <span className="doc-renamed"> (Renombrado)</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.archivos_invalidos.length > 0 && (
                  <>
                    <h4>⚠️ Archivos Inválidos</h4>
                    <ul className="doc-file-list">
                      {resultado.archivos_invalidos.map((inv, idx) => (
                        <li key={idx} className="doc-file-item">{inv}</li>
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