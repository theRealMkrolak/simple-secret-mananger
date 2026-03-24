from uuid import uuid4

from config import settings
from crud import get_api_key_by_key
from database import get_db
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from schemas import ApiKeyResponse
from sqlalchemy.orm import Session

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)


def get_current_api_key(
    key_string: str | None = Depends(api_key_header), db: Session = Depends(get_db)
) -> ApiKeyResponse:
    if not key_string:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API Key in Authorization header",
        )
    if key_string.startswith("Bearer "):
        key_string = key_string.replace("Bearer ", "", 1)

    if key_string == settings.admin_root_key:
        return ApiKeyResponse(api_key_id=uuid4(), name="root_admin", is_admin=True)

    api_key_obj = get_api_key_by_key(db, key_string)
    if not api_key_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    return api_key_obj


def get_current_admin(current_key: ApiKeyResponse = Depends(get_current_api_key)) -> ApiKeyResponse:
    if not current_key.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges",
        )
    return current_key
