import os, re, shutil, sys, json

# Validación inicial de argumentos de línea de comandos
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

# Verifica que las rutas proporcionadas sean carpetas válidas
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

# Patrón para detectar archivos Excel con formato plantilla_<número_ficha>
patron_excel = re.compile(r'^plantilla_(\d+)\.(xlsx|xls|xlsm)$', re.IGNORECASE)

archivos_movidos = []
archivos_omitidos = []
archivos_invalidos = []

try:
    # Obtiene lista de todos los archivos Excel en la carpeta origen
    archivos_excel = [f for f in os.listdir(carpeta_excels) 
                     if f.lower().endswith(('.xlsx', '.xls', '.xlsm'))]
    
    total_archivos = len(archivos_excel)
    
    print(f"Iniciando procesamiento de {total_archivos} archivos Excel...", file=sys.stderr)
    
    # Identifica carpetas existentes en destino para emparejar por número de ficha
    carpetas_existentes = set()
    for item in os.listdir(carpeta_fichas):
        if os.path.isdir(os.path.join(carpeta_fichas, item)):
            carpetas_existentes.add(item)
    
    # Procesa cada archivo Excel encontrado
    for i, archivo in enumerate(archivos_excel, 1):
        if i % 100 == 0:  # Log cada 100 archivos
            print(f"Procesados {i}/{total_archivos} archivos Excel...", file=sys.stderr)
            
        match = patron_excel.match(archivo)
        
        if match:
            numero_ficha = match.group(1)
            extension = match.group(2)
            ruta_archivo = os.path.join(carpeta_excels, archivo)
            
            # Mueve archivo solo si existe carpeta con número de ficha correspondiente
            if numero_ficha in carpetas_existentes:
                carpeta_destino = os.path.join(carpeta_fichas, numero_ficha)
                nueva_ruta = os.path.join(carpeta_destino, archivo)
                
                try:
                    # Maneja archivos duplicados agregando sufijo numérico
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

# Manejo de errores generales durante el procesamiento
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

# Resultado final del proceso con estadísticas detalladas
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