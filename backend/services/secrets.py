from uuid import UUID

from dtos import SecretCreate, SecretListResponse, SecretResponse
from models import ApiKeySecretLink, Secret
from sqlalchemy.orm import Session


def create_secret(db: Session, secret: SecretCreate) -> SecretResponse:
    db_secret = Secret(key=secret.key, secret=secret.secret)
    db.add(db_secret)
    db.commit()
    db.refresh(db_secret)
    return SecretResponse.model_validate(db_secret)

def get_secrets(db: Session, skip: int = 0, limit: int = 100) -> list[SecretListResponse]:
    secrets_list = db.query(Secret).offset(skip).limit(limit).all()
    return [SecretListResponse.model_validate(s) for s in secrets_list]

def get_secret(db: Session, secret_id: UUID) -> SecretResponse | None:
    obj = db.query(Secret).filter(Secret.secret_id == secret_id).first()
    return SecretResponse.model_validate(obj) if obj else None


def delete_secret(db: Session, secret_id: UUID) -> bool:
    obj = db.query(Secret).filter(Secret.secret_id == secret_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False

def get_secrets_for_api_key(db: Session, api_key_id: UUID) -> list[SecretListResponse]:
    secrets_list = (
        db.query(Secret)
        .join(ApiKeySecretLink, Secret.secret_id == ApiKeySecretLink.secret_id)
        .filter(ApiKeySecretLink.api_key_id == api_key_id)
        .all()
    )
    return [SecretListResponse.model_validate(s) for s in secrets_list]

def get_available_secrets_for_api_key(db: Session, api_key_id: UUID) -> list[SecretListResponse]:
    linked_ids_query = db.query(ApiKeySecretLink.secret_id).filter(ApiKeySecretLink.api_key_id == api_key_id)
    available_secrets = db.query(Secret).filter(~Secret.secret_id.in_(linked_ids_query)).all()
    return [SecretListResponse.model_validate(s) for s in available_secrets]
def get_secret_by_key_for_api_key(db: Session, api_key_id: UUID, key: str) -> SecretResponse | None:
    obj = (
        db.query(Secret)
        .join(ApiKeySecretLink, Secret.secret_id == ApiKeySecretLink.secret_id)
        .filter(ApiKeySecretLink.api_key_id == api_key_id)
        .filter(Secret.key == key)
        .first()
    )
    return SecretResponse.model_validate(obj) if obj else None
