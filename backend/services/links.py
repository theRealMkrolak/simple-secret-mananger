from uuid import UUID

from dtos import ApiKeySecretLinkCreate, ApiKeySecretLinkResponse
from models import ApiKeySecretLink
from sqlalchemy.orm import Session


def create_api_key_secret_link(db: Session, link: ApiKeySecretLinkCreate) -> ApiKeySecretLinkResponse:
    db_link = ApiKeySecretLink(api_key_id=link.api_key_id, secret_id=link.secret_id)
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return ApiKeySecretLinkResponse.model_validate(db_link)

def get_links(db: Session, skip: int = 0, limit: int = 100) -> list[ApiKeySecretLinkResponse]:
    links = db.query(ApiKeySecretLink).offset(skip).limit(limit).all()
    return [ApiKeySecretLinkResponse.model_validate(link) for link in links]

def delete_api_key_secret_link(db: Session, link_id: UUID) -> bool:
    obj = db.query(ApiKeySecretLink).filter(ApiKeySecretLink.link_id == link_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False
