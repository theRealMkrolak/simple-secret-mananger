import uuid

from crud import create_secret, delete_secret, get_secrets
from database import get_db
from dependencies import get_current_admin
from fastapi import APIRouter, Depends, HTTPException
from schemas import ApiKeyResponse, SecretCreate, SecretResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/secrets", tags=["Admin"])

@router.post("/", response_model=SecretResponse)
def create_sec(
    secret: SecretCreate, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> SecretResponse:
    return create_secret(db=db, secret=secret)

@router.get("/", response_model=list[SecretResponse])
def read_secs(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> list[SecretResponse]:
    return get_secrets(db, skip=skip, limit=limit)


@router.delete("/{secret_id}")
def delete_sec(
    secret_id: uuid.UUID, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> dict[str, str]:
    if not delete_secret(db, secret_id):
        raise HTTPException(status_code=404, detail="Secret not found")
    return {"message": "success"}
