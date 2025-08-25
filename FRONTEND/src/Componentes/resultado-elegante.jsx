export default function ResultadoElegante({ resultado, isError, onClose }) {
  if (!resultado) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3 className={isError ? "title error" : "title success"}>
            {isError || !resultado.success ? "❌ Error en el Proceso" : "✅ Proceso Completado"}
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="content">
          {/* 🔴 Si es error */}
          {isError || !resultado.success ? (
            <p className="error-text">
              {typeof resultado.error === "string"
                ? resultado.error
                : JSON.stringify(resultado.error || resultado)}
            </p>
          ) : (
            <>
              {/* 📊 Si hay estadísticas */}
              {resultado.estadisticas && (
                <div className="stats">
                  {Object.entries(resultado.estadisticas).map(([key, value]) => (
                    <div className="stat-card" key={key}>
                      <div className="stat-value">{value}</div>
                      <div className="stat-label">{key.replace(/_/g, " ")}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 📁 Archivos movidos */}
              {resultado.archivos_movidos?.length > 0 && (
                <div className="list-section">
                  <h4 className="list-title success">📁 Archivos Procesados</h4>
                  <div className="list-box">
                    {resultado.archivos_movidos.map((archivo, index) => (
                      <div key={index} className="list-item">
                        <strong>{archivo.nombre_original}</strong>
                        <br />
                        <span>
                          → Ficha {archivo.ficha} | {archivo.instructor}
                          {archivo.fue_renombrado && (
                            <span className="tag error">Renombrado</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ⚠️ Archivos inválidos */}
              {resultado.archivos_invalidos?.length > 0 && (
                <div className="list-section">
                  <h4 className="list-title error">⚠️ Archivos Inválidos</h4>
                  <div className="list-box">
                    {resultado.archivos_invalidos.map((archivo, index) => (
                      <div key={index} className="list-item error-text">
                        {typeof archivo === "string"
                          ? archivo
                          : `${archivo.nombre_archivo || "??"} - ${archivo.razon || "Sin razón"}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🎨 Estilos */}
        <style>{`
          .overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex; justify-content: center; align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
          }

          .modal {
            background: white;
            border-radius: 16px;
            padding: 28px;
            max-width: 760px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            position: relative;
            animation: slideUp 0.35s ease;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }

          .title {
            margin: 0;
            font-weight: 700;
            font-size: 1.3rem;
          }
          .title.success { color: #059669; }
          .title.error { color: #ef4444; }

          .close-btn {
            background: #ef4444;
            border: none;
            border-radius: 50%;
            color: white;
            width: 32px;
            height: 32px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s, transform 0.2s;
          }
          .close-btn:hover {
            background: #dc2626;
            transform: scale(1.1);
          }

          .content { font-size: 0.95rem; color: #374151; }

          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .stat-card {
            background: #f9fafb;
            padding: 14px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
          }

          .stat-value {
            font-size: 1.6rem;
            font-weight: bold;
            color: #2563eb;
          }
          .stat-label {
            font-size: 0.85rem;
            color: #6b7280;
          }

          .list-section { margin-bottom: 20px; }
          .list-title {
            margin-bottom: 8px;
            font-weight: 600;
          }
          .list-title.success { color: #059669; }
          .list-title.error { color: #dc2626; }

          .list-box {
            max-height: 220px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background: #f8fafc;
            padding: 12px;
          }

          .list-item {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 0.9rem;
          }
          .list-item:last-child { border-bottom: none; }

          .tag {
            display: inline-block;
            margin-left: 6px;
            padding: 2px 6px;
            font-size: 0.75rem;
            border-radius: 6px;
          }
          .tag.error {
            background: #fee2e2;
            color: #b91c1c;
          }

          .error-text { color: #dc2626; }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
