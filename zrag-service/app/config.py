import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name = "ragify-rag-service"
    internal_api_key = os.getenv("INTERNAL_API_KEY", "dev-internal-secret")
    huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY", "")
    huggingface_embedding_model = os.getenv(
        "HUGGINGFACE_EMBEDDING_MODEL",
        "sentence-transformers/all-MiniLM-L6-v2",
    )
    pinecone_api_key = os.getenv("PINECONE_API_KEY", "")
    pinecone_index_name = os.getenv("PINECONE_INDEX_NAME", "ragify")


settings = Settings()
