from uuid import UUID

from dependencies import CurrentAdmin, DBSession
from dtos import SecretCreate, SecretListResponse, SecretResponse
from fastapi import APIRouter, HTTPException
from services import create_secret, delete_secret, get_available_secrets_for_api_key, get_secret, get_secrets

router = APIRouter(prefix="/admin/secrets", tags=["Admin"])


@router.post("/", response_model=SecretResponse)
def create_sec(secret: SecretCreate, db: DBSession, admin: CurrentAdmin) -> SecretResponse:
    return create_secret(db=db, secret=secret)


@router.get("/", response_model=list[SecretListResponse])
def read_secs(
    db: DBSession, admin: CurrentAdmin, skip: int = 0, limit: int = 100, for_api_key_id: UUID | None = None
) -> list[SecretListResponse]:
    if for_api_key_id:
        return get_available_secrets_for_api_key(db, api_key_id=for_api_key_id)
    return get_secrets(db, skip=skip, limit=limit)


@router.get("/{secret_id}", response_model=SecretResponse)
def read_sec(
    secret_id: UUID,
    db: DBSession,
    admin: CurrentAdmin,
) -> SecretResponse:
    secret = get_secret(db, secret_id)
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    return secret


@router.delete("/{secret_id}")
def delete_sec(secret_id: UUID, db: DBSession, admin: CurrentAdmin) -> dict[str, str]:
    if not delete_secret(db, secret_id):
        raise HTTPException(status_code=404, detail="Secret not found")
    return {"message": "success"}
