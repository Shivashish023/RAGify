from fastapi import APIRouter, Header, HTTPException

from app.config import settings
from app.schemas.answer_schema import AnswerRequest, AnswerResponse
from app.services.answer import build_answer

router = APIRouter(prefix="/api", tags=["answer"])


def verify_internal_api_key(x_internal_api_key: str | None) -> None:
    if x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Invalid internal API key")


@router.post("/answer", response_model=AnswerResponse)
async def answer_question(
    payload: AnswerRequest,
    x_internal_api_key: str | None = Header(default=None),
):
    verify_internal_api_key(x_internal_api_key)

    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    try:
        result = build_answer(
            organization_id=payload.organizationId,
            question=payload.question.strip(),
            top_k=payload.topK,
        )
    except ValueError as exc:
        detail = str(exc)
        if "HUGGINGFACE_API_KEY" in detail:
            raise HTTPException(status_code=503, detail=detail) from exc
        raise HTTPException(status_code=422, detail=detail) from exc
    except Exception as exc:
        detail = f"Answer generation failed: {exc}"
        print(detail)
        raise HTTPException(status_code=422, detail=detail) from exc

    return AnswerResponse(**result)
