import uuid

from database import get_db
from dependencies import get_current_admin
from dtos import ApiKeyCreate, ApiKeyCreateResponse, ApiKeyResponse
from fastapi import APIRouter, Depends, HTTPException
from services import create_api_key, delete_api_key, get_api_key, get_api_keys
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/api-keys", tags=["Admin"])

@router.post("/", response_model=ApiKeyCreateResponse)
def create_key(
    key_in: ApiKeyCreate, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> ApiKeyCreateResponse:
    return create_api_key(db=db, key_in=key_in)

@router.get("/", response_model=list[ApiKeyResponse])
def read_keys(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> list[ApiKeyResponse]:
    return get_api_keys(db, skip=skip, limit=limit)


@router.get("/{api_key_id}", response_model=ApiKeyResponse)
def read_key(
    api_key_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: ApiKeyResponse = Depends(get_current_admin),
) -> ApiKeyResponse:
    key = get_api_key(db, api_key_id)
    if not key:
        raise HTTPException(status_code=404, detail="API Key not found")
    return key


@router.delete("/{api_key_id}")
def delete_key(
    api_key_id: uuid.UUID, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> dict[str, str]:
    if not delete_api_key(db, api_key_id):
        raise HTTPException(status_code=404, detail="API Key not found")
    return {"message": "success"}
