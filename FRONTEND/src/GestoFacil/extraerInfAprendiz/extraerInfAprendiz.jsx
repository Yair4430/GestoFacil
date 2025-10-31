import React, { useState } from "react";
import "./extraerInfAprendiz.css";

export default function ExtraerInfAprendiz() {
  const [ruta, setRuta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("ruta", ruta);

      const res = await fetch(`${API_BASE_URL}/extraerInfAprendiz`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await res.json();

      // 🟢 Normalizamos la respuesta del backend
      let archivos_exito = [];
      let archivos_error = [];
      let resumen = {};

      if (data.detalles) {
        data.detalles.forEach((item) => {
          if (item.estado === "exito") {
            archivos_exito.push(item);
          } else if (item.estado === "error") {
            archivos_error.push(item);
          } else if (item.message) {
            resumen.message = item.message;
          }
        });
      } else {
        // En caso de que llegue el formato antiguo
        archivos_exito = data.archivos_procesados || [];
        archivos_error = data.errores || [];
        resumen = data;
      }

      setResultado({
        message: resumen.message || data.message,
        total_pdfs_encontrados:
          data.total_pdfs_encontrados || archivos_exito.length + archivos_error.length,
        procesados_exitosos: archivos_exito.length,
        procesados_con_error: archivos_error.length,
        archivos_procesados: archivos_exito,
        errores: archivos_error,
      });
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extraer-aprendiz-wrapper">
      <div className="doc-container">
        <div className="doc-card" data-component="extraer-aprendiz">
          <h2 className="doc-card-title">
            👩‍🎓 Extraer Aprendices del juicio a Excel
          </h2>

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
                          ✅ <strong>{archivo.pdf}</strong>{" "}
                          ({archivo.registros_procesados || 0} registros)
                        </div>
                        {archivo.excel_generado && (
                          <div>
                            <em>Excel generado:</em> {archivo.excel_generado}
                          </div>
                        )}
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
                        <div>
                          ❌ <strong>{err.pdf}</strong>
                        </div>
                        {err.error && <div>Error: {err.error}</div>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
