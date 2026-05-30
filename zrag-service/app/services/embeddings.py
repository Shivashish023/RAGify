from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings

from app.config import settings


@lru_cache(maxsize=1)
def _embedding_model() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(model_name=settings.huggingface_embedding_model)


def create_embeddings(texts: list[str]) -> list[list[float]]:
    return _embedding_model().embed_documents(texts)


def create_query_embedding(text: str) -> list[float]:
    return _embedding_model().embed_query(text)
