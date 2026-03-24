from uuid import UUID

from dependencies import CurrentAdmin, DBSession
from dtos import (
    ApiKeySecretLinkCreate,
    ApiKeySecretLinkResponse,
    SecretListResponse,
    SecretResponse,
)
from fastapi import APIRouter, HTTPException
from services import (
    create_api_key_secret_link,
    delete_api_key_secret_link,
    get_available_secrets_for_api_key,
    get_links,
)

router = APIRouter(prefix="/admin/links", tags=["Admin"])


@router.post("/", response_model=ApiKeySecretLinkResponse)
def create_link(link: ApiKeySecretLinkCreate, db: DBSession, admin: CurrentAdmin) -> ApiKeySecretLinkResponse:
    return create_api_key_secret_link(db=db, link=link)


@router.get("/", response_model=list[ApiKeySecretLinkResponse])
def read_links(db: DBSession, admin: CurrentAdmin, skip: int = 0, limit: int = 100) -> list[ApiKeySecretLinkResponse]:
    return get_links(db, skip=skip, limit=limit)


@router.delete("/{link_id}")
def delete_link(link_id: UUID, db: DBSession, admin: CurrentAdmin) -> dict[str, str]:
    if not delete_api_key_secret_link(db, link_id):
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "success"}


@router.get("/available-secrets/{api_key_id}", response_model=list[SecretResponse])
def read_available_secrets(
    api_key_id: UUID,
    db: DBSession,
    admin: CurrentAdmin,
) -> list[SecretListResponse]:
    return get_available_secrets_for_api_key(db, api_key_id)
