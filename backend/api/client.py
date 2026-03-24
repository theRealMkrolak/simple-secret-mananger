from crud import get_secrets_for_api_key
from database import get_db
from dependencies import get_current_api_key
from fastapi import APIRouter, Depends, HTTPException
from schemas import ApiKeyResponse, ApiMeResponse, SecretResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/client", tags=["Client"])


@router.get("/me", response_model=ApiMeResponse)
def read_my_key(current_key: ApiKeyResponse = Depends(get_current_api_key)) -> ApiMeResponse:
    return ApiMeResponse(is_admin=current_key.is_admin)


@router.get("/secrets", response_model=list[SecretResponse])
def read_my_secrets(
    db: Session = Depends(get_db), current_key: ApiKeyResponse = Depends(get_current_api_key)
) -> list[SecretResponse]:
    return get_secrets_for_api_key(db, current_key.api_key_id)


@router.get("/secrets/{key}", response_model=SecretResponse)
def read_my_secret(
    key: str, db: Session = Depends(get_db), current_key: ApiKeyResponse = Depends(get_current_api_key)
) -> SecretResponse:
    secrets_list = get_secrets_for_api_key(db, current_key.api_key_id)
    for s in secrets_list:
        if s.key == key:
            return s
    raise HTTPException(status_code=404, detail="Secret not found")
