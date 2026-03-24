from uuid import UUID, uuid4

from database import Base
from sqlalchemy import String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class Secret(Base):
    __tablename__ = "secrets"

    secret_id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    key: Mapped[str] = mapped_column(String, unique=True, index=True)
    secret: Mapped[str] = mapped_column(Text)
