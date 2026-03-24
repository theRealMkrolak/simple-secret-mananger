from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ApiKeyBase(BaseModel):
    name: str
    is_admin: bool = False

class ApiKeyCreate(ApiKeyBase):
    pass

class ApiKeyResponse(ApiKeyBase):
    api_key_id: UUID
    model_config = ConfigDict(from_attributes=True)

class ApiKeyCreateResponse(ApiKeyResponse):
    key_string: str
