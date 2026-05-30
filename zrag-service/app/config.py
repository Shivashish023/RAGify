import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name = "ragify-rag-service"
    internal_api_key = os.getenv("INTERNAL_API_KEY", "dev-internal-secret")


settings = Settings()
