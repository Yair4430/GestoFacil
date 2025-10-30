from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import subprocess
import os
import json

base_dir = os.path.dirname(os.path.abspath(__file__))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/renombrarPDF")
def ejecutar_entrada_extractornombre(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "renombrarPDF.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )

        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {"message": result.stdout or "entrada_ExtraerNombre ejecutado correctamente"}

    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})


@app.post("/subcarpetasPDF")
def ejecutar_entrada(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "subcarpetasPDF.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )
        
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {"message": result.stdout or "Entrada_PDFS ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

@app.post("/organizadorEXCEL")
def ejecutar_intermedio(rutaExcels: str = Form(...), rutaFichas: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "organizadorEXCEL.py"), rutaExcels, rutaFichas], 
            check=True,
            capture_output=True,
            text=True
        )
        
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {"message": result.stdout or "Intermedio ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

@app.post("/extraerInfAprendiz")
def ejecutar_extraer_datos(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "extraerInfAprendiz.py"), ruta],
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {
                "message": result.stdout or "ExtraerInfAprendiz ejecutado correctamente",
                "output": result.stdout
            }
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(
            status_code=500, 
            content={"error": e.stderr or str(e)}
        )

@app.post("/unirPDF")
def ejecutar_intermedio_pdfs(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "unirPDF.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )
        
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {"message": result.stdout or "Intermedio_PDFS ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

@app.post("/renombrarPDFFinal")
def ejecutar_salida(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "renombrarPDFFinal.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )
        
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            return {"message": result.stdout or "Salida_PDFS ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(
            status_code=500,
            content={"error": e.stderr or str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)