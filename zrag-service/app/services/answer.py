from app.config import settings
from app.services.embeddings import create_query_embedding
from app.services.generation import generate_answer
from app.services.pinecone_service import query_organization_chunks

NO_CONTEXT_ANSWER = (
    "I could not find relevant information in this company's documents yet."
)


def _extract_sources(matches: list[dict]) -> list[dict]:
    seen: set[tuple[str, str]] = set()
    sources: list[dict] = []

    for match in matches:
        key = (match["documentId"], match["fileName"])
        if key in seen:
            continue
        seen.add(key)
        sources.append(
            {
                "fileName": match["fileName"],
                "documentId": match["documentId"],
            }
        )

    return sources


def build_answer(organization_id: str, question: str, top_k: int = 5) -> dict:
    query_embedding = create_query_embedding(question)
    matches = query_organization_chunks(
        organization_id=organization_id,
        query_embedding=query_embedding,
        top_k=top_k,
    )

    relevant_matches = [
        match
        for match in matches
        if match["score"] >= settings.min_match_score and match["text"].strip()
    ]

    if not relevant_matches:
        return {
            "answer": NO_CONTEXT_ANSWER,
            "sources": [],
            "matches": matches,
        }

    answer = generate_answer(question, relevant_matches)

    return {
        "answer": answer,
        "sources": _extract_sources(relevant_matches),
        "matches": matches,
    }
