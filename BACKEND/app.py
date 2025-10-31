from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import subprocess, os, json

# Configuración inicial desde variables de entorno
load_dotenv()

scripts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.getenv("SCRIPTS_DIR", "GestoFacil"))
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
host = os.getenv("HOST", "127.0.0.1")
port = int(os.getenv("PORT", 8000))

# Configuración de la aplicación FastAPI con CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para renombrar PDFs extraídos usando datos internos del documento
@app.post("/renombrarPDF")
def ejecutar_entrada_extractornombre(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "renombrarPDF.py"), ruta],
            check=True, capture_output=True, text=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"message": result.stdout or "entrada_ExtraerNombre ejecutado correctamente"}
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

# Endpoint para organizar PDFs en subcarpetas según número de ficha
@app.post("/subcarpetasPDF")
def ejecutar_entrada(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "subcarpetasPDF.py"), ruta],
            check=True, capture_output=True, text=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"message": result.stdout or "Entrada_PDFS ejecutado correctamente"}
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

# Endpoint para mover archivos Excel a carpetas de fichas correspondientes
@app.post("/organizadorEXCEL")
def ejecutar_intermedio(rutaExcels: str = Form(...), rutaFichas: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "organizadorEXCEL.py"), rutaExcels, rutaFichas],
            check=True, capture_output=True, text=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"message": result.stdout or "Intermedio ejecutado correctamente"}
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

# Endpoint para extraer información de aprendices desde PDFs a Excel
@app.post("/extraerInfAprendiz")
def ejecutar_extraer_datos(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "extraerInfAprendiz.py"), ruta],
            check=True, capture_output=True
        )

        stdout_text = result.stdout.decode("utf-8", errors="ignore")

        # Dividimos línea por línea y parseamos los JSON individuales
        lineas = [l.strip() for l in stdout_text.splitlines() if l.strip()]
        mensajes = []
        for linea in lineas:
            try:
                mensajes.append(json.loads(linea))
            except json.JSONDecodeError:
                mensajes.append({"mensaje_texto": linea})
        
        return {"detalles": mensajes}

    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr.decode('utf-8', errors='ignore')})

# Endpoint para unir múltiples PDFs en cada carpeta en un solo archivo
@app.post("/unirPDF")
def ejecutar_intermedio_pdfs(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "unirPDF.py"), ruta],
            check=True, capture_output=True, text=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"message": result.stdout or "Intermedio_PDFS ejecutado correctamente"}
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

# Endpoint para renombrar PDFs finales según estructura de carpetas
@app.post("/renombrarPDFFinal")
def ejecutar_salida(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(scripts_dir, "renombrarPDFFinal.py"), ruta],
            check=True, capture_output=True, text=True
        )
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"message": result.stdout or "Salida_PDFS ejecutado correctamente"}
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

# Inicialización del servidor Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host=host, port=port, reload=True)