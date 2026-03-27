"""
IRPF 2025 · Proxy Backend
Arranca con: uvicorn main:app --reload --port 3001
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx, os
from dotenv import load_dotenv

load_dotenv(override=True)

app = FastAPI(title="IRPF 2025 API Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción pon tu dominio
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"

@app.post("/api/claude")
async def proxy_claude(request: Request):
    body = await request.json()
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            ANTHROPIC_URL,
            json=body,
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
        )
    return JSONResponse(content=resp.json(), status_code=resp.status_code)

@app.get("/health")
async def health():
    return {"status": "ok", "key_loaded": bool(ANTHROPIC_API_KEY)}
