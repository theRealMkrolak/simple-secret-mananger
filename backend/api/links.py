import uuid

from crud import create_api_key_secret_link, delete_api_key_secret_link, get_links
from database import get_db
from dependencies import get_current_admin
from fastapi import APIRouter, Depends, HTTPException
from schemas import ApiKeyResponse, ApiKeySecretLinkCreate, ApiKeySecretLinkResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/links", tags=["Admin"])

@router.post("/", response_model=ApiKeySecretLinkResponse)
def create_link(
    link: ApiKeySecretLinkCreate, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> ApiKeySecretLinkResponse:
    return create_api_key_secret_link(db=db, link=link)

@router.get("/", response_model=list[ApiKeySecretLinkResponse])
def read_links(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> list[ApiKeySecretLinkResponse]:
    return get_links(db, skip=skip, limit=limit)


@router.delete("/{link_id}")
def delete_link(
    link_id: uuid.UUID, 
    db: Session = Depends(get_db), 
    admin: ApiKeyResponse = Depends(get_current_admin)
) -> dict[str, str]:
    if not delete_api_key_secret_link(db, link_id):
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "success"}
