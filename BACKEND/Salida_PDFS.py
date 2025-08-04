import os
import re
import shutil
import sys
import json

# Obtener ruta desde argumentos o entrada
if len(sys.argv) < 2:
    ruta_raiz = input("Ingresa la ruta completa de la carpeta con PDFs: ").strip()
else:
    ruta_raiz = sys.argv[1]

if not os.path.isdir(ruta_raiz):
    resultado = {
        "success": False,
        "error": "Ruta inválida o no existe",
        "estadisticas": {
            "total_pdfs": 0,
            "renombrados_ok": 0,
            "marcados_repetidos": 0,
            "errores": 0,
            "carpetas_eliminadas": 0
        }
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    exit(1)

# Contadores y listas
total = 0
renombrados = 0
repetidos = 0
errores = []
archivos_procesados = []
carpetas_eliminadas = 0

# Recorrer todas las subcarpetas
for carpeta, _, archivos in os.walk(ruta_raiz):
    for archivo in archivos:
        if archivo.lower().endswith(".pdf"):
            total += 1
            ruta_archivo = os.path.join(carpeta, archivo)
            
            # Obtener nombre de carpeta (ficha)
            ficha = os.path.basename(carpeta)
            
            # Verifica que ficha sea un número
            if not ficha.isdigit():
                errores.append({
                    "archivo": archivo,
                    "error": f"Está en carpeta no válida: {ficha}"
                })
                continue
            
            # Extrae nombres y apellidos
            nombre_archivo = os.path.splitext(archivo)[0].strip()
            
            # Elimina ficha duplicada al inicio si existe
            if nombre_archivo.startswith(ficha):
                nombre_archivo = nombre_archivo[len(ficha):].strip()
            
            # Si ya contiene "_", es repetido
            if "_" in nombre_archivo:
                nuevo_nombre = f"{ficha} {nombre_archivo} REPETIDO.pdf"
                tipo_proceso = "REPETIDO"
                repetidos += 1
            else:
                nuevo_nombre = f"{ficha} {nombre_archivo}_OK.pdf"
                tipo_proceso = "OK"
                renombrados += 1
            
            # Ruta final
            ruta_destino = os.path.join(ruta_raiz, nuevo_nombre)
            
            # Si ya existe, añade sufijo único
            contador = 1
            nombre_final = nuevo_nombre
            while os.path.exists(ruta_destino):
                nombre_final = f"{os.path.splitext(nuevo_nombre)[0]}_{contador}.pdf"
                ruta_destino = os.path.join(ruta_raiz, nombre_final)
                contador += 1
            
            try:
                shutil.move(ruta_archivo, ruta_destino)
                archivos_procesados.append({
                    "nombre_original": archivo,
                    "nombre_final": nombre_final,
                    "ficha": ficha,
                    "tipo": tipo_proceso,
                    "fue_renumerado": contador > 1
                })
            except Exception as e:
                errores.append({
                    "archivo": archivo,
                    "error": f"Error al mover: {e}"
                })

# Eliminar carpetas vacías (excepto la raíz)
for carpeta_actual in sorted(os.listdir(ruta_raiz), reverse=True):
    ruta_carpeta = os.path.join(ruta_raiz, carpeta_actual)
    if os.path.isdir(ruta_carpeta):
        try:
            os.rmdir(ruta_carpeta)
            carpetas_eliminadas += 1
        except OSError:
            pass  # No está vacía

# ✅ Retornar resultado estructurado
resultado = {
    "success": True,
    "mensaje": "Proceso de salida completado exitosamente",
    "estadisticas": {
        "total_pdfs": total,
        "renombrados_ok": renombrados,
        "marcados_repetidos": repetidos,
        "errores": len(errores),
        "carpetas_eliminadas": carpetas_eliminadas
    },
    "archivos_procesados": archivos_procesados,
    "errores": errores
}

print(json.dumps(resultado, ensure_ascii=False, indent=2))