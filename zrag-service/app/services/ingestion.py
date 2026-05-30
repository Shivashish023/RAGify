from app.services.chunker import split_text
from app.services.file_downloader import download_file
from app.services.text_extractor import extract_text


async def ingest_file(file_url: str, file_type: str) -> tuple[str, list[str]]:
    file_bytes = await download_file(file_url)
    text = extract_text(file_bytes, file_type)

    if not text.strip():
        raise ValueError("No readable text found in document")

    chunks = split_text(text)
    return text, chunks
