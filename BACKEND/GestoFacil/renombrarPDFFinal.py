import os, re, shutil, sys, json

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

def extraer_numero_ficha(nombre_carpeta):
    
    match = re.match(r'^(\d+)', nombre_carpeta)
    if match:
        return match.group(1)
    return None


total = 0
renombrados = 0
repetidos = 0
errores = []
archivos_procesados = []
carpetas_eliminadas = 0

patron_repetido = re.compile(r'_')

print(f"Iniciando procesamiento en: {ruta_raiz}", file=sys.stderr)

try:
    todos_pdfs = []
    for carpeta, _, archivos in os.walk(ruta_raiz):
        for archivo in archivos:
            if archivo.lower().endswith(".pdf"):
                todos_pdfs.append((carpeta, archivo))
    
    total = len(todos_pdfs)
    print(f"Encontrados {total} archivos PDF para procesar...", file=sys.stderr)
    
    for i, (carpeta, archivo) in enumerate(todos_pdfs, 1):
        if i % 100 == 0:  
            print(f"Procesados {i}/{total} archivos...", file=sys.stderr)
            
        ruta_archivo = os.path.join(carpeta, archivo)
        nombre_carpeta = os.path.basename(carpeta)
        
        ficha = extraer_numero_ficha(nombre_carpeta)
        
        if not ficha:
            errores.append({
                "archivo": archivo,
                "error": f"No se pudo extraer número de ficha de la carpeta: {nombre_carpeta}"
            })
            continue
        
        nombre_archivo = os.path.splitext(archivo)[0].strip()
        
        if nombre_archivo.startswith(ficha):
            nombre_archivo = nombre_archivo[len(ficha):].strip()
        
        if patron_repetido.search(nombre_archivo):
            nuevo_nombre = f"{ficha} {nombre_archivo} REPETIDO.pdf"
            tipo_proceso = "REPETIDO"
            repetidos += 1
        else:
            nuevo_nombre = f"{ficha} {nombre_archivo}_OK.pdf"
            tipo_proceso = "OK"
            renombrados += 1
        
        ruta_destino = os.path.join(ruta_raiz, nuevo_nombre)
        
        contador = 1
        nombre_final = nuevo_nombre
        base_nombre, extension = os.path.splitext(nuevo_nombre)
        
        while os.path.exists(ruta_destino):
            nombre_final = f"{base_nombre}_{contador}{extension}"
            ruta_destino = os.path.join(ruta_raiz, nombre_final)
            contador += 1
        
        try:
            shutil.move(ruta_archivo, ruta_destino)
            archivos_procesados.append({
                "nombre_original": archivo,
                "nombre_final": nombre_final,
                "ficha": ficha,
                "carpeta_original": nombre_carpeta,
                "tipo": tipo_proceso,
                "fue_renumerado": contador > 1
            })
        except Exception as e:
            errores.append({
                "archivo": archivo,
                "error": f"Error al mover: {e}"
            })

except Exception as e:
    resultado = {
        "success": False,
        "error": f"Error durante el procesamiento: {str(e)}",
        "estadisticas": {
            "total_pdfs": total,
            "renombrados_ok": renombrados,
            "marcados_repetidos": repetidos,
            "errores": len(errores),
            "carpetas_eliminadas": carpetas_eliminadas
        },
        "archivos_procesados_hasta_error": i if 'i' in locals() else 0
    }
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    exit(1)

try:
    carpetas_a_eliminar = []
    for carpeta_actual in os.listdir(ruta_raiz):
        ruta_carpeta = os.path.join(ruta_raiz, carpeta_actual)
        if os.path.isdir(ruta_carpeta):
            try:
                if not os.listdir(ruta_carpeta):
                    os.rmdir(ruta_carpeta)
                    carpetas_eliminadas += 1
                    carpetas_a_eliminar.append(carpeta_actual)
            except OSError:
                pass 
    
    if carpetas_a_eliminar:
        print(f"Eliminadas {len(carpetas_a_eliminar)} carpetas vacías", file=sys.stderr)

except Exception as e:
    print(f"Advertencia al eliminar carpetas: {e}", file=sys.stderr)

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