// src/components/OrganizadorArchivos.jsx
import React, { useState } from "react";
import axios from "axios";

const Procesos = () => {
  const [rutaEntrada, setRutaEntrada] = useState("");
  const [rutaExcels, setRutaExcels] = useState("");
  const [rutaFichas, setRutaFichas] = useState("");
  const [rutaSalida, setRutaSalida] = useState("");
  const [mensaje, setMensaje] = useState("");

  const normalizarRuta = (valor) => valor.replace(/\\/g, "/");

  const handleSubmit = async (ruta, endpoint) => {
    try {
      const formData = new FormData();
      Object.entries(ruta).forEach(([key, value]) => formData.append(key, value));

      const res = await axios.post(`http://localhost:8000/${endpoint}`, formData);
      setMensaje(res.data.message);
    } catch (error) {
      setMensaje(error.response?.data?.error || "Ocurrió un error inesperado");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">Organizador de Archivos PDF y Excel</h1>

      {/* Entrada PDF */}
      <div>
        <label className="block font-semibold">Ruta Carpeta PDFs:</label>
        <input
          type="text"
          value={rutaEntrada}
          onChange={(e) => setRutaEntrada(normalizarRuta(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={() => handleSubmit({ ruta: rutaEntrada }, "entrada")}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ejecutar Entrada
        </button>
      </div>

      {/* Intermedio Excel */}
      <div>
        <label className="block font-semibold">Ruta Excel:</label>
        <input
          type="text"
          value={rutaExcels}
          onChange={(e) => setRutaExcels(normalizarRuta(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <label className="block font-semibold mt-2">Ruta Carpeta Fichas:</label>
        <input
          type="text"
          value={rutaFichas}
          onChange={(e) => setRutaFichas(normalizarRuta(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={() => handleSubmit({ rutaExcels, rutaFichas }, "intermedio")}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ejecutar Intermedio
        </button>
      </div>

      {/* Salida PDF */}
      <div>
        <label className="block font-semibold">Ruta Salida:</label>
        <input
          type="text"
          value={rutaSalida}
          onChange={(e) => setRutaSalida(normalizarRuta(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={() => handleSubmit({ ruta: rutaSalida }, "salida")}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Ejecutar Salida
        </button>
      </div>

      {/* Mensaje de respuesta */}
      {mensaje && <div className="mt-4 text-center text-green-700 font-medium">{mensaje}</div>}
    </div>
  );
};

export default Procesos;
