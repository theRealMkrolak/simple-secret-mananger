from uuid import UUID

from database import get_db
from dependencies import get_current_admin
from dtos import ApiKeyResponse, SecretCreate, SecretListResponse, SecretResponse
from fastapi import APIRouter, Depends, HTTPException
from services import create_secret, delete_secret, get_secret, get_secrets
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/secrets", tags=["Admin"])

@router.post("/", response_model=SecretResponse)
def create_sec(
    secret: SecretCreate, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> SecretResponse:
    return create_secret(db=db, secret=secret)

@router.get("/", response_model=list[SecretListResponse])
def read_secs(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> list[SecretListResponse]:
    return get_secrets(db, skip=skip, limit=limit)


@router.get("/{secret_id}", response_model=SecretResponse)
def read_sec(
    secret_id: UUID,
    db: Session = Depends(get_db),
    admin: ApiKeyResponse = Depends(get_current_admin),
) -> SecretResponse:
    secret = get_secret(db, secret_id)
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    return secret


@router.delete("/{secret_id}")
def delete_sec(
    secret_id: UUID, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> dict[str, str]:
    if not delete_secret(db, secret_id):
        raise HTTPException(status_code=404, detail="Secret not found")
    return {"message": "success"}
