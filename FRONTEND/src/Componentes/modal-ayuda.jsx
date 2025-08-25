import { useState } from "react"

export default function ModalAyuda({ isOpen, onClose }) {
  if (!isOpen) return null

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(3px)"
  }

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "850px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 25px 40px rgba(0,0,0,0.15)",
    position: "relative",
    animation: "fadeIn 0.3s ease-in-out"
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "16px"
  }

  const titleStyle = {
    fontSize: "1.7rem",
    fontWeight: "bold",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }

  const closeButtonStyle = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s"
  }

  const sectionStyle = {
    marginBottom: "28px",
    padding: "22px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    transition: "all 0.2s"
  }

  const sectionTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }

  const sectionContentStyle = {
    fontSize: "0.95rem",
    lineHeight: "1.65",
    color: "#374151"
  }

  const highlightBox = (bgColor) => ({
    marginTop: "14px",
    padding: "10px 12px",
    backgroundColor: bgColor,
    borderRadius: "6px",
    fontSize: "0.9rem"
  })

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>📘 Guía del Organizador</h2>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>

        {/* ENTRADA */}
        <div style={sectionStyle}>
          <h3 style={{ ...sectionTitleStyle, color: "#2563eb" }}>📄 Proceso de Entrada</h3>
          <p style={sectionContentStyle}>
            Se crean carpetas basadas en el número de ficha (nombre del PDF). 
            Los documentos relacionados se almacenan en esa carpeta, facilitando la organización.
          </p>
          <div style={highlightBox("#eff6ff")}>
            <strong>Ejemplo:</strong> <br />
            "12345 JUAN DAVID PEREZ GONZALEZ.pdf" → Carpeta <strong>12345</strong> con todos los documentos.
          </div>
        </div>

        {/* INTERMEDIO EXCEL */}
        <div style={sectionStyle}>
          <h3 style={{ ...sectionTitleStyle, color: "#059669" }}>📊 Proceso Intermedio (Excel)</h3>
          <p style={sectionContentStyle}>
            Los Excel generados se guardan en una carpeta y luego se distribuyen automáticamente 
            en las carpetas correspondientes al número de ficha.
          </p>
          <div style={highlightBox("#f0fdf4")}>
            <strong>Función:</strong> Organiza automáticamente los Excel en sus carpetas de ficha.
          </div>
        </div>

        {/* INTERMEDIO PDFs */}
        <div style={sectionStyle}>
          <h3 style={{ ...sectionTitleStyle, color: "#dc2626" }}>🔄 Proceso Intermedio (PDFs)</h3>
          <p style={sectionContentStyle}>
            Une todos los PDFs de cada carpeta en uno solo. El archivo principal (instructor) va primero, 
            seguido de los demás en orden alfabético.
          </p>
          <ul style={{ margin: "10px 0", paddingLeft: "22px", color: "#374151", fontSize: "0.9rem" }}>
            <li>📋 <strong>Principal primero:</strong> "NÚMERO + NOMBRE INSTRUCTOR"</li>
            <li>🆔 Detecta certificados de cédula automáticamente</li>
            <li>🗑️ Elimina páginas en blanco</li>
            <li>🧹 Solo conserva el PDF unificado final</li>
          </ul>
          <div style={highlightBox("#fef2f2")}>
            <strong>Formato requerido:</strong> " Numero de ficha + Nombres y Apellidos Ej: 12345 JUAN DAVID PEREZ GONZALEZ.pdf"
          </div>
        </div>

        {/* FINAL */}
        <div style={sectionStyle}>
          <h3 style={{ ...sectionTitleStyle, color: "#7c3aed" }}>📥 Proceso Final</h3>
          <p style={sectionContentStyle}>
            Extrae los juicios finales. Archivos correctos reciben sufijo <code>_OK</code>; 
            si terminan en guion bajo, se renombran como <code>_REPETIDO</code>.
          </p>
          <div style={highlightBox("#faf5ff")}>
            <strong>Ejemplos:</strong>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>✅ "12345 JUAN DAVID PEREZ GONZALEZ_OK.pdf"</li>
              <li>⚠️ "12345 JUAN DAVID PEREZ GONZALEZ_REPETIDO.pdf"</li>
            </ul>
          </div>
        </div>

        {/* TIP */}
        <div style={{
          marginTop: "28px",
          padding: "16px",
          backgroundColor: "#f3f4f6",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <p style={{ margin: 0, color: "#374151", fontSize: "0.95rem" }}>
            💡 <strong>Consejo:</strong> Ejecuta los procesos en orden:  
            <em> Entrada → Intermedio Excel → Intermedio PDFs → Final</em> para mejores resultados.
          </p>
        </div>
      </div>
    </div>
  )
}
