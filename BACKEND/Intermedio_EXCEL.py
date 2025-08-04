import os
import re
import shutil
import sys

if len(sys.argv) < 3:
    print("Faltan argumentos. Debes pasar la carpeta de excels y la de fichas.")
    exit()

carpeta_excels = sys.argv[1]
carpeta_fichas = sys.argv[2]

if not os.path.isdir(carpeta_excels) or not os.path.isdir(carpeta_fichas):
    print("Una de las rutas no es válida.")
    exit()

patron_excel = re.compile(r'^plantilla_(\d+).(xlsx|xls|xlsm)$', re.IGNORECASE)

for archivo in os.listdir(carpeta_excels):
    match = patron_excel.match(archivo)
    if match:
        numero_ficha = match.group(1)
        ruta_archivo = os.path.join(carpeta_excels, archivo)
        carpeta_destino = os.path.join(carpeta_fichas, numero_ficha)

        if os.path.isdir(carpeta_destino):
            nueva_ruta = os.path.join(carpeta_destino, archivo)
            shutil.move(ruta_archivo, nueva_ruta)
            print(f'Movido: {archivo} -> {carpeta_destino}')
        else:
            print(f'Carpeta {numero_ficha} no existe. Archivo omitido: {archivo}')
    else:
        print(f'Nombre inválido o no coincide con patrón plantilla_<ficha>: {archivo}')
