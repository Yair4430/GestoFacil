// App.jsx
import React, { useState } from "react";
import EntradaPDF from "./Componentes/entrada-pdf";
import IntermedioExcel from "./Componentes/intermedio-excel";
import IntermedioPDF from "./Componentes/intermedio-pdf";
import SalidaPDF from "./Componentes/salida-pdf";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("entrada");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 GestiFacil - Sistema de Procesamiento de Documentos</h1>
        <p>Gestiona y organiza tus archivos PDF y Excel de manera eficiente</p>
      </header>

      <nav className="tabs-container">
        <button 
          className={`tab-button ${activeTab === "entrada" ? "active entrada" : "entrada"}`} 
          onClick={() => setActiveTab("entrada")}
        >
          📂 Entrada PDF
        </button>
        <button 
          className={`tab-button ${activeTab === "intermedio-excel" ? "active intermedio-excel" : "intermedio-excel"}`} 
          onClick={() => setActiveTab("intermedio-excel")}
        >
          📊 Intermedio Excel
        </button>
        <button 
          className={`tab-button ${activeTab === "intermedio-pdf" ? "active intermedio-pdf" : "intermedio-pdf"}`} 
          onClick={() => setActiveTab("intermedio-pdf")}
        >
          📑 Intermedio PDF
        </button>
        <button 
          className={`tab-button ${activeTab === "salida" ? "active salida" : "salida"}`} 
          onClick={() => setActiveTab("salida")}
        >
          📤 Salida PDF
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "entrada" && <EntradaPDF />}
        {activeTab === "intermedio-excel" && <IntermedioExcel />}
        {activeTab === "intermedio-pdf" && <IntermedioPDF />}
        {activeTab === "salida" && <SalidaPDF />}
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión Documental © 2025</p>
      </footer>
    </div>
  );
}

export default App;