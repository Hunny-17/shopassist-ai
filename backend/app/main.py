import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from mangum import Mangum
except ImportError:
    Mangum = None

from app.routers.chat import router as chat_router
from app.routers.products import router as products_router


load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def _allowed_origins() -> list[str]:
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    environment = os.getenv("ENVIRONMENT", "development")

    if environment == "production":
        return [frontend_url]

    return [frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"]


app = FastAPI(
    title="ShopAssist AI Backend",
    version="0.1.0",
    description="FastAPI backend for ShopAssist AI conversational sales agent.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(chat_router)
app.include_router(products_router)


@app.get("/health")
async def health_check() -> dict:
    return {
        "success": True,
        "data": {
            "status": "ok",
            "environment": os.getenv("ENVIRONMENT", "development"),
        },
        "message": "ShopAssist AI backend is healthy",
    }


handler = Mangum(app) if Mangum else None
