from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "Dream OS Backend v3.5", "sovereign": True}

@app.get("/api/ai/diagnose")
async def ai_diagnose(query: str = ""):
    return {"query": query, "response": f"Analisa: {query}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8082)
