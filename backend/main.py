import os
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

import alembic.command
from alembic.config import Config
from api import client, keys, links, secrets
from config import settings
from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Run alembic migrations
    logger.info("Running alembic migrations")
    alembic_config = Config("alembic.ini")
    alembic_config.set_main_option("script_location", "alembic")
    alembic_config.set_main_option("sqlalchemy.url", settings.database_url)
    alembic.command.upgrade(alembic_config, "head")
    yield


app = FastAPI(title="Secrets Manager", lifespan=lifespan)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(keys.router)
api_router.include_router(secrets.router)
api_router.include_router(links.router)
api_router.include_router(client.router)


@api_router.get("/health", tags=["Health"])
def read_root() -> dict[str, str]:
    return {"message": "Welcome to Secrets Manager API v1"}


app.include_router(api_router)

# To serve on one IP (Production): Mount the built frontend static files!
if settings.serve_frontend:
    frontend_build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
    if os.path.isdir(frontend_build_dir):
        # Serve static assets
        app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build_dir, "assets")), name="static")

        # Catch-all for SPA: Any route that doesn't match an API route returns index.html
        @app.get("/{full_path:path}", tags=["Frontend"])
        async def serve_spa(request: Request, full_path: str) -> Any:
            # Check if it looks like an API call first (just in case they missed the prefix)
            if full_path.startswith("api/"):
                return {"detail": "Not Found"}

            # Default to index.html for everything else to support SPA routing
            index_file = os.path.join(frontend_build_dir, "index.html")
            return FileResponse(index_file)
    else:
        logger.warning(f"Frontend build directory '{frontend_build_dir}' not found. Cannot serve frontend.")
