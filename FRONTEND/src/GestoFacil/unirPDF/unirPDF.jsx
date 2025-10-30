import React, { useState } from "react";
import "./unirPDF.css"

export default function UnirPDF() {
  const [ruta, setRuta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Usando la variable de entorno
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("ruta", ruta);

      const res = await fetch(`${API_BASE_URL}/unirPDF`, {
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
      <div className="doc-card" data-component="intermedio-pdf">
        <h2 className="doc-card-title">📑 Unir PDFs de cada Subcarpeta Jucio + Certificados</h2>

          <form onSubmit={handleSubmit}>
            <div className="doc-form-group">
              <input
                type="text"
                className="doc-form-input"
                placeholder="Ingrese la ruta de la carpeta principal con PDFS"
                value={ruta}
                onChange={(e) => setRuta(e.target.value)}
                required
              />

              <button 
                type="submit" 
                className="doc-btn doc-btn-intermedio-pdf"
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
            {"error" in resultado ? (
              <div className="doc-error-message">{resultado.error}</div>
            ) : (
              <>
                <h3 className="doc-success-message">✅ Proceso completado</h3>
                
                <div className="doc-stats-container">
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.carpetas_procesadas}</div>
                    <div>Carpetas procesadas</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">{resultado.carpetas_con_errores}</div>
                    <div>Carpetas con errores</div>
                  </div>
                </div>

                <h4>📂 Detalle por carpeta</h4>
                <div className="doc-folder-details">
                  {resultado.resultados_detallados.map((carpeta, idx) => (
                    <div key={idx} className="doc-folder-item">
                      <h5>{carpeta.carpeta}</h5>
                      <div className="doc-folder-stats">
                        <span>Archivos: {carpeta.archivos_procesados}</span>
                        <span>Páginas: {carpeta.total_paginas}</span>
                        <span>Archivo final: {carpeta.archivo_final || "No generado"}</span>
                      </div>
                      
                      {carpeta.errores.length > 0 && (
                        <div className="doc-error-list">
                          <h6>Errores:</h6>
                          <ul>
                            {carpeta.errores.map((err, i) => (
                              <li key={i}>⚠️ {err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}