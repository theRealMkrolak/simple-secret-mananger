import secrets
import uuid

import bcrypt
from models import ApiKey, ApiKeySecretLink, Secret
from schemas import (
    ApiKeyCreate,
    ApiKeyCreateResponse,
    ApiKeyResponse,
    ApiKeySecretLinkCreate,
    ApiKeySecretLinkResponse,
    SecretCreate,
    SecretResponse,
)
from sqlalchemy.orm import Session


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        return False


def generate_api_key_str() -> str:
    return secrets.token_urlsafe(32)


def get_api_key_by_key(db: Session, key_string: str) -> ApiKeyResponse | None:
    try:
        key_id_str, raw_key = key_string.split(":", 1)
        key_id = uuid.UUID(key_id_str)
    except ValueError:
        return None

    db_api_key = db.query(ApiKey).filter(ApiKey.api_key_id == key_id).first()
    if not db_api_key:
        return None

    if verify_password(raw_key, str(db_api_key.hashed_api_key)):
        return ApiKeyResponse.model_validate(db_api_key)
    return None


def create_api_key(db: Session, key_in: ApiKeyCreate) -> ApiKeyCreateResponse:
    raw_api_key = generate_api_key_str()
    hashed_key = get_password_hash(raw_api_key)

    db_api_key = ApiKey(name=key_in.name, is_admin=key_in.is_admin, hashed_api_key=hashed_key)
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)

    full_api_key = f"{db_api_key.api_key_id}:{raw_api_key}"
    return ApiKeyCreateResponse(
        api_key_id=db_api_key.api_key_id,
        name=str(db_api_key.name),
        is_admin=bool(db_api_key.is_admin),
        key_string=full_api_key,
    )


def get_api_keys(db: Session, skip: int = 0, limit: int = 100) -> list[ApiKeyResponse]:
    keys = db.query(ApiKey).offset(skip).limit(limit).all()
    return [ApiKeyResponse.model_validate(k) for k in keys]


def create_secret(db: Session, secret: SecretCreate) -> SecretResponse:
    db_secret = Secret(key=secret.key, secret=secret.secret)
    db.add(db_secret)
    db.commit()
    db.refresh(db_secret)
    return SecretResponse.model_validate(db_secret)


def get_secrets(db: Session, skip: int = 0, limit: int = 100) -> list[SecretResponse]:
    secrets_list = db.query(Secret).offset(skip).limit(limit).all()
    return [SecretResponse.model_validate(s) for s in secrets_list]


def create_api_key_secret_link(db: Session, link: ApiKeySecretLinkCreate) -> ApiKeySecretLinkResponse:
    db_link = ApiKeySecretLink(api_key_id=link.api_key_id, secret_id=link.secret_id)
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return ApiKeySecretLinkResponse.model_validate(db_link)


def get_links(db: Session, skip: int = 0, limit: int = 100) -> list[ApiKeySecretLinkResponse]:
    links = db.query(ApiKeySecretLink).offset(skip).limit(limit).all()
    return [ApiKeySecretLinkResponse.model_validate(link) for link in links]


def get_secrets_for_api_key(db: Session, api_key_id: uuid.UUID) -> list[SecretResponse]:
    secrets_list = (
        db.query(Secret)
        .join(ApiKeySecretLink, Secret.secret_id == ApiKeySecretLink.secret_id)
        .filter(ApiKeySecretLink.api_key_id == api_key_id)
        .all()
    )
    return [SecretResponse.model_validate(s) for s in secrets_list]


def delete_api_key(db: Session, api_key_id: uuid.UUID) -> bool:
    obj = db.query(ApiKey).filter(ApiKey.api_key_id == api_key_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False


def delete_secret(db: Session, secret_id: uuid.UUID) -> bool:
    obj = db.query(Secret).filter(Secret.secret_id == secret_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False


def delete_api_key_secret_link(db: Session, link_id: uuid.UUID) -> bool:
    obj = db.query(ApiKeySecretLink).filter(ApiKeySecretLink.link_id == link_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False
