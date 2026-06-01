from pydantic import BaseModel


class AnswerRequest(BaseModel):
    organizationId: str
    question: str
    topK: int = 5


class RetrievedMatch(BaseModel):
    text: str
    fileName: str
    documentId: str
    chunkIndex: int
    score: float


class AnswerSource(BaseModel):
    fileName: str
    documentId: str


class AnswerResponse(BaseModel):
    answer: str
    sources: list[AnswerSource]
    matches: list[RetrievedMatch]
