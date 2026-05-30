from pydantic import BaseModel, HttpUrl


class IngestRequest(BaseModel):
    organizationId: str
    documentId: str
    fileUrl: HttpUrl
    fileType: str
    fileName: str


class IngestResponse(BaseModel):
    success: bool
    documentId: str
    chunkCount: int
    textLength: int
