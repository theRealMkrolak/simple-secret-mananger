from database import get_db
from dependencies import get_current_api_key
from dtos import ApiKeyResponse, ApiMeResponse, SecretListResponse, SecretResponse
from fastapi import APIRouter, Depends, HTTPException
from services import get_secret_by_key_for_api_key, get_secrets_for_api_key
from sqlalchemy.orm import Session

router = APIRouter(prefix="/client", tags=["Client"])


@router.get("/me", response_model=ApiMeResponse)
def read_my_key(current_key: ApiKeyResponse = Depends(get_current_api_key)) -> ApiMeResponse:
    return ApiMeResponse(is_admin=current_key.is_admin)


@router.get("/secrets", response_model=list[SecretListResponse])
def read_my_secrets(
    db: Session = Depends(get_db), current_key: ApiKeyResponse = Depends(get_current_api_key)
) -> list[SecretListResponse]:
    return get_secrets_for_api_key(db, current_key.api_key_id)


@router.get("/secrets/{key}", response_model=SecretResponse)
def read_my_secret(
    key: str, db: Session = Depends(get_db), current_key: ApiKeyResponse = Depends(get_current_api_key)
) -> SecretResponse:
    secret = get_secret_by_key_for_api_key(db, current_key.api_key_id, key)
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    return secret
