from io import BytesIO

import mammoth
from pypdf import PdfReader


def extract_text(file_bytes: bytes, file_type: str) -> str:
    if file_type == "pdf":
        return extract_pdf_text(file_bytes)

    if file_type == "docx":
        return extract_docx_text(file_bytes)

    if file_type == "txt":
        return file_bytes.decode("utf-8", errors="ignore")

    raise ValueError("Unsupported file type")


def extract_pdf_text(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def extract_docx_text(file_bytes: bytes) -> str:
    result = mammoth.extract_raw_text(BytesIO(file_bytes))
    return result.value.strip()
