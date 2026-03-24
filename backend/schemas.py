from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SecretBase(BaseModel):
    key: str
    secret: str


class SecretCreate(SecretBase):
    pass


class SecretResponse(SecretBase):
    secret_id: UUID
    model_config = ConfigDict(from_attributes=True)


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


class ApiKeySecretLinkBase(BaseModel):
    api_key_id: UUID
    secret_id: UUID


class ApiKeySecretLinkCreate(ApiKeySecretLinkBase):
    pass


class ApiKeySecretLinkResponse(ApiKeySecretLinkBase):
    id: UUID = Field(validation_alias="link_id")
    model_config = ConfigDict(from_attributes=True)


class ApiMeResponse(BaseModel):
    is_admin: bool
