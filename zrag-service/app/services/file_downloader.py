import httpx


async def download_file(file_url: str) -> bytes:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(file_url)
        response.raise_for_status()
        return response.content
