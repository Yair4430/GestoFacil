import os, glob, re, json, tempfile, time, sys
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
from pathlib import Path

# Verifica si el nombre del archivo sigue el formato: número + nombre instructor
def tiene_formato_instructor(nombre_archivo):
    patron = r'^\d{6,} [A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ\s\.]+\.pdf$'
    return re.match(patron, nombre_archivo, re.IGNORECASE) is not None

# Detecta si el PDF es un certificado de cédula basado en patrones de texto
def es_certificado_cedula(archivo_path):
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            if len(reader.pages) == 0:
                return False
            
            texto_pagina1 = reader.pages[0].extract_text().lower()
            
            patrones_cedula = [
                'registraduría nacional del estado civil',
                'cédula de ciudadanía',
                'servicio de información ciudadana',
                'edison quiñones silva',
                'coordinador grupo servicio'
            ]
            
            coincidencias = sum(1 for patron in patrones_cedula if patron in texto_pagina1)
            return coincidencias >= 3
            
    except:
        return False

# Determina si la segunda página del PDF debe ser eliminada (páginas vacías o de numeración)
def necesita_eliminar_segunda_pagina(archivo_path):
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            
            if len(reader.pages) < 2:
                return False
            
            if not es_certificado_cedula(archivo_path):
                return False
            
            texto_pagina2 = reader.pages[1].extract_text().lower()
            texto_limpiado = texto_pagina2.replace("página", "").replace("pagina", "").replace("de", "").replace(" ", "").strip()
            
            return (not texto_pagina2.strip() or 
                    texto_pagina2.strip() in ["pagina 1 de 1", "página 1 de 1", "1 de 1"] or
                    texto_limpiado.isdigit() or
                    len(texto_limpiado) <= 3)
                
    except Exception as e:
        print(f"    ❌ Error al verificar segunda página {os.path.basename(archivo_path)}: {e}")
        return False

# Elimina la segunda página de PDFs de cédula que tienen páginas vacías
def procesar_pdf_eliminar_segunda_pagina(archivo_path):
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            
            if len(reader.pages) < 2:
                return archivo_path
            
            writer = PdfWriter()
            writer.add_page(reader.pages[0])
            
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            with open(temp_file.name, 'wb') as temp_output:
                writer.write(temp_output)
            
            return temp_file.name
                
    except Exception as e:
        print(f"    ❌ Error al procesar {os.path.basename(archivo_path)}: {e}")
        return archivo_path

# Valida que un archivo PDF sea legible y tenga páginas
def es_pdf_valido(archivo_path):
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            return len(reader.pages) > 0
    except:
        return False

# Ordena archivos: primero los de instructor, luego los normales
def ordenar_archivos_pdf(archivos_pdf):
    archivos_instructor = []
    archivos_normales = []
    
    for archivo in archivos_pdf:
        nombre_archivo = os.path.basename(archivo)
        if tiene_formato_instructor(nombre_archivo):
            archivos_instructor.append(archivo)
        else:
            archivos_normales.append(archivo)
    
    archivos_instructor.sort()
    archivos_normales.sort()
    
    return archivos_instructor + archivos_normales

# Encuentra el PDF principal (con formato de instructor) para nombrar el archivo final
def obtener_pdf_principal(carpeta):
    patron_pdf = os.path.join(carpeta, "*.pdf")
    archivos_pdf = glob.glob(patron_pdf)
    
    for archivo in archivos_pdf:
        nombre_archivo = os.path.basename(archivo)
        if tiene_formato_instructor(nombre_archivo):
            return archivo
    return None

# Elimina archivos PDF originales después de la unión, manteniendo solo el resultado final
def limpiar_archivos_originales(carpeta, archivos_a_mantener):
    try:
        patron_pdf = os.path.join(carpeta, "*.pdf")
        archivos_pdf = glob.glob(patron_pdf)
        
        eliminados = 0
        errores = 0
        
        for archivo in archivos_pdf:
            if archivo not in archivos_a_mantener:
                try:
                    import gc
                    gc.collect()
                    
                    for intento in range(3):
                        try:
                            os.remove(archivo)
                            eliminados += 1
                            break
                        except PermissionError:
                            if intento < 2:
                                time.sleep(0.1)
                            else:
                                raise
                except Exception as e:
                    errores += 1
        
        return eliminados, errores
        
    except Exception as e:
        return 0, 1

# Función principal: une todos los PDFs de una carpeta en un solo archivo
def unir_pdfs_en_carpeta(carpeta):
    archivos_temporales = []
    resultados = {
        'carpeta': os.path.basename(carpeta),
        'archivos_procesados': 0,
        'total_paginas': 0,
        'archivo_final': '',
        'errores': []
    }
    
    try:
        pdf_principal = obtener_pdf_principal(carpeta)
        if pdf_principal:
            nombre_principal = os.path.basename(pdf_principal)
            archivo_final = os.path.join(carpeta, f"{nombre_principal}")
        else:
            nombre_carpeta = os.path.basename(carpeta)
            archivo_final = os.path.join(carpeta, f"{nombre_carpeta}.pdf")
        
        resultados['archivo_final'] = archivo_final
        
        patron_pdf = os.path.join(carpeta, "*.pdf")
        archivos_pdf = glob.glob(patron_pdf)
        archivos_pdf = [f for f in archivos_pdf if os.path.isfile(f)]
        
        if not archivos_pdf:
            resultados['errores'].append("No se encontraron archivos PDF")
            return resultados
        
        archivos_pdf_validos = [f for f in archivos_pdf if es_pdf_valido(f)]
        
        if not archivos_pdf_validos:
            resultados['errores'].append("No se encontraron archivos PDF válidos")
            return resultados
        
        archivos_procesados = []
        for archivo in archivos_pdf_validos:
            if necesita_eliminar_segunda_pagina(archivo):
                archivo_procesado = procesar_pdf_eliminar_segunda_pagina(archivo)
                if archivo_procesado != archivo:
                    archivos_temporales.append(archivo_procesado)
                archivos_procesados.append(archivo_procesado)
            else:
                archivos_procesados.append(archivo)
        
        archivos_ordenados = ordenar_archivos_pdf(archivos_procesados)
        
        merger = PdfMerger()
        archivos_procesados_count = 0
        total_paginas = 0
        
        for archivo_pdf in archivos_ordenados:
            try:
                with open(archivo_pdf, 'rb') as f:
                    reader = PdfReader(f)
                    paginas = len(reader.pages)
                
                if paginas > 0:
                    merger.append(archivo_pdf)
                    total_paginas += paginas
                    archivos_procesados_count += 1
                    
            except Exception as e:
                resultados['errores'].append(f"Error al procesar {os.path.basename(archivo_pdf)}: {str(e)}")
        
        if archivos_procesados_count == 0:
            resultados['errores'].append("No se pudieron procesar archivos PDF válidos")
            return resultados
        
        archivo_unido_temporal = os.path.join(carpeta, f"temp_{os.getpid()}.pdf")
        
        with open(archivo_unido_temporal, 'wb') as salida:
            merger.write(salida)
        
        merger.close()
        
        if os.path.getsize(archivo_unido_temporal) > 0:
            import gc
            gc.collect()
            time.sleep(0.1)
            
            limpiar_archivos_originales(carpeta, [archivo_unido_temporal])
            
            if os.path.exists(archivo_final):
                try:
                    os.remove(archivo_final)
                except:
                    pass
            
            os.rename(archivo_unido_temporal, archivo_final)
            
            resultados['archivos_procesados'] = archivos_procesados_count
            resultados['total_paginas'] = total_paginas
            
        else:
            resultados['errores'].append("El archivo unido está vacío")
            if os.path.exists(archivo_unido_temporal):
                os.remove(archivo_unido_temporal)
        
        for temp_file in archivos_temporales:
            try:
                os.unlink(temp_file)
            except:
                pass
        
    except Exception as e:
        resultados['errores'].append(f"Error al procesar la carpeta: {str(e)}")
        
        for temp_file in archivos_temporales:
            try:
                os.unlink(temp_file)
            except:
                pass
    
    return resultados

# Procesa todas las subcarpetas de una ruta principal uniendo sus PDFs
def unir_pdfs_en_carpetas(ruta_principal):
    resultados_totales = {
        'carpetas_procesadas': 0,
        'carpetas_con_errores': 0,
        'resultados_detallados': []
    }
    
    try:
        if not os.path.exists(ruta_principal):
            return {
                'error': f"La ruta '{ruta_principal}' no existe."
            }
        
        if not os.path.isdir(ruta_principal):
            return {
                'error': f"'{ruta_principal}' no es una carpeta válida."
            }
        
        subcarpetas = [f.path for f in os.scandir(ruta_principal) if f.is_dir()]
        
        if not subcarpetas:
            return {
                'error': "No se encontraron subcarpetas en la ruta especificada."
            }
        
        for subcarpeta in subcarpetas:
            resultado = unir_pdfs_en_carpeta(subcarpeta)
            resultados_totales['resultados_detallados'].append(resultado)
            
            if resultado['errores']:
                resultados_totales['carpetas_con_errores'] += 1
            else:
                resultados_totales['carpetas_procesadas'] += 1
        
        return resultados_totales
        
    except Exception as e:
        return {
            'error': f"Error inesperado: {str(e)}"
        }

# Punto de entrada principal - procesa carpeta desde argumento de línea de comandos
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Se requiere la ruta de la carpeta principal como parámetro"}))
        sys.exit(1)
    
    ruta_principal = sys.argv[1]
    resultado = unir_pdfs_en_carpetas(ruta_principal)
    print(json.dumps(resultado))