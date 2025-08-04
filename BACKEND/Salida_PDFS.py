import os
import re
import shutil
import sys

# Obtener ruta desde argumentos o entrada
if len(sys.argv) < 2:
    ruta_raiz = input("Ingresa la ruta completa de la carpeta con PDFs: ").strip()
else:
    ruta_raiz = sys.argv[1]

if not os.path.isdir(ruta_raiz):
    print("Ruta inválida o no existe")
    exit(1)

# Contadores
total = 0
renombrados = 0
repetidos = 0
errores = []

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
                errores.append(f"{archivo} está en carpeta no válida: {ficha}")
                continue

            # Extrae nombres y apellidos
            nombre_archivo = os.path.splitext(archivo)[0].strip()

            # Elimina ficha duplicada al inicio si existe
            if nombre_archivo.startswith(ficha):
                nombre_archivo = nombre_archivo[len(ficha):].strip()

            # Si ya contiene "_", es repetido
            if "_" in nombre_archivo:
                nuevo_nombre = f"{ficha} {nombre_archivo} REPETIDO.pdf"
                repetidos += 1
            else:
                nuevo_nombre = f"{ficha} {nombre_archivo}_OK.pdf"
                renombrados += 1

            # Ruta final
            ruta_destino = os.path.join(ruta_raiz, nuevo_nombre)

            # Si ya existe, añade sufijo único
            contador = 1
            while os.path.exists(ruta_destino):
                ruta_destino = os.path.join(ruta_raiz, f"{os.path.splitext(nuevo_nombre)[0]}_{contador}.pdf")
                contador += 1

            try:
                shutil.move(ruta_archivo, ruta_destino)
            except Exception as e:
                errores.append(f"{archivo} → error al mover: {e}")

# Eliminar carpetas vacías (excepto la raíz)
for carpeta_actual in sorted(os.listdir(ruta_raiz), reverse=True):
    ruta_carpeta = os.path.join(ruta_raiz, carpeta_actual)
    if os.path.isdir(ruta_carpeta):
        try:
            os.rmdir(ruta_carpeta)
        except OSError:
            pass  # No está vacía

# Resumen
print("Resumen de Salida:")
print(f" Total PDFs procesados: {total}")
print(f" Renombrados correctamente: {renombrados}")
print(f" Marcados como repetidos: {repetidos}")
print(f" Errores: {len(errores)}")

if errores:
    print("\nErrores encontrados:")
    for err in errores:
        print(f" - {err}")
