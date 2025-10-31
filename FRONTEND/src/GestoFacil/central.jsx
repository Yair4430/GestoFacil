import React, { useState } from "react";
import RenombrarPDF from "./renombrarPDF/renombrarPDF";
import SubcarpetasPDF from "./subcarpetasPDF/subcarpetasPDF";
import OrganizadorEXCEL from "./organizadorEXCEL/organizadorEXCEL";
import ExtraerInfAprendiz from "./extraerInfAprendiz/extraerInfAprendiz";
import UnirPDF from "./unirPDF/unirPDF";
import RenombrarPDFFinal from "./renombrarPDFFinal/renombrarPDFFinal";
import "./central.css";

function Central() {
  const [activeTab, setActiveTab] = useState("RenombrarPDF");

  const colorMap = {
    RenombrarPDF: "blue",
    SubcarpetasPDF: "green",
    OrganizadorEXCEL: "orange",
    ExtraerInfAprendiz: "purple",
    UnirPDF: "red",
    RenombrarPDFFinal: "cyan",
  };

  const renderComponent = () => {
    switch (activeTab) {
      case "RenombrarPDF": return <RenombrarPDF />;
      case "SubcarpetasPDF": return <SubcarpetasPDF />;
      case "OrganizadorEXCEL": return <OrganizadorEXCEL />;
      case "ExtraerInfAprendiz": return <ExtraerInfAprendiz />;
      case "UnirPDF": return <UnirPDF />;
      case "RenombrarPDFFinal": return <RenombrarPDFFinal />;
      default: return null;
    }
  };

  return (
    <div className="central-wrapper">
      {/* Header con clase dinámica */}
      <header className={`header-premium theme-${colorMap[activeTab]}`}>
        <div className="brand">
          <div className="brand-icon">⚙️</div>
          <div className="brand-text">
            <h1>
              <span className="gesti">Gesti</span>
              <span className="facil">Facil</span>
            </h1>
            <p>Automatiza y simplifica tu flujo de documentos PDF y Excel</p>
          </div>
        </div>
        <div className="glow-line"></div>
      </header>

      <div className="buttons-container">
        <button 
          className={`main-btn blue ${activeTab === "RenombrarPDF" ? "active" : ""}`} 
          onClick={() => setActiveTab("RenombrarPDF")}
        >
          🧾 Renombrar PDFs
        </button>
        <button 
          className={`main-btn green ${activeTab === "SubcarpetasPDF" ? "active" : ""}`} 
          onClick={() => setActiveTab("SubcarpetasPDF")}
        >
          📂 Subcarpetas PDFs
        </button>
        <button 
          className={`main-btn orange ${activeTab === "OrganizadorEXCEL" ? "active" : ""}`} 
          onClick={() => setActiveTab("OrganizadorEXCEL")}
        >
          📊 Organizar Excel
        </button>
        <button 
          className={`main-btn purple ${activeTab === "ExtraerInfAprendiz" ? "active" : ""}`} 
          onClick={() => setActiveTab("ExtraerInfAprendiz")}
        >
          👩‍🎓 Extraer Aprendices
        </button>
        <button 
          className={`main-btn red ${activeTab === "UnirPDF" ? "active" : ""}`} 
          onClick={() => setActiveTab("UnirPDF")}
        >
          📑 Unir PDFs
        </button>
        <button 
          className={`main-btn cyan ${activeTab === "RenombrarPDFFinal" ? "active" : ""}`} 
          onClick={() => setActiveTab("RenombrarPDFFinal")}
        >
          📤 Renombrar Final
        </button>
      </div>

      <main className="content-area">
        <div className="main-container">
            {renderComponent()}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 <b>GestiFacil</b> — Desarrollado por <span>Yair Cárdenas</span></p>
      </footer>
    </div>
  );
}

export default Central;
