from pydantic import BaseModel


class ApiMeResponse(BaseModel):
    is_admin: bool
    name: str
