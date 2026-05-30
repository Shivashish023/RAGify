from fastapi import APIRouter, Header, HTTPException

from app.config import settings
from app.schemas.ingest_schema import IngestRequest, IngestResponse
from app.services.file_downloader import download_file
from app.services.text_extractor import extract_text

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
        file_bytes = await download_file(str(payload.fileUrl))
        text = extract_text(file_bytes, payload.fileType)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Unable to extract text: {exc}") from exc

    if not text.strip():
        raise HTTPException(status_code=422, detail="No readable text found in document")

    chunk_count = max(1, (len(text) + 2999) // 3000)

    return IngestResponse(
        success=True,
        documentId=payload.documentId,
        chunkCount=chunk_count,
        textLength=len(text),
    )
