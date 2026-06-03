from functools import lru_cache

from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings

from app.config import settings


@lru_cache(maxsize=1)
def _embedding_model() -> HuggingFaceEndpointEmbeddings:
    return HuggingFaceEndpointEmbeddings(
        model=settings.huggingface_embedding_model,
        task="feature-extraction",
        huggingfacehub_api_token=settings.huggingface_api_key or None,
    )


def create_embeddings(texts: list[str]) -> list[list[float]]:
    return _embedding_model().embed_documents(texts)


def create_query_embedding(text: str) -> list[float]:
    return _embedding_model().embed_query(text)
