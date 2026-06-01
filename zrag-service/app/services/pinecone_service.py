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


def query_organization_chunks(
    organization_id: str,
    query_embedding: list[float],
    top_k: int = 5,
) -> list[dict]:
    pinecone_index = _index()
    result = pinecone_index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter={"organizationId": {"$eq": organization_id}},
    )

    matches = []

    for match in result.matches:
        metadata = match.metadata or {}
        matches.append(
            {
                "text": metadata.get("text", ""),
                "fileName": metadata.get("fileName", ""),
                "documentId": metadata.get("documentId", ""),
                "chunkIndex": int(metadata.get("chunkIndex", 0)),
                "score": float(match.score or 0),
            }
        )

    return matches


def delete_document_vectors(document_id: str) -> None:
    """Delete all vectors for a given document by filtering on metadata.documentId."""
    pinecone_index = _index()
    pinecone_index.delete(filter={"documentId": {"$eq": document_id}})
