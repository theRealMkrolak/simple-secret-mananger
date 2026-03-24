import os

from api import client, keys, links, secrets
from fastapi import APIRouter, FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Secrets Manager")

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
frontend_build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.isdir(frontend_build_dir):
    app.mount("/", StaticFiles(directory=frontend_build_dir, html=True), name="frontend")
