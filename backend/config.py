import os

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Settings(BaseSettings):
    admin_root_key: str = "super_secret_root_key"
    database_url: str = f"sqlite:///{os.path.join(BASE_DIR, 'secrets.db')}"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
