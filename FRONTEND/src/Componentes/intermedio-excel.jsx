import { useState } from "react";

export default function IntermedioExcel({ onSubmit }) {
  const [rutaExcels, setRutaExcels] = useState("");
  const [rutaFichas, setRutaFichas] = useState("");
  const [resultado, setResultado] = useState(null);

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
  };

  const renderLista = (titulo, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="lista-section">
        <h4>{titulo} ({items.length})</h4>
        <ul className="lista">
          {items.map((item, index) => (
            <li key={index} className="lista-item">
              {item.nombre_archivo}
              {item.razon && ` - ${item.razon}`}
              {item.ficha && ` - Ficha: ${item.ficha}`}
              {item.extension && ` - Extensión: ${item.extension}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Proceso Intermedio de los Excel</h3>
        </div>
        <div className="card-content">
          <div>
            <label className="input-label">
              Ruta de la carpeta donde están los Excel:
            </label>
            <input
              type="text"
              value={rutaExcels}
              onChange={(e) => setRutaExcels(e.target.value.replace(/\\/g, "/"))}
              placeholder="C:/ruta/archivo.xlsx"
              className="input-text"
            />
          </div>
          <div>
            <label className="input-label">
              Ruta de la carpeta donde están las subcarpetas:
            </label>
            <input
              type="text"
              value={rutaFichas}
              onChange={(e) => setRutaFichas(e.target.value.replace(/\\/g, "/"))}
              placeholder="C:/ruta/a/fichas"
              className="input-text"
            />
          </div>
          <div className="button-container">
            <button className="btn-success" onClick={handleSubmit}>
              ⚡ Ejecutar Intermedio
            </button>
          </div>

          {resultado && (
            <div className="resultado">
              <h4 className={resultado.success ? "success-text" : "error-text"}>
                {resultado.success ? "✅ Proceso completado" : "❌ Error en el proceso"}
              </h4>

              {resultado.mensaje && <p>{resultado.mensaje}</p>}
              {resultado.error && <p className="error-text">{resultado.error}</p>}

              {resultado.estadisticas && (
                <div className="estadisticas">
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

      {/* 🎨 Estilos CSS */}
      <style>{`
        .card {
          background: linear-gradient(145deg, #ffffff, #f9fafb);
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          max-width: 600px;
          margin: 30px auto;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          margin-bottom: 18px;
          text-align: center;
        }

        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #059669;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .input-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          text-align: center;
        }

        .input-text {
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          text-align: center;
          transition: all 0.3s ease;
        }

        .input-text:focus {
          border-color: #059669;
          box-shadow: 0 0 6px rgba(5, 150, 105, 0.4);
        }

        .button-container {
          display: flex;
          justify-content: center;
        }

        .btn-success {
          width: 240px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.3s, transform 0.2s;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #047857, #065f46);
          transform: scale(1.07);
        }

        .resultado {
          margin-top: 25px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
        }

        .success-text {
          color: #059669;
          margin-bottom: 15px;
          font-weight: bold;
        }

        .error-text {
          color: #dc2626;
          font-weight: bold;
        }

        .estadisticas {
          margin-top: 10px;
          background: #ffffff;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .lista-section {
          margin-top: 15px;
        }

        .lista-section h4 {
          margin-bottom: 10px;
          color: #374151;
        }

        .lista {
          padding-left: 20px;
        }

        .lista-item {
          margin-bottom: 8px;
          padding: 10px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .lista-item:hover {
          background-color: #f0fdf4;
        }
      `}</style>
    </>
  );
}
