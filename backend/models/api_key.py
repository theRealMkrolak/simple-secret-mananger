from uuid import UUID, uuid4

from database import Base
from sqlalchemy import Boolean, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class ApiKey(Base):
    __tablename__ = "api_keys"

    api_key_id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_api_key: Mapped[str] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
