from fastapi import APIRouter, Header, HTTPException

from app.config import settings
from app.schemas.ingest_schema import IngestRequest, IngestResponse
from app.services.embeddings import create_embeddings
from app.services.ingestion import ingest_file
from app.services.pinecone_service import upsert_document_chunks

router = APIRouter(prefix="/api", tags=["ingest"])
SUPPORTED_FILE_TYPES = {"pdf", "docx", "txt"}


def verify_internal_api_key(x_internal_api_key: str | None) -> None:
    if x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal API key")


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(
    payload: IngestRequest,
    x_internal_api_key: str | None = Header(default=None),
):
    verify_internal_api_key(x_internal_api_key)

    if payload.fileType not in SUPPORTED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        text, chunks = await ingest_file(str(payload.fileUrl), payload.fileType)
    except Exception as exc:
        detail = f"Text extraction failed: {exc}"
        print(detail)
        raise HTTPException(status_code=422, detail=detail) from exc

    try:
        embeddings = create_embeddings(chunks)
    except Exception as exc:
        detail = f"Hugging Face embedding failed: {exc}"
        print(detail)
        raise HTTPException(status_code=422, detail=detail) from exc

    try:
        upsert_document_chunks(
            organization_id=payload.organizationId,
            document_id=payload.documentId,
            file_name=payload.fileName,
            chunks=chunks,
            embeddings=embeddings,
        )
    except Exception as exc:
        detail = f"Pinecone upsert failed: {exc}"
        print(detail)
        raise HTTPException(status_code=422, detail=detail) from exc

    return IngestResponse(
        success=True,
        documentId=payload.documentId,
        chunkCount=len(chunks),
        textLength=len(text),
    )
