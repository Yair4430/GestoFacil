import { useState } from "react";

export default function EntradaPDF({ onSubmit }) {
  const [ruta, setRuta] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await onSubmit({ ruta }, "entrada");
      setResultado(response);
      setRuta("");
    } catch (error) {
      console.error("Error:", error);
      setResultado({ success: false, error: "Error al ejecutar el proceso" });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title-blue">📄 Proceso de Entrada de los PDFs</h3>
        </div>

        {/* 🔒 Contenedor que controla el ancho del formulario */}
        <div className="form-container">
          <label className="input-label">
            Ruta de la carpeta donde están los juicios de evaluación:
          </label>

          <input
            type="text"
            value={ruta}
            onChange={(e) => setRuta(e.target.value.replace(/\\/g, "/"))}
            placeholder="C:/ruta/a/carpeta/pdfs"
            className="input-text"
          />

          <button className="btn-blue" onClick={handleSubmit}>
            🚀 Ejecutar Entrada
          </button>

          {resultado && (
            <div className={`resultado ${resultado.success ? "ok" : "err"}`}>
              <h4 className={resultado.success ? "success-text" : "error-text"}>
                {resultado.success ? "✅ Proceso completado" : "❌ Error en el proceso"}
              </h4>
              {resultado.mensaje && <p>{resultado.mensaje}</p>}
              {resultado.error && <p className="error-text">{resultado.error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* 🎨 Estilos */}
      <style>{`
        /* Evita que el padding aumente el ancho total */
        .card, .card * { box-sizing: border-box; }

        .card {
          background: linear-gradient(145deg, #ffffff, #f9fafb);
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
          max-width: 600px;
          margin: 30px auto;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(0,0,0,0.12); }

        .card-header { margin-bottom: 10px; text-align: center; }
        .card-title-blue {
          font-size: 1.4rem; font-weight: 700; color: #2563eb;
          display: flex; justify-content: center; align-items: center; gap: 10px;
        }

        /* 📐 Aquí se controla el ancho real del formulario */
        .form-container {
          width: 100%;
          max-width: 420px;         /* <-- ajusta este valor para igualar todos los cards */
          margin: 0 auto;           /* centra dentro de la card */
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 8px;
        }

        .input-label {
          font-size: 0.95rem; font-weight: 600; color: #374151; text-align: center;
        }

        .input-text {
          width: 100%;              /* ocupa el ancho del contenedor (máx 420px) */
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          text-align: center;
          transition: all .3s ease;
        }
        .input-text:focus { border-color: #2563eb; box-shadow: 0 0 6px rgba(37,99,235,.4); }

        .btn-blue {
          width: 100%;              /* botón del mismo ancho que el input */
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          transition: background .3s, transform .2s;
        }
        .btn-blue:hover { background: linear-gradient(135deg, #1d4ed8, #1e3a8a); transform: scale(1.03); }

        .resultado { margin-top: 10px; padding: 14px; border-radius: 12px; text-align: center; }
        .resultado.ok { background: #ecfdf5; border: 1px solid #10b981; }
        .resultado.err { background: #fef2f2; border: 1px solid #dc2626; }

        .success-text { color: #059669; font-weight: bold; margin-bottom: 8px; }
        .error-text { color: #dc2626; font-weight: bold; }
      `}</style>
    </>
  );
}
