import React, { useState } from "react";
import RenombrarPDF from "./GestoFacil/renombrarPDF/renombrarPDF"
import SubcarpetasPDF from "./GestoFacil/subcarpetasPDF/subcarpetasPDF"
import OrganizadorEXCEL from "./GestoFacil/organizadorEXCEL/organizadorEXCEL"
import ExtraerInfAprendiz from "./GestoFacil/extraerInfAprendiz/extraerInfAprendiz"
import UnirPDF from "./GestoFacil/unirPDF/unirPDF"
import RenombrarPDFFinal from "./GestoFacil/renombrarPDFFinal/renombrarPDFFinal"

function App() {
  const [activeTab, setActiveTab] = useState("RenombrarPDF");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 GestiFacil - Sistema de Procesamiento de Documentos</h1>
        <p>Automatiza el manejo de documentos PDFs, Excel y carpetas de manera rápida.</p>
      </header>

      <nav className="tabs-container">
        <button 
          className={`tab-button ${activeTab === "RenombrarPDF" ? "active RenombrarPDF" : "RenombrarPDF"}`} 
          onClick={() => setActiveTab("RenombrarPDF")}
        >
          🧾 Renombrar PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "SubcarpetasPDF" ? "active SubcarpetasPDF" : "SubcarpetasPDF"}`} 
          onClick={() => setActiveTab("SubcarpetasPDF")}
        >
          📂 Subcarpetas PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "OrganizadorEXCEL" ? "active OrganizadorEXCEL" : "OrganizadorEXCEL"}`} 
          onClick={() => setActiveTab("OrganizadorEXCEL")}
        >
          📊 Organizar EXCEL
        </button>

        {/* Nuevo botón para Extraer Información de Aprendices */}
        <button 
          className={`tab-button ${activeTab === "ExtraerInfAprendiz" ? "active ExtraerInfAprendiz" : "ExtraerInfAprendiz"}`} 
          onClick={() => setActiveTab("ExtraerInfAprendiz")}
        >
          👩‍🎓 Extraer Aprendices PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "UnirPDF" ? "active UnirPDF" : "UnirPDF"}`} 
          onClick={() => setActiveTab("UnirPDF")}
        >
          📑 Unir PDFs
        </button>

        <button 
          className={`tab-button ${activeTab === "RenombrarPDFFinal" ? "active RenombrarPDFFinal" : "RenombrarPDFFinal"}`} 
          onClick={() => setActiveTab("RenombrarPDFFinal")}
        >
          📤 Renombrar PDFs Final
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "RenombrarPDF" && <RenombrarPDF />}
        {activeTab === "SubcarpetasPDF" && <SubcarpetasPDF />}
        {activeTab === "OrganizadorEXCEL" && <OrganizadorEXCEL />}
        {activeTab === "ExtraerInfAprendiz" && <ExtraerInfAprendiz />}
        {activeTab === "UnirPDF" && <UnirPDF />}
        {activeTab === "RenombrarPDFFinal" && <RenombrarPDFFinal />}
      </main>

      <footer className="app-footer">
        <p>GestiFacil © 2025</p>
        <p>Desarrollador: Yair Cardenas</p>
      </footer>
    </div>
  );
}

export default App;
