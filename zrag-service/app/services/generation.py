from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

from app.config import settings

ANSWER_PROMPT = PromptTemplate(
    template="""You are a helpful customer support assistant for a company.
Answer the question using ONLY the provided context from company documents.
If you don't know the answer from the context, say you do not have that information and suggest contacting support.
Be concise, accurate, and friendly.

Context:
{context}

Question: {question}""",
    input_variables=["context", "question"],
)


def format_docs(matches: list[dict]) -> str:
    return "\n\n".join(
        f"[{match['fileName']}]\n{match['text']}" for match in matches
    )


def _get_llm() -> ChatHuggingFace:
    endpoint = HuggingFaceEndpoint(
        repo_id=settings.huggingface_generation_model,
        task="text-generation",
        max_new_tokens=settings.huggingface_generation_max_tokens,
        temperature=0.2,
        huggingfacehub_api_token=settings.huggingface_api_key or None,
    )
    return ChatHuggingFace(llm=endpoint)


def generate_answer(question: str, matches: list[dict]) -> str:
    if not settings.huggingface_api_key:
        raise ValueError("HUGGINGFACE_API_KEY is not configured")

    context = format_docs(matches)
    chain = ANSWER_PROMPT | _get_llm() | StrOutputParser()
    result = chain.invoke({"context": context, "question": question})

    if not result or not str(result).strip():
        raise ValueError("LLM returned an empty response")

    return str(result).strip()