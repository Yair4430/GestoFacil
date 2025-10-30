import React, { useState } from "react";

export default function RenombrarPDF () {
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

     const res = await fetch(`${API_BASE_URL}/renombrarPDF`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setError("⚠️ Hubo un problema al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-container">
      <div className="doc-card" data-component="entrada-extractornombre">
        <h2 className="doc-card-title">🧾 Renombrar PDFs Ficha + Nombre del Instructor</h2>

        <form onSubmit={handleSubmit}>
          <div className="doc-input-button-group">
            <input
              type="text"
              className="doc-form-input"
              placeholder="Ingrese la ruta de la carpeta principal con los PDFs"
              value={ruta}
              onChange={(e) => setRuta(e.target.value)}
              required
            />
            <button
                type="submit"
                className="doc-btn doc-btn-entrada-extractornombre"
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
            <h3 className="doc-success-message">✅ Resultado del proceso</h3>

            {resultado.error ? (
              <div className="doc-error-message">{resultado.error}</div>
            ) : (
              <>
                <div className="doc-stats-container">
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">
                      {resultado.renombrados?.length || 0}
                    </div>
                    <div>Renombrados</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">
                      {resultado.no_renombrados?.length || 0}
                    </div>
                    <div>No renombrados</div>
                  </div>
                  <div className="doc-stat-item">
                    <div className="doc-stat-value">
                      {resultado.errores?.length || 0}
                    </div>
                    <div>Errores</div>
                  </div>
                </div>

                {resultado.renombrados?.length > 0 && (
                  <>
                    <h4>📄 PDFs Renombrados</h4>
                    <ul className="doc-file-list">
                      {resultado.renombrados.map((archivo, i) => (
                        <li key={i} className="doc-file-item">
                          {archivo}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.no_renombrados?.length > 0 && (
                  <>
                    <h4>⚠️ No Renombrados (Movidos a "No_Renombrados")</h4>
                    <ul className="doc-file-list">
                      {resultado.no_renombrados.map((archivo, i) => (
                        <li key={i} className="doc-file-item">{archivo}</li>
                      ))}
                    </ul>
                  </>
                )}

                {resultado.errores?.length > 0 && (
                  <>
                    <h4>❌ Errores durante el proceso</h4>
                    <ul className="doc-file-list">
                      {resultado.errores.map((err, i) => (
                        <li key={i} className="doc-file-item">
                          {err.archivo}: {err.estado}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
