import os
import re
import shutil
import sys
import json

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

patron_excel = re.compile(r'^plantilla_(\d+)\.(xlsx|xls|xlsm)$', re.IGNORECASE)

# Listas para almacenar resultados
archivos_movidos = []
archivos_omitidos = []
archivos_invalidos = []
total_archivos = 0

for archivo in os.listdir(carpeta_excels):
    if archivo.lower().endswith(('.xlsx', '.xls', '.xlsm')):
        total_archivos += 1
        match = patron_excel.match(archivo)
        
        if match:
            numero_ficha = match.group(1)
            extension = match.group(2)
            ruta_archivo = os.path.join(carpeta_excels, archivo)
            carpeta_destino = os.path.join(carpeta_fichas, numero_ficha)
            
            if os.path.isdir(carpeta_destino):
                nueva_ruta = os.path.join(carpeta_destino, archivo)
                shutil.move(ruta_archivo, nueva_ruta)
                archivos_movidos.append({
                    "nombre_archivo": archivo,
                    "ficha": numero_ficha,
                    "extension": extension,
                    "carpeta_destino": carpeta_destino
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