import os
import re
import shutil
import sys

# ✅ Solicita la ruta si no se proporciona como argumento
if len(sys.argv) < 2:
    ruta_origen = input("Ingresa la ruta completa de la carpeta con PDFs: ").strip()
else:
    ruta_origen = sys.argv[1]

# Validar existencia de la carpeta
if not os.path.isdir(ruta_origen):
    print("Ruta inválida o no existe")
    exit()

# Regex para validar nombres como "12345 NOMBRE APELLIDO.pdf"
patron_valido = re.compile(
    r'^(\d+)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+)+)[ _]?\.pdf$', re.IGNORECASE
)

# Lista para almacenar movimientos
archivos_movidos = []

for archivo in os.listdir(ruta_origen):
    if archivo.lower().endswith('.pdf'):
        ruta_archivo = os.path.join(ruta_origen, archivo)
        match = patron_valido.match(archivo)

        if match:
            numero_ficha = match.group(1)
            carpeta_destino = os.path.join(ruta_origen, numero_ficha)
            os.makedirs(carpeta_destino, exist_ok=True)

            destino = os.path.join(carpeta_destino, archivo)
            nombre_base, extension = os.path.splitext(archivo)
            contador = 1
            nombre_final = archivo

            # Evitar sobrescribir si ya existe un archivo igual
            while os.path.exists(destino):
                nombre_final = f"{nombre_base} ({contador}){extension}"
                destino = os.path.join(carpeta_destino, nombre_final)
                contador += 1

            shutil.move(ruta_archivo, destino)
            archivos_movidos.append((archivo, nombre_final, numero_ficha))
        else:
            print(f'[!] Formato inválido: {archivo}')

# ✅ Mostrar resumen final
print("\nResumen de archivos movidos:")
for original, nuevo_nombre, carpeta in archivos_movidos:
    if original == nuevo_nombre:
        print(f"- {original} -> carpeta {carpeta}")
    else:
        print(f"- {original} (renombrado como {nuevo_nombre}) → carpeta {carpeta}")
