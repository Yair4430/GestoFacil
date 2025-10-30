import React, { useState } from "react";
import SubcarpetasPDF from "./Componentes/SubcarpetasPDF";
import OrganizadorEXCEL from "./Componentes/organizadorEXCEL";
import ExtraerInfAprendiz from "./Componentes/ExtraerInfAprendiz"; // 👈 nuevo componente
import UnirPDF from "./Componentes/UnirPDF";
import RenombrarPDFFinal from "./Componentes/RenombrarPDFFinal";
import RenombrarPDF from "./Componentes/RenombrarPDF";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("entrada-extractornombre");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 GestiFacil - Sistema de Procesamiento de Documentos</h1>
        <p>Automatiza el manejo de documentos PDFs, Excel y carpetas de manera rápida.</p>
      </header>

      <nav className="tabs-container">
        <button 
          className={`tab-button ${activeTab === "entrada-extractornombre" ? "active entrada-extractornombre" : "entrada-extractornombre"}`} 
          onClick={() => setActiveTab("entrada-extractornombre")}
        >
          🧾 Renombrar PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "entrada" ? "active entrada" : "entrada"}`} 
          onClick={() => setActiveTab("entrada")}
        >
          📂 Subcarpetas PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "intermedio-excel" ? "active intermedio-excel" : "intermedio-excel"}`} 
          onClick={() => setActiveTab("intermedio-excel")}
        >
          📊 Organizar EXCEL
        </button>

        {/* Nuevo botón para Extraer Información de Aprendices */}
        <button 
          className={`tab-button ${activeTab === "extraer-aprendices" ? "active extraer-aprendices" : "extraer-aprendices"}`} 
          onClick={() => setActiveTab("extraer-aprendices")}
        >
          👩‍🎓 Extraer Aprendices PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "intermedio-pdf" ? "active intermedio-pdf" : "intermedio-pdf"}`} 
          onClick={() => setActiveTab("intermedio-pdf")}
        >
          📑 Unir PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "salida" ? "active salida" : "salida"}`} 
          onClick={() => setActiveTab("salida")}
        >
          📤 Renombrar PDFs Final
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "entrada-extractornombre" && <RenombrarPDF />}
        {activeTab === "entrada" && <SubcarpetasPDF />}
        {activeTab === "intermedio-excel" && <OrganizadorEXCEL />}
        {activeTab === "extraer-aprendices" && <ExtraerInfAprendiz />} {/* 👈 nuevo render */}
        {activeTab === "intermedio-pdf" && <UnirPDF />}
        {activeTab === "salida" && <RenombrarPDFFinal />}
      </main>

      <footer className="app-footer">
        <p>GestiFacil © 2025</p>
        <p>Desarrollador: Yair Cardenas</p>
      </footer>
    </div>
  );
}

export default App;
