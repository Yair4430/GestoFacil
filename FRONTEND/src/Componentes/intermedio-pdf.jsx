import { useState } from "react";

export default function IntermedioPDF({ onSubmit }) {
  const [ruta, setRuta] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await onSubmit({ ruta }, "intermedio-pdfs");
      setResultado(response);
      setRuta("");
    } catch (error) {
      console.error("Error:", error);
      setResultado({
        success: false,
        error: "Error al ejecutar el proceso",
      });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title-red">🔄 Proceso Intermedio de PDFs</h3>
        </div>
        <div className="card-content">
          <div>
            <label className="input-label">
              Ruta de la carpeta con los PDFs a unir:
            </label>
            <input
              type="text"
              value={ruta}
              onChange={(e) => setRuta(e.target.value.replace(/\\/g, "/"))}
              placeholder="C:/ruta/a/carpeta/pdfs"
              className="input-text"
            />
          </div>
          <div className="button-container">
            <button className="btn-danger" onClick={handleSubmit}>
              ⚡ Ejecutar Intermedio
            </button>
          </div>

          {resultado && (
            <div className="resultado">
              <h4 className={resultado.success ? "success-text" : "error-text"}>
                {resultado.success
                  ? "✅ Proceso completado"
                  : "❌ Error en el proceso"}
              </h4>

              {resultado.mensaje && <p>{resultado.mensaje}</p>}
              {resultado.error && (
                <p className="error-text">{resultado.error}</p>
              )}
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

        .card-title-red {
          font-size: 1.4rem;
          font-weight: 700;
          color: #dc2626;
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
          border-color: #dc2626;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.4);
        }

        .button-container {
          display: flex;
          justify-content: center;
        }

        .btn-danger {
          width: 240px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background 0.3s, transform 0.2s;
        }

        .btn-danger:hover {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
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
      `}</style>
    </>
  );
}
