import React, { useState } from "react";
import "./styles.css";

export default function ExtraerInfAprendiz() {
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

      const res = await fetch("http://127.0.0.1:8000/extraerInfAprendiz", {
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
      <div className="doc-card" data-component="extraer-aprendiz">
        <h2 className="doc-card-title">📘 Extraer Información de Aprendices del jucio a Excel</h2>

        <form onSubmit={handleSubmit}>
          <div className="doc-input-button-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta principal"
              value={ruta}
              onChange={(e) => setRuta(e.target.value)}
              required
            />
            <button
              type="submit"
              className="doc-btn doc-btn-extraer-aprendiz"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="doc-loading"></span> Procesando...
                </>
              ) : (
                "Ejecutar"
              )}
            </button>
          </div>
        </form>

        {error && <div className="doc-error-message">{error}</div>}

        {resultado && (
          <div className="doc-resultado">
            <h3 className="doc-success-message">
              ✅ {resultado.message || "Proceso completado"}
            </h3>

            <div className="doc-stats-container">
              <div className="doc-stat-item">
                <div className="doc-stat-value">
                  {resultado.total_pdfs_encontrados ?? 0}
                </div>
                <div>Total PDFs encontrados</div>
              </div>
              <div className="doc-stat-item">
                <div className="doc-stat-value">
                  {resultado.procesados_exitosos ?? 0}
                </div>
                <div>Procesados exitosamente</div>
              </div>
              <div className="doc-stat-item">
                <div className="doc-stat-value">
                  {resultado.procesados_con_error ?? 0}
                </div>
                <div>Con errores</div>
              </div>
            </div>

            {resultado.archivos_procesados?.length > 0 && (
              <>
                <h4>📄 Archivos procesados correctamente</h4>
                <ul className="doc-file-list">
                  {resultado.archivos_procesados.map((archivo, index) => (
                    <li key={index} className="doc-file-item">
                      <div>
                        <strong>{archivo.pdf}</strong> →{" "}
                        <em>{archivo.excel_generado}</em>
                      </div>
                      <div>
                        Subcarpeta: {archivo.subcarpeta}
                      </div>
                      <div>Registros procesados: {archivo.registros_procesados}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {resultado.errores?.length > 0 && (
              <>
                <h4>⚠️ Errores encontrados</h4>
                <ul className="doc-file-list">
                  {resultado.errores.map((err, idx) => (
                    <li key={idx} className="doc-file-item doc-error-item">
                      <div><strong>{err.pdf}</strong></div>
                      <div>Subcarpeta: {err.subcarpeta}</div>
                      <div>Error: {err.error}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
