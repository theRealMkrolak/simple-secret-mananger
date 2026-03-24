import re
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator


def is_camel_case(s: str) -> bool:
    # Check if a string is in camelCase: starts with lowercase, no underscores/dashes, alphanumeric only
    if not s:
        return False
    return bool(re.match(r'^[a-z][a-zA-Z0-9]*$', s))


class SecretBase(BaseModel):
    key: str

    @field_validator('key')
    @classmethod
    def validate_camel_case(cls, v: str) -> str:
        if not is_camel_case(v):
            raise ValueError('Secret name must be in camelCase (e.g., mySecretKey)')
        return v

class SecretCreate(SecretBase):
    secret: str

class SecretResponse(SecretBase):
    secret_id: UUID
    secret: str
    model_config = ConfigDict(from_attributes=True)

class SecretListResponse(SecretBase):
    secret_id: UUID
    model_config = ConfigDict(from_attributes=True)
