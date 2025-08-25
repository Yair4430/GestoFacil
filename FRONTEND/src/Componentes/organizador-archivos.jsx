import { useState } from "react";
import axios from "axios";
import EntradaPDF from "./entrada-pdf";
import IntermedioExcel from "./intermedio-excel";
import IntermedioPDF from "./intermedio-pdf";
import SalidaPDF from "./salida-pdf";
import ModalAyuda from "./modal-ayuda";
import ResultadoElegante from "./resultado-elegante";

export default function OrganizadorArchivos() {
  const [resultado, setResultado] = useState(null);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showResultado, setShowResultado] = useState(false);

  const handleSubmit = async (data, endpoint) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const res = await axios.post(
        `http://localhost:8000/${endpoint}`,
        formData
      );
      setResultado(res.data);
      setIsError(false);
      setShowResultado(true);
    } catch (error) {
      setResultado(error.response?.data?.error || "Ocurrió un error inesperado");
      setIsError(true);
      setShowResultado(true);
    }
  };

  const cerrarResultado = () => {
    setShowResultado(false);
    setResultado(null);
    setIsError(false);
  };

  return (
    <div className="container">
      <section className="main">
        {/* 🔹 Encabezado hero */}
        <header className="header">
          <button
            className="help-button"
            onClick={() => setShowModal(true)}
            title="Ayuda"
          >
            ?
          </button>
          <h1 className="title">GestionFacil</h1>
          <p className="subtitle">
            Organiza los juicios de evaluación y avanza en el proceso de
            certificación de manera masiva y eficiente.
          </p>
        </header>

        {/* 🔹 Grid de pasos */}
        <section className="grid">
          <EntradaPDF onSubmit={handleSubmit} />
          <IntermedioExcel onSubmit={handleSubmit} />
          <IntermedioPDF onSubmit={handleSubmit} />
          <SalidaPDF onSubmit={handleSubmit} />
        </section>
      </section>

      <ModalAyuda isOpen={showModal} onClose={() => setShowModal(false)} />

      {showResultado && (
        <ResultadoElegante
          resultado={resultado}
          isError={isError}
          onClose={cerrarResultado}
        />
      )}

      {/* 🎨 Estilos mejorados */}
      <style>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff, #f8fafc, #ede9fe);
          padding: 40px 20px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        .main {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }
        /* 🔹 Header tipo Hero */
        .header {
          text-align: center;
          position: relative;
          padding: 0px 0px 0px; /* menos espacio arriba/abajo */
          margin-bottom: 20px;     /* separa un poco del grid */
        }

        .title {
          font-size: 2.5rem; /* más compacto que 3rem */
          font-weight: 900;
          background: linear-gradient(90deg, #2563eb, #7c3aed, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px; /* menos separación del subtítulo */
          letter-spacing: -0.5px;
          animation: fadeIn 0.8s ease-in-out;
        }

        .subtitle {
          font-size: 1.1rem; /* un poco más pequeño */
          color: #475569;
          max-width: 640px;  /* más angosto para que se vea centrado y elegante */
          margin: 0 auto;
          line-height: 1.5;
        }

        .title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(90deg, #2563eb, #7c3aed, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 18px;
          letter-spacing: -1px;
          animation: fadeIn 1s ease-in-out;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #475569;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.7;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .help-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
          transition: all 0.3s ease-in-out;
        }

        .help-button:hover {
          background: linear-gradient(135deg, #4338ca, #3730a3);
          transform: scale(1.15) rotate(8deg);
        }

        /* 🔹 Grid más elegante */
        .grid {
          display: grid;
          gap: 36px;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          padding: 10px;
        }

        /* 🔹 Estilo directo a cada componente del grid */
        .grid > * {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transition: transform 0.25s ease, box-shadow 0.3s ease;
        }

        .grid > *:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
}
