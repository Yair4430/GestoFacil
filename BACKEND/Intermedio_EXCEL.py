import os
import re
import shutil
import sys
import json
import time

if len(sys.argv) < 3:
    resultado = {
        "success": False,
        "error": "Faltan argumentos. Debes pasar la carpeta de excels y la de fichas.",
        "estadisticas": {
            "total_archivos": 0,
            "archivos_movidos": 0,
            "archivos_omitidos": 0,
            "archivos_invalidos": 0
        }
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    exit()

carpeta_excels = sys.argv[1]
carpeta_fichas = sys.argv[2]

if not os.path.isdir(carpeta_excels) or not os.path.isdir(carpeta_fichas):
    resultado = {
        "success": False,
        "error": "Una de las rutas no es válida.",
        "estadisticas": {
            "total_archivos": 0,
            "archivos_movidos": 0,
            "archivos_omitidos": 0,
            "archivos_invalidos": 0
        }
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    exit()

# Regex precompilada para mejor rendimiento
patron_excel = re.compile(r'^plantilla_(\d+)\.(xlsx|xls|xlsm)$', re.IGNORECASE)

# Listas para almacenar resultados
archivos_movidos = []
archivos_omitidos = []
archivos_invalidos = []

# Obtener todos los archivos Excel de una sola vez (más eficiente)
try:
    archivos_excel = [f for f in os.listdir(carpeta_excels) 
                     if f.lower().endswith(('.xlsx', '.xls', '.xlsm'))]
    
    total_archivos = len(archivos_excel)
    
    print(f"Iniciando procesamiento de {total_archivos} archivos Excel...", file=sys.stderr)
    
    # Pre-cache de carpetas existentes para evitar múltiples verificaciones
    carpetas_existentes = set()
    for item in os.listdir(carpeta_fichas):
        if os.path.isdir(os.path.join(carpeta_fichas, item)):
            carpetas_existentes.add(item)
    
    for i, archivo in enumerate(archivos_excel, 1):
        if i % 100 == 0:  # Log cada 100 archivos
            print(f"Procesados {i}/{total_archivos} archivos Excel...", file=sys.stderr)
            
        match = patron_excel.match(archivo)
        
        if match:
            numero_ficha = match.group(1)
            extension = match.group(2)
            ruta_archivo = os.path.join(carpeta_excels, archivo)
            
            # Verificar si la carpeta destino existe (usando cache)
            if numero_ficha in carpetas_existentes:
                carpeta_destino = os.path.join(carpeta_fichas, numero_ficha)
                nueva_ruta = os.path.join(carpeta_destino, archivo)
                
                try:
                    # Verificar si ya existe un archivo con el mismo nombre
                    if os.path.exists(nueva_ruta):
                        base_name = os.path.splitext(archivo)[0]
                        counter = 1
                        while os.path.exists(nueva_ruta):
                            nuevo_nombre = f"{base_name}_{counter}.{extension}"
                            nueva_ruta = os.path.join(carpeta_destino, nuevo_nombre)
                            counter += 1
                        archivo_final = os.path.basename(nueva_ruta)
                    else:
                        archivo_final = archivo
                    
                    shutil.move(ruta_archivo, nueva_ruta)
                    
                    archivos_movidos.append({
                        "nombre_archivo": archivo,
                        "nombre_final": archivo_final,
                        "ficha": numero_ficha,
                        "extension": extension,
                        "carpeta_destino": carpeta_destino
                    })
                    
                except Exception as e:
                    print(f"Error moviendo archivo {archivo}: {e}", file=sys.stderr)
                    archivos_omitidos.append({
                        "nombre_archivo": archivo,
                        "ficha": numero_ficha,
                        "razon": f"Error al mover: {str(e)}"
                    })
            else:
                archivos_omitidos.append({
                    "nombre_archivo": archivo,
                    "ficha": numero_ficha,
                    "razon": f"Carpeta {numero_ficha} no existe"
                })
        else:
            archivos_invalidos.append({
                "nombre_archivo": archivo,
                "razon": "No coincide con patrón plantilla_<ficha>"
            })

except Exception as e:
    resultado = {
        "success": False,
        "error": f"Error durante el procesamiento: {str(e)}",
        "estadisticas": {
            "total_archivos": total_archivos,
            "archivos_movidos": len(archivos_movidos),
            "archivos_omitidos": len(archivos_omitidos),
            "archivos_invalidos": len(archivos_invalidos)
        },
        "archivos_procesados_hasta_error": i if 'i' in locals() else 0
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    exit()

# ✅ Retornar resultado estructurado
resultado = {
    "success": True,
    "mensaje": "Proceso intermedio completado exitosamente",
    "estadisticas": {
        "total_archivos": total_archivos,
        "archivos_movidos": len(archivos_movidos),
        "archivos_omitidos": len(archivos_omitidos),
        "archivos_invalidos": len(archivos_invalidos)
    },
    "archivos_movidos": archivos_movidos,
    "archivos_omitidos": archivos_omitidos,
    "archivos_invalidos": archivos_invalidos
}

print(json.dumps(resultado, ensure_ascii=False, indent=2))