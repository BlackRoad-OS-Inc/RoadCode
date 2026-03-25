"""API Gateway — FastAPI service routing all requests."""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

app = FastAPI(
    title="BlackRoad RoadCode API",
    version="1.0.0",
    description="Sovereign API gateway for BlackRoad services",
)

ALLOWED_ORIGINS = [
    "https://blackroad.io",
    "https://roadcode.blackboxprogramming.io",
    "https://lucidia.earth",
    "https://prism.blackroad.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

START_TIME = time.time()

@app.get("/")
async def root():
    return {"service": "roadcode-gateway", "status": "online", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "uptime": round(time.time() - START_TIME),
        "services": {
            "gateway": "ok",
            "search": "ok",
            "agents": "ok",
        },
    }

@app.get("/api/agents")
async def list_agents():
    return {
        "agents": [
            {"name": "cece", "role": "executive-assistant", "status": "online"},
            {"name": "lucidia", "role": "researcher", "status": "online"},
            {"name": "operator", "role": "fleet-manager", "status": "online"},
            {"name": "alice", "role": "gateway", "status": "online"},
            {"name": "cecilia", "role": "inference", "status": "online"},
            {"name": "octavia", "role": "platform", "status": "online"},
            {"name": "aria", "role": "edge", "status": "online"},
            {"name": "gematria", "role": "tls-edge", "status": "online"},
            {"name": "anastasia", "role": "compute", "status": "online"},
            {"name": "alexandria", "role": "dev-workstation", "status": "online"},
        ],
        "total": 10,
    }

@app.get("/api/fleet")
async def fleet_status():
    return {
        "nodes": [
            {"name": "alice", "role": "gateway", "status": "online"},
            {"name": "cecilia", "role": "inference", "status": "online"},
            {"name": "octavia", "role": "platform", "status": "online"},
            {"name": "aria", "role": "edge", "status": "online"},
            {"name": "lucidia", "role": "dns-apps", "status": "online"},
            {"name": "gematria", "role": "tls-edge", "status": "online"},
            {"name": "anastasia", "role": "compute", "status": "online"},
        ],
        "total": 7,
    }

@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    agent = body.get("agent", "cece")
    message = body.get("message", "")
    return {"agent": agent, "response": f"[{agent}] Received: {message}", "channel": body.get("channel", "general")}
