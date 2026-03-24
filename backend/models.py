import uuid

from database import Base
from sqlalchemy import Boolean, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class ApiKey(Base):
    __tablename__ = "api_keys"

    api_key_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_api_key: Mapped[str] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)


class Secret(Base):
    __tablename__ = "secrets"

    secret_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    key: Mapped[str] = mapped_column(String, unique=True, index=True)
    secret: Mapped[str] = mapped_column(Text)


class ApiKeySecretLink(Base):
    __tablename__ = "api_key_secrets_link"

    link_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    api_key_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("api_keys.api_key_id", ondelete="CASCADE"))
    secret_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("secrets.secret_id", ondelete="CASCADE"))
