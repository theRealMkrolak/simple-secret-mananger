from dependencies import CurrentApiKey, DBSession
from dtos import ApiMeResponse, SecretListResponse, SecretResponse
from fastapi import APIRouter, HTTPException
from services import get_secret_by_key_for_api_key, get_secrets_for_api_key

router = APIRouter(prefix="/client", tags=["Client"])


@router.get("/me", response_model=ApiMeResponse)
def read_my_key(current_key: CurrentApiKey) -> ApiMeResponse:
    return ApiMeResponse(is_admin=current_key.is_admin, name=current_key.name)


@router.get("/secrets", response_model=list[SecretListResponse])
def read_my_secrets(
    db: DBSession, current_key: CurrentApiKey
) -> list[SecretListResponse]:
    return get_secrets_for_api_key(db, current_key.api_key_id)


@router.get("/secrets/{key}", response_model=SecretResponse)
def read_my_secret(
    key: str, db: DBSession, current_key: CurrentApiKey
) -> SecretResponse:
    secret = get_secret_by_key_for_api_key(db, current_key.api_key_id, key)
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")
    return secret
