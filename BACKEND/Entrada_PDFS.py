import os
import re
import shutil
import sys
import json
import time

# ✅ Solicita la ruta si no se proporciona como argumento
if len(sys.argv) < 2:
    ruta_origen = input("Ingresa la ruta completa de la carpeta con PDFs: ").strip()
else:
    ruta_origen = sys.argv[1]

# Validar existencia de la carpeta
if not os.path.isdir(ruta_origen):
    resultado = {
        "success": False,
        "error": "Ruta inválida o no existe",
        "archivos_procesados": 0,
        "archivos_movidos": [],
        "archivos_invalidos": []
    }
    print(json.dumps(resultado))
    exit()

# Regex optimizada para validar nombres como "12345 NOMBRE APELLIDO.pdf"
patron_valido = re.compile(
    r'^(\d+)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)+)[ _]?\.pdf$', 
    re.IGNORECASE)

# Listas para almacenar resultados
archivos_movidos = []
archivos_invalidos = []
total_archivos = 0
carpetas_creadas = set()

# Obtener todos los PDFs de una sola vez (más eficiente)
try:
    todos_archivos = [f for f in os.listdir(ruta_origen) if f.lower().endswith('.pdf')]
    total_archivos = len(todos_archivos)
    
    print(f"Iniciando procesamiento de {total_archivos} archivos...", file=sys.stderr)
    
    for i, archivo in enumerate(todos_archivos, 1):
        if i % 100 == 0:  # Log cada 100 archivos
            print(f"Procesados {i}/{total_archivos} archivos...", file=sys.stderr)
            
        ruta_archivo = os.path.join(ruta_origen, archivo)
        match = patron_valido.match(archivo)
        
        if match:
            numero_ficha = match.group(1)
            nombre_instructor = match.group(2)
            carpeta_destino = os.path.join(ruta_origen, numero_ficha)
            
            # Crear carpeta solo si no existe
            if numero_ficha not in carpetas_creadas:
                os.makedirs(carpeta_destino, exist_ok=True)
                carpetas_creadas.add(numero_ficha)
            
            destino = os.path.join(carpeta_destino, archivo)
            
            nombre_base, extension = os.path.splitext(archivo)
            contador = 1
            nombre_final = archivo
            fue_renombrado = False
            
            # Verificar si el archivo ya existe en destino
            if os.path.exists(destino):
                while os.path.exists(destino):
                    nombre_final = f"{nombre_base} ({contador}){extension}"
                    destino = os.path.join(carpeta_destino, nombre_final)
                    contador += 1
                    fue_renombrado = True
            
            try:
                shutil.move(ruta_archivo, destino)
                
                archivos_movidos.append({
                    "nombre_original": archivo,
                    "nombre_final": nombre_final,
                    "ficha": numero_ficha,
                    "instructor": nombre_instructor,
                    "fue_renombrado": fue_renombrado
                })
                
            except Exception as e:
                print(f"Error moviendo archivo {archivo}: {e}", file=sys.stderr)
                archivos_invalidos.append(archivo)
        else:
            archivos_invalidos.append(archivo)

except Exception as e:
    resultado = {
        "success": False,
        "error": f"Error durante el procesamiento: {str(e)}",
        "archivos_procesados": total_archivos,
        "archivos_movidos": len(archivos_movidos),
        "archivos_invalidos": len(archivos_invalidos)
    }
    print(json.dumps(resultado))
    exit()

# ✅ Retornar resultado estructurado
resultado = {
    "success": True,
    "mensaje": f"Proceso completado exitosamente",
    "estadisticas": {
        "total_archivos": total_archivos,
        "archivos_movidos": len(archivos_movidos),
        "archivos_invalidos": len(archivos_invalidos),
        "carpetas_creadas": len(carpetas_creadas)
    },
    "archivos_movidos": archivos_movidos,
    "archivos_invalidos": archivos_invalidos
}

print(json.dumps(resultado, ensure_ascii=False, indent=2))