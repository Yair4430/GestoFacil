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

@app.post("/entrada")
def ejecutar_entrada(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "Entrada_PDFS.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )
        
        # Intentar parsear JSON del resultado
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            # Si no es JSON válido, retornar como mensaje simple
            return {"message": result.stdout or "Entrada_PDFS ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

@app.post("/intermedio")
def ejecutar_intermedio(rutaExcels: str = Form(...), rutaFichas: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "Intermedio_EXCEL.py"), rutaExcels, rutaFichas], 
            check=True,
            capture_output=True,
            text=True
        )
        
        # Intentar parsear JSON del resultado
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            # Si no es JSON válido, retornar como mensaje simple
            return {"message": result.stdout or "Intermedio ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(status_code=500, content={"error": e.stderr or str(e)})

@app.post("/salida")
def ejecutar_salida(ruta: str = Form(...)):
    try:
        result = subprocess.run(
            ["python", os.path.join(base_dir, "Salida_PDFS.py"), ruta],
            check=True,
            capture_output=True,
            text=True
        )
        
        # Intentar parsear JSON del resultado
        try:
            resultado_json = json.loads(result.stdout)
            return resultado_json
        except json.JSONDecodeError:
            # Si no es JSON válido, retornar como mensaje simple
            return {"message": result.stdout or "Salida_PDFS ejecutado correctamente"}
            
    except subprocess.CalledProcessError as e:
        return JSONResponse(
            status_code=500,
            content={"error": e.stderr or str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)