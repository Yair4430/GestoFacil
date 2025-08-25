import { useState } from "react"

export default function ModalAyuda({ isOpen, onClose }) {
  if (!isOpen) return null

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '16px'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  }

  const closeButtonStyle = {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const sectionStyle = {
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  }

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const sectionContentStyle = {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#4b5563'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>📋 Guía del Organizador de Archivos</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={sectionStyle}>
          <h3 style={{...sectionTitleStyle, color: '#2563eb'}}>
            📄 Proceso de Entrada
          </h3>
          <p style={sectionContentStyle}>
            En este proceso, se crean carpetas basadas en el número de ficha, que corresponde al nombre del PDF. 
            Todos los juicios generados se almacenan dentro de la carpeta que tiene el mismo número de ficha, 
            facilitando la organización y el acceso a los documentos relacionados.
          </p>
          <div style={{marginTop: '12px', padding: '8px', backgroundColor: '#eff6ff', borderRadius: '4px'}}>
            <strong>Ejemplo:</strong> Si tienes un PDF llamado "12345_Juan_Perez.pdf", se creará una carpeta "12345" 
            donde se almacenarán todos los documentos relacionados.
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{...sectionTitleStyle, color: '#059669'}}>
            📊 Proceso Intermedio (Excel)
          </h3>
          <p style={sectionContentStyle}>
            Después de generar todos los archivos Excel con los datos, estos se guardan en una carpeta específica. 
            Posteriormente, los Excel se distribuyen en subcarpetas de fichas, asegurando que cada archivo se almacene 
            en la carpeta correspondiente al número de ficha, lo que optimiza la gestión de la información.
          </p>
          <div style={{marginTop: '12px', padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '4px'}}>
            <strong>Función:</strong> Toma los archivos Excel generados y los organiza automáticamente en las carpetas 
            de fichas correspondientes, manteniendo la estructura organizacional.
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{...sectionTitleStyle, color: '#dc2626'}}> {/* Color rojo */}
            🔄 Proceso Intermedio (PDFs)
          </h3>
          <p style={sectionContentStyle}>
            Este proceso une todos los archivos PDF dentro de cada carpeta de ficha en un único archivo PDF. 
            El sistema identifica automáticamente el PDF principal (con formato de instructor) y lo coloca primero, 
            seguido de los demás documentos en orden alfabético.
          </p>
          <p style={sectionContentStyle}>
            <strong>Características especiales:</strong>
          </p>
          <ul style={{margin: '8px 0', paddingLeft: '20px', color: '#4b5563'}}>
            <li>📋 <strong>PDF principal primero:</strong> El archivo con formato "NÚMERO NOMBRE INSTRUCTOR" va al inicio</li>
            <li>🆔 <strong>Procesamiento inteligente:</strong> Detecta y procesa certificados de cédula automáticamente</li>
            <li>🗑️ <strong>Limpieza automática:</strong> Elimina páginas en blanco de certificados de cédula</li>
            <li>🧹 <strong>Organización:</strong> Mantiene solo el archivo unido final, eliminando los originales</li>
          </ul>
          <div style={{marginTop: '12px', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '4px'}}>
            <strong>Formato requerido:</strong> El PDF principal debe tener el formato "3283019 LAURA DANIELA TOQUICA LA ROTTA.pdf" 
            (número de 6+ dígitos + espacio + nombre completo en mayúsculas)
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={{...sectionTitleStyle, color: '#7c3aed'}}>
            📥 Proceso Final
          </h3>
          <p style={sectionContentStyle}>
            Una vez completado el proceso con los juicios, este paso extrae los juicios de las carpetas y les asigna 
            un sufijo "_OK" a aquellos que solo contienen en su nombre el formato 'FICHA + NOMBRES Y APELLIDOS DE INSTRUCTOR'. 
            Si el nombre del archivo termina con un guion bajo (_), se le añade la etiqueta 'REPETIDO', lo que ayuda a 
            identificar archivos duplicados o con problemas de nomenclatura.
          </p>
          <div style={{marginTop: '12px', padding: '8px', backgroundColor: '#faf5ff', borderRadius: '4px'}}>
            <strong>Resultado:</strong>
            <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
              <li>Archivos correctos: "12345_Juan_Perez_OK.pdf"</li>
              <li>Archivos repetidos: "12345_Juan_Perez_REPETIDO.pdf"</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{margin: 0, color: '#6b7280', fontSize: '0.9rem'}}>
            💡 <strong>Tip:</strong> Ejecuta los procesos en orden: Entrada → Intermedio Excel → Intermedio PDFs → Final para obtener los mejores resultados.
          </p>
        </div>
      </div>
    </div>
  )
}