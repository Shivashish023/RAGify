from fastapi import FastAPI

from app.config import settings
from app.routes.ingest_routes import router as ingest_router

app = FastAPI(title=settings.app_name)


@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}


app.include_router(ingest_router)
