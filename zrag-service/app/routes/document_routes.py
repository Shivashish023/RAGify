from fastapi import APIRouter, Header, HTTPException

from app.config import settings
from app.services.pinecone_service import delete_document_vectors

router = APIRouter(prefix="/api", tags=["document"])


def verify_internal_api_key(x_internal_api_key: str | None) -> None:
    if x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal API key")


@router.delete("/document/{document_id}")
async def delete_document(
    document_id: str,
    x_internal_api_key: str | None = Header(default=None),
):
    verify_internal_api_key(x_internal_api_key)

    try:
        delete_document_vectors(document_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to delete document vectors: {exc}") from exc

    return {"success": True}
