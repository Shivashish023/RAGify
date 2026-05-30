import axios from "axios";

const ragApi = axios.create({
  baseURL: process.env.RAG_SERVICE_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "x-internal-api-key": process.env.RAG_SERVICE_API_KEY || "dev-internal-secret",
  },
});

export async function ingestDocument(document) {
  const { data } = await ragApi.post("/api/ingest", {
    organizationId: document.organizationId.toString(),
    documentId: document._id.toString(),
    fileUrl: document.cloudinaryUrl,
    fileType: document.fileType,
    fileName: document.originalName,
  });

  return data;
}
