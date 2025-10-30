import pdfplumber,re, os, shutil,sys, json

# Extrae número de ficha y nombre del instructor desde el texto del PDF
def extraer_datos_pdf(ruta_pdf):
    try:
        texto = ""
        with pdfplumber.open(ruta_pdf) as pdf:
            for pagina in pdf.pages:
                texto += pagina.extract_text() + "\n"
    except Exception as e:
        return "No encontrado", "No encontrado"

    texto = re.sub(r'\s+', ' ', texto)

    ficha = "No encontrado"
    patron_ficha = r'NO\.?\s*FICHA[:\s]+(\d{6,8})'
    match_ficha = re.search(patron_ficha, texto, re.IGNORECASE)
    if match_ficha:
        ficha = match_ficha.group(1)
    else:
        match_alt = re.search(r'(\d{6,8})\s+CODIGO\s+PROGRAMA', texto, re.IGNORECASE)
        if match_alt:
            ficha = match_alt.group(1)

    instructor = "No encontrado"
    patron_instructor = r'CC\s*\d{6,12}\s*-\s*([A-ZÁÉÍÓÚÑ]+\s+[A-ZÁÉÍÓÚÑ]+\s+[A-ZÁÉÍÓÚÑ]+\s*[A-ZÁÉÍÓÚÑ]*)'
    match_instructor = re.search(patron_instructor, texto, re.IGNORECASE)
    if match_instructor:
        instructor = match_instructor.group(1).strip()
        instructor = re.sub(r'\s{2,}', ' ', instructor)
        instructor = instructor.upper()

    return ficha, instructor

# Renombra el archivo PDF usando ficha e instructor, o lo mueve a carpeta No_Renombrados
def renombrar_pdf(ruta_pdf, carpeta_principal, ficha, instructor):
    try:
        if ficha == "No encontrado" or instructor == "No encontrado":
            carpeta_no = os.path.join(carpeta_principal, "No_Renombrados")
            os.makedirs(carpeta_no, exist_ok=True)
            destino = os.path.join(carpeta_no, os.path.basename(ruta_pdf))
            shutil.move(ruta_pdf, destino)
            return {"archivo": os.path.basename(ruta_pdf), "estado": "no_renombrado"}

        base_nombre = f"{ficha} {instructor}"
        base_nombre = re.sub(r'[<>:"/\\|?*]', '', base_nombre)
        nuevo_nombre = f"{base_nombre}.pdf"

        carpeta = os.path.dirname(ruta_pdf)
        nueva_ruta = os.path.join(carpeta, nuevo_nombre)

        sufijo = ""
        while os.path.exists(nueva_ruta):
            sufijo += "_"
            nuevo_nombre = f"{base_nombre}{sufijo}.pdf"
            nueva_ruta = os.path.join(carpeta, nuevo_nombre)

        os.rename(ruta_pdf, nueva_ruta)
        return {"archivo": os.path.basename(nueva_ruta), "estado": "renombrado"}

    except Exception as e:
        return {"archivo": os.path.basename(ruta_pdf), "estado": f"error: {str(e)}"}

# Procesa todos los PDFs en una carpeta y organiza resultados
def procesar_carpeta(carpeta_principal):
    resultado = {"renombrados": [], "no_renombrados": [], "errores": []}

    if not os.path.isdir(carpeta_principal):
        return {"error": "La ruta no es una carpeta válida"}

    archivos_pdf = [f for f in os.listdir(carpeta_principal) if f.lower().endswith('.pdf')]

    if not archivos_pdf:
        return {"error": "No se encontraron archivos PDF en la carpeta"}

    for archivo in archivos_pdf:
        ruta_pdf = os.path.join(carpeta_principal, archivo)
        ficha, instructor = extraer_datos_pdf(ruta_pdf)
        resultado_archivo = renombrar_pdf(ruta_pdf, carpeta_principal, ficha, instructor)

        if resultado_archivo["estado"] == "renombrado":
            resultado["renombrados"].append(resultado_archivo["archivo"])
        elif resultado_archivo["estado"] == "no_renombrado":
            resultado["no_renombrados"].append(resultado_archivo["archivo"])
        else:
            resultado["errores"].append(resultado_archivo)

    return resultado

# Punto de entrada principal - procesa carpeta desde argumento de línea de comandos
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No se proporcionó la ruta de la carpeta"}))
        sys.exit(1)

    carpeta_principal = sys.argv[1]
    resultado = procesar_carpeta(carpeta_principal)
    print(json.dumps(resultado, ensure_ascii=False))