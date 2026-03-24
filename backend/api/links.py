from uuid import UUID

from database import get_db
from dependencies import get_current_admin
from dtos import (
    ApiKeyResponse,
    ApiKeySecretLinkCreate,
    ApiKeySecretLinkResponse,
    SecretResponse,
)
from fastapi import APIRouter, Depends, HTTPException
from services import (
    create_api_key_secret_link,
    delete_api_key_secret_link,
    get_available_secrets_for_api_key,
    get_links,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/links", tags=["Admin"])


@router.post("/", response_model=ApiKeySecretLinkResponse)
def create_link(
    link: ApiKeySecretLinkCreate, db: Session = Depends(get_db), admin: ApiKeyResponse = Depends(get_current_admin)
) -> ApiKeySecretLinkResponse:
    return create_api_key_secret_link(db=db, link=link)


@router.get("/", response_model=list[ApiKeySecretLinkResponse])
def read_links(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin: ApiKeyResponse = Depends(get_current_admin)
) -> list[ApiKeySecretLinkResponse]:
    return get_links(db, skip=skip, limit=limit)


@router.delete("/{link_id}")
def delete_link(
    link_id: UUID, db: Session = Depends(get_db), admin: ApiKeyResponse = Depends(get_current_admin)
) -> dict[str, str]:
    if not delete_api_key_secret_link(db, link_id):
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "success"}


@router.get("/available-secrets/{api_key_id}", response_model=list[SecretResponse])
def read_available_secrets(
    api_key_id: UUID,
    db: Session = Depends(get_db),
    admin: ApiKeyResponse = Depends(get_current_admin),
) -> list[SecretResponse]:
    return get_available_secrets_for_api_key(db, api_key_id)
