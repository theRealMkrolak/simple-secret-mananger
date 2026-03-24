from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApiKeySecretLinkBase(BaseModel):
    api_key_id: UUID
    secret_id: UUID

class ApiKeySecretLinkCreate(ApiKeySecretLinkBase):
    pass

class ApiKeySecretLinkResponse(ApiKeySecretLinkBase):
    id: UUID = Field(validation_alias="link_id")
    model_config = ConfigDict(from_attributes=True)
