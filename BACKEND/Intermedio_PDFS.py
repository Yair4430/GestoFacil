import os
import glob
import re
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
from pathlib import Path
import tempfile
import time

def unir_pdfs_en_carpetas():
    """
    Función principal que une archivos PDFs en cada subcarpeta de una carpeta principal
    """
    try:
        # Solicitar la ruta de la carpeta principal
        ruta_principal = input("Por favor, ingresa la ruta de la carpeta principal: ").strip()
        
        # Verificar si la ruta existe
        if not os.path.exists(ruta_principal):
            print(f"Error: La ruta '{ruta_principal}' no existe.")
            return
        
        # Verificar si es una carpeta
        if not os.path.isdir(ruta_principal):
            print(f"Error: '{ruta_principal}' no es una carpeta válida.")
            return
        
        # Obtener todas las subcarpetas
        subcarpetas = [f.path for f in os.scandir(ruta_principal) if f.is_dir()]
        
        if not subcarpetas:
            print("No se encontraron subcarpetas en la ruta especificada.")
            return
        
        print(f"\nSe encontraron {len(subcarpetas)} subcarpetas:")
        for i, carpeta in enumerate(subcarpetas, 1):
            print(f"{i}. {os.path.basename(carpeta)}")
        
        # Procesar cada subcarpeta
        for subcarpeta in subcarpetas:
            print(f"\n{'='*50}")
            print(f"Procesando carpeta: {os.path.basename(subcarpeta)}")
            print(f"{'='*50}")
            unir_pdfs_en_carpeta(subcarpeta)
        
        print("\n¡Proceso completado!")
        
    except KeyboardInterrupt:
        print("\nProceso interrumpido por el usuario.")
    except Exception as e:
        print(f"Error inesperado: {e}")

def tiene_formato_instructor(nombre_archivo):
    """
    Verifica si el nombre del archivo tiene el formato de instructor:
    NUMERO DE FICHA + NOMBRES Y APELLIDOS DE INSTRUCTOR
    Ejemplo: '3283019 LAURA DANIELA TOQUICA LA ROTTA.pdf'
    """
    # Patrón más flexible: número (mínimo 6 dígitos) + espacio + texto + .pdf
    patron = r'^\d{6,} [A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ\s\.]+\.pdf$'
    return re.match(patron, nombre_archivo, re.IGNORECASE) is not None

def es_certificado_cedula(archivo_path):
    """
    Verifica si el PDF es un certificado de cédula de la Registraduría
    basándose en patrones específicos del contenido
    """
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            if len(reader.pages) == 0:
                return False
            
            # Leer texto de la primera página
            texto_pagina1 = reader.pages[0].extract_text().lower()
            
            # Patrones que identifican certificados de cédula
            patrones_cedula = [
                'registraduría nacional del estado civil',
                'cédula de ciudadanía',
                'servicio de información ciudadana',
                'edison quiñones silva',
                'coordinador grupo servicio'
            ]
            
            # Verificar si contiene al menos 3 de los patrones
            coincidencias = sum(1 for patron in patrones_cedula if patron in texto_pagina1)
            return coincidencias >= 3
            
    except:
        return False

def necesita_eliminar_segunda_pagina(archivo_path):
    """
    Verifica si el PDF necesita que se elimine la segunda página
    (certificados de cédula con página adicional en blanco)
    """
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            
            # Si tiene menos de 2 páginas, no necesita procesamiento
            if len(reader.pages) < 2:
                return False
            
            # Verificar si es un certificado de cédula
            if not es_certificado_cedula(archivo_path):
                return False
            
            # Extraer texto de la segunda página
            texto_pagina2 = reader.pages[1].extract_text().lower()
            
            # Verificar si la segunda página está en blanco o tiene solo números de página
            texto_limpiado = texto_pagina2.replace("página", "").replace("pagina", "").replace("de", "").replace(" ", "").strip()
            
            # La segunda página debe estar básicamente vacía o contener solo "pagina 1 de 1"
            return (not texto_pagina2.strip() or 
                    texto_pagina2.strip() in ["pagina 1 de 1", "página 1 de 1", "1 de 1"] or
                    texto_limpiado.isdigit() or
                    len(texto_limpiado) <= 3)
                
    except Exception as e:
        print(f"    ❌ Error al verificar segunda página {os.path.basename(archivo_path)}: {e}")
        return False

def procesar_pdf_eliminar_segunda_pagina(archivo_path):
    """
    Procesa archivos eliminando la segunda página si es necesario
    """
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            
            # Si tiene menos de 2 páginas, no necesita procesamiento
            if len(reader.pages) < 2:
                return archivo_path
            
            # Crear nuevo PDF solo con la primera página
            writer = PdfWriter()
            writer.add_page(reader.pages[0])
            
            # Crear archivo temporal
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            with open(temp_file.name, 'wb') as temp_output:
                writer.write(temp_output)
            
            return temp_file.name
                
    except Exception as e:
        print(f"    ❌ Error al procesar {os.path.basename(archivo_path)}: {e}")
        return archivo_path

def es_pdf_valido(archivo_path):
    """
    Verifica si un archivo PDF es válido y puede leerse
    """
    try:
        with open(archivo_path, 'rb') as f:
            reader = PdfReader(f)
            if len(reader.pages) > 0:
                return True
            else:
                print(f"    ⚠️  Advertencia: {os.path.basename(archivo_path)} tiene 0 páginas")
                return False
    except Exception as e:
        print(f"    ❌ Error al verificar {os.path.basename(archivo_path)}: {e}")
        return False

def ordenar_archivos_pdf(archivos_pdf):
    """
    Ordena los archivos PDF: primero el que tiene formato de instructor,
    luego los demás en orden alfabético
    """
    # Separar archivos con formato de instructor y los demás
    archivos_instructor = []
    archivos_normales = []
    
    for archivo in archivos_pdf:
        nombre_archivo = os.path.basename(archivo)
        if tiene_formato_instructor(nombre_archivo):
            archivos_instructor.append(archivo)
        else:
            archivos_normales.append(archivo)
    
    # Ordenar alfabéticamente ambos grupos
    archivos_instructor.sort()
    archivos_normales.sort()
    
    # Combinar: primero los de instructor, luego los normales
    return archivos_instructor + archivos_normales

def obtener_pdf_principal(carpeta):
    """
    Encuentra el PDF principal (el que tiene formato de instructor)
    """
    patron_pdf = os.path.join(carpeta, "*.pdf")
    archivos_pdf = glob.glob(patron_pdf)
    
    for archivo in archivos_pdf:
        nombre_archivo = os.path.basename(archivo)
        if tiene_formato_instructor(nombre_archivo):
            return archivo
    return None

def limpiar_archivos_originales(carpeta, archivos_a_mantener):
    """
    Elimina todos los PDFs originales excepto los archivos especificados
    """
    try:
        patron_pdf = os.path.join(carpeta, "*.pdf")
        archivos_pdf = glob.glob(patron_pdf)
        
        eliminados = 0
        errores = 0
        
        for archivo in archivos_pdf:
            # No eliminar los archivos que deben mantenerse
            if archivo not in archivos_a_mantener:
                try:
                    # Cerrar cualquier handle abierto forzando garbage collection
                    import gc
                    gc.collect()
                    
                    # Intentar eliminar con múltiples intentos
                    for intento in range(3):
                        try:
                            os.remove(archivo)
                            eliminados += 1
                            print(f"    🗑️  Eliminado: {os.path.basename(archivo)}")
                            break
                        except PermissionError:
                            if intento < 2:
                                time.sleep(0.1)  # Pequeña pausa antes de reintentar
                            else:
                                raise
                except Exception as e:
                    print(f"    ❌ Error al eliminar {os.path.basename(archivo)}: {e}")
                    errores += 1
        
        print(f"    ✅ Total de archivos eliminados: {eliminados}")
        if errores > 0:
            print(f"    ⚠️  Archivos con errores al eliminar: {errores}")
        
    except Exception as e:
        print(f"    ❌ Error en limpieza de archivos: {e}")

def unir_pdfs_en_carpeta(carpeta):
    """
    Une todos los archivos PDFs en una carpeta específica
    """
    archivos_temporales = []  # Para trackear archivos temporales y limpiarlos después
    archivos_procesados_objects = []  # Para mantener referencia a los objetos de PDF
    
    try:
        # Obtener el PDF principal para usar su nombre
        pdf_principal = obtener_pdf_principal(carpeta)
        if pdf_principal:
            nombre_principal = os.path.basename(pdf_principal)
            nombre_sin_extension = os.path.splitext(nombre_principal)[0]
            archivo_final = os.path.join(carpeta, f"{nombre_principal}")  # Mismo nombre que el principal
        else:
            nombre_carpeta = os.path.basename(carpeta)
            archivo_final = os.path.join(carpeta, f"{nombre_carpeta}.pdf")
            nombre_sin_extension = nombre_carpeta
        
        # Buscar archivos PDF en la carpeta
        patron_pdf = os.path.join(carpeta, "*.pdf")
        archivos_pdf = glob.glob(patron_pdf)
        
        # Filtrar solo archivos (no directorios)
        archivos_pdf = [f for f in archivos_pdf if os.path.isfile(f)]
        
        if not archivos_pdf:
            print(f"  No se encontraron archivos PDF en '{os.path.basename(carpeta)}'")
            return
        
        # Filtrar solo PDFs válidos
        archivos_pdf_validos = [f for f in archivos_pdf if es_pdf_valido(f)]
        
        if not archivos_pdf_validos:
            print(f"  No se encontraron archivos PDF válidos en '{os.path.basename(carpeta)}'")
            return
        
        # Procesar archivos que necesitan eliminar segunda página
        archivos_procesados = []
        for archivo in archivos_pdf_validos:
            if necesita_eliminar_segunda_pagina(archivo):
                print(f"    🔍 Detectado certificado de cédula: {os.path.basename(archivo)}")
                archivo_procesado = procesar_pdf_eliminar_segunda_pagina(archivo)
                if archivo_procesado != archivo:
                    archivos_temporales.append(archivo_procesado)  # Trackear archivo temporal
                    print(f"    ✅ Segunda página eliminada: {os.path.basename(archivo)}")
                archivos_procesados.append(archivo_procesado)
            else:
                archivos_procesados.append(archivo)
        
        # Ordenar archivos: primero el de instructor, luego los demás
        archivos_ordenados = ordenar_archivos_pdf(archivos_procesados)
        
        print(f"  📄 Encontrados {len(archivos_ordenados)} archivos PDF válidos:")
        for i, archivo in enumerate(archivos_ordenados, 1):
            nombre_original = os.path.basename(archivos_pdf_validos[i-1]) if i <= len(archivos_pdf_validos) else os.path.basename(archivo)
            es_cedula = es_certificado_cedula(archivos_pdf_validos[i-1]) if i <= len(archivos_pdf_validos) else False
            
            # Mostrar número de páginas de cada PDF
            try:
                with open(archivo, 'rb') as f:
                    reader = PdfReader(f)
                    paginas = len(reader.pages)
                    indicador = "📋 " if tiene_formato_instructor(nombre_original) else "  "
                    cedula_info = " 🆔" if es_cedula else ""
                    print(f"    {i:2d}. {indicador}{nombre_original}{cedula_info} ({paginas} páginas)")
            except:
                print(f"    {i:2d}. {indicador}{nombre_original} (error al leer páginas)")
        
        # Crear el merger y agregar archivos en el orden especificado
        merger = PdfMerger()
        archivos_procesados_count = 0
        total_paginas = 0
        
        for archivo_pdf in archivos_ordenados:
            try:
                nombre_original = next((os.path.basename(f) for f in archivos_pdf_validos if f in archivo_pdf or archivo_pdf in archivos_temporales), os.path.basename(archivo_pdf))
                
                # Verificar número de páginas antes de agregar
                with open(archivo_pdf, 'rb') as f:
                    reader = PdfReader(f)
                    paginas = len(reader.pages)
                
                if paginas > 0:
                    merger.append(archivo_pdf)
                    total_paginas += paginas
                    archivos_procesados_count += 1
                    
                    es_instructor = tiene_formato_instructor(nombre_original)
                    es_cedula = es_certificado_cedula(archivo_pdf) if archivo_pdf in archivos_pdf_validos else False
                    
                    if es_instructor:
                        print(f"    ✅ 📋 {nombre_original} agregado ({paginas} páginas) - PRIMERO")
                    elif es_cedula:
                        print(f"    ✅ 🆔 {nombre_original} agregado ({paginas} páginas) - Certificado procesado")
                    else:
                        print(f"    ✅ {nombre_original} agregado ({paginas} páginas)")
                else:
                    print(f"    ⚠️  Saltando {nombre_original} (0 páginas)")
                    
            except Exception as e:
                print(f"    ❌ Error al procesar {os.path.basename(archivo_pdf)}: {e}")
        
        if archivos_procesados_count == 0:
            print("  ❌ No se pudieron procesar archivos PDF válidos")
            return
        
        # Guardar el archivo unido temporalmente con un nombre único
        archivo_unido_temporal = os.path.join(carpeta, f"{nombre_sin_extension}_temp_{os.getpid()}.pdf")
        try:
            with open(archivo_unido_temporal, 'wb') as salida:
                merger.write(salida)
            
            # Cerrar el merger explícitamente
            merger.close()
            
            # Verificar que el archivo resultante no esté vacío
            if os.path.getsize(archivo_unido_temporal) > 0:
                print(f"  ✅ Archivo unido creado temporalmente")
                
                # Forzar garbage collection para liberar handles
                import gc
                gc.collect()
                time.sleep(0.1)  # Pequeña pausa
                
                # Eliminar archivos originales (manteniendo el temporal)
                print(f"\n  🧹 Limpiando archivos originales...")
                limpiar_archivos_originales(carpeta, [archivo_unido_temporal])
                
                # Renombrar el archivo unido al nombre final
                if os.path.exists(archivo_final):
                    try:
                        os.remove(archivo_final)  # Eliminar si ya existe
                    except:
                        pass  # Si no se puede eliminar, continuar
                
                os.rename(archivo_unido_temporal, archivo_final)
                
                print(f"  ✅ Archivo final renombrado: {os.path.basename(archivo_final)}")
                print(f"  📊 Tamaño del archivo: {os.path.getsize(archivo_final):,} bytes")
                print(f"  📄 Total de páginas en PDF unido: {total_paginas}")
                print(f"  🔢 Archivos procesados: {archivos_procesados_count}/{len(archivos_ordenados)}")
            else:
                print(f"  ❌ Error: El archivo unido está vacío")
                # Eliminar archivo vacío
                if os.path.exists(archivo_unido_temporal):
                    os.remove(archivo_unido_temporal)
                
        except Exception as e:
            print(f"  ❌ Error al guardar el archivo unido: {e}")
            if os.path.exists(archivo_unido_temporal):
                try:
                    os.remove(archivo_unido_temporal)
                except:
                    pass
        
        # Limpiar archivos temporales
        for temp_file in archivos_temporales:
            try:
                os.unlink(temp_file)
            except:
                pass
        
    except Exception as e:
        print(f"  ❌ Error al procesar la carpeta '{os.path.basename(carpeta)}': {e}")
        
        # Limpiar archivos temporales en caso de error
        for temp_file in archivos_temporales:
            try:
                os.unlink(temp_file)
            except:
                pass

if __name__ == "__main__":
    print("=" * 80)
    print("📂 UNIÓN DE ARCHIVOS PDF POR CARPETAS")
    print("=" * 80)
    print("Este programa unirá todos los archivos PDF de cada subcarpeta")
    print("en un único archivo PDF por carpeta.")
    print("El archivo con formato 'NÚMERO NOMBRE INSTRUCTOR' irá primero.")
    print("Certificados de cédula serán procesados para eliminar páginas en blanco.")
    print("Los archivos originales serán eliminados después de la unión.")
    print("El archivo unido tendrá el mismo nombre que el PDF principal.")
    print("=" * 80)
    
    unir_pdfs_en_carpetas()