from uuid import UUID, uuid4

from database import Base
from sqlalchemy import ForeignKey, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class ApiKeySecretLink(Base):
    __tablename__ = "api_key_secrets_link"
    __table_args__ = (UniqueConstraint("api_key_id", "secret_id", name="uq_api_key_secret"),)

    link_id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    api_key_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("api_keys.api_key_id", ondelete="CASCADE"))
    secret_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("secrets.secret_id", ondelete="CASCADE"))
