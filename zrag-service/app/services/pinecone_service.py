from pinecone import Pinecone

from app.config import settings


def _index():
    if not settings.pinecone_api_key:
        raise ValueError("PINECONE_API_KEY is not configured")

    pinecone = Pinecone(api_key=settings.pinecone_api_key)
    return pinecone.Index(settings.pinecone_index_name)


def upsert_document_chunks(
    organization_id: str,
    document_id: str,
    file_name: str,
    chunks: list[str],
    embeddings: list[list[float]],
) -> None:
    if len(chunks) != len(embeddings):
        raise ValueError("Chunks and embeddings length mismatch")

    vectors = []

    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        vectors.append(
            {
                "id": f"{document_id}-{index}",
                "values": embedding,
                "metadata": {
                    "organizationId": organization_id,
                    "documentId": document_id,
                    "fileName": file_name,
                    "chunkIndex": index,
                    "text": chunk,
                },
            }
        )

    pinecone_index = _index()

    for start in range(0, len(vectors), 50):
        pinecone_index.upsert(vectors=vectors[start : start + 50])
