import base64
import secrets
from uuid import UUID

from dtos import ApiKeyCreate, ApiKeyCreateResponse, ApiKeyResponse
from models import ApiKey
from sqlalchemy.orm import Session

from .auth import get_password_hash, verify_password


def generate_api_key_str() -> str:
    return secrets.token_urlsafe(32)


def encode_api_key(key_id: UUID, raw_key: str) -> str:
    """Encode UUID and raw key into a clean opaque sk- prefixed string."""
    payload = f"{key_id}:{raw_key}".encode()
    return f"sk-{base64.urlsafe_b64encode(payload).decode()}"


def decode_api_key(key_string: str) -> tuple[UUID, str] | None:
    """Decode an sk- prefixed key back into (UUID, raw_key). Returns None if invalid."""
    try:
        if not key_string.startswith("sk-"):
            return None
        payload = base64.urlsafe_b64decode(key_string[3:]).decode()
        key_id_str, raw_key = payload.split(":", 1)
        return UUID(key_id_str), raw_key
    except Exception:
        return None


def get_api_key_by_key(db: Session, key_string: str) -> ApiKeyResponse | None:
    decoded = decode_api_key(key_string)
    if not decoded:
        return None
    key_id, raw_key = decoded

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

    full_api_key = encode_api_key(db_api_key.api_key_id, raw_api_key)
    return ApiKeyCreateResponse(
        api_key_id=db_api_key.api_key_id,
        name=str(db_api_key.name),
        is_admin=bool(db_api_key.is_admin),
        key_string=full_api_key,
    )

def get_api_keys(db: Session, skip: int = 0, limit: int = 100) -> list[ApiKeyResponse]:
    keys = db.query(ApiKey).offset(skip).limit(limit).all()
    return [ApiKeyResponse.model_validate(k) for k in keys]

def get_api_key(db: Session, api_key_id: UUID) -> ApiKeyResponse | None:
    obj = db.query(ApiKey).filter(ApiKey.api_key_id == api_key_id).first()
    return ApiKeyResponse.model_validate(obj) if obj else None


def delete_api_key(db: Session, api_key_id: UUID) -> bool:
    obj = db.query(ApiKey).filter(ApiKey.api_key_id == api_key_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False
